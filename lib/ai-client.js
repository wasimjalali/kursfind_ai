/**
 * Centralized AI Client with GPT-4o-mini Primary and DeepSeek Fallback
 * 
 * This module provides a unified interface for LLM API calls with automatic
 * fallback handling for reliability and cost optimization.
 * 
 * Primary: GPT-4o-mini (OpenAI) - Faster, cheaper, excellent function calling
 * Fallback: DeepSeek Chat (V3) - Reliable backup for high-load scenarios
 */

import OpenAI from 'openai';

// ═══════════════════════════════════════════════════════════════
// CLIENT CONFIGURATION (Lazy Initialization)
// ═══════════════════════════════════════════════════════════════

// Lazy client initialization to prevent build-time errors
let openaiClient = null;
let deepseekClient = null;

function getOpenAIClient() {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      // baseURL defaults to https://api.openai.com/v1
    });
  }
  return openaiClient;
}

function getDeepSeekClient() {
  if (!deepseekClient) {
    deepseekClient = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
    });
  }
  return deepseekClient;
}

// ═══════════════════════════════════════════════════════════════
// MODEL CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const PRIMARY_MODEL = 'gpt-4o-mini';
const FALLBACK_MODEL = 'deepseek-chat';
const DEFAULT_TIMEOUT = 15000; // 15 seconds
const FALLBACK_TIMEOUT = 30000; // 30 seconds for fallback

// ═══════════════════════════════════════════════════════════════
// MAIN FUNCTION: callLLMWithFallback
// ═══════════════════════════════════════════════════════════════

/**
 * Makes an LLM API call with automatic fallback from GPT-4o-mini to DeepSeek
 * 
 * @param {Array} messages - Array of message objects with role and content
 * @param {Array|undefined} tools - Optional array of tool/function definitions
 * @param {Object} options - Additional options (temperature, max_tokens, tool_choice, etc.)
 * @returns {Promise<Object>} - OpenAI-compatible response object
 */
export async function callLLMWithFallback(messages, tools, options = {}) {
  const {
    temperature = 0.7,
    max_tokens = 1500,
    tool_choice,
    timeout = DEFAULT_TIMEOUT,
    ...restOptions
  } = options;

  // Build request payload
  const requestPayload = {
    model: PRIMARY_MODEL,
    messages,
    temperature,
    max_tokens,
    ...restOptions,
  };

  // Add tools if provided
  if (tools && tools.length > 0) {
    requestPayload.tools = tools;
    if (tool_choice) {
      requestPayload.tool_choice = tool_choice;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // TRY PRIMARY: GPT-4o-mini
  // ═══════════════════════════════════════════════════════════════
  
  try {
    console.log('[LLM] 🚀 Attempting primary model: GPT-4o-mini');
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await getOpenAIClient().chat.completions.create(requestPayload, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('[LLM] ✅ Primary model (GPT-4o-mini) succeeded');
    console.log('[LLM] 📊 Usage:', {
      prompt_tokens: response.usage?.prompt_tokens,
      completion_tokens: response.usage?.completion_tokens,
      total_tokens: response.usage?.total_tokens,
    });

    // Add metadata about which model was used
    response._modelUsed = PRIMARY_MODEL;
    response._fallbackUsed = false;

    return response;

  } catch (primaryError) {
    console.warn('[LLM] ⚠️ Primary model (GPT-4o-mini) failed:', primaryError.message);
    
    // Determine if we should fallback
    const shouldFallback = 
      primaryError.name === 'AbortError' || // Timeout
      primaryError.status === 429 || // Rate limit
      primaryError.status === 500 || // Server error
      primaryError.status === 502 || // Bad gateway
      primaryError.status === 503 || // Service unavailable
      primaryError.code === 'ECONNRESET' || // Connection reset
      primaryError.code === 'ETIMEDOUT' || // Connection timeout
      !process.env.OPENAI_API_KEY; // No API key configured

    if (!shouldFallback) {
      // For client errors (4xx except 429), don't fallback - throw immediately
      console.error('[LLM] ❌ Non-recoverable error, not falling back:', primaryError.message);
      throw primaryError;
    }

    // ═══════════════════════════════════════════════════════════════
    // FALLBACK: DeepSeek Chat
    // ═══════════════════════════════════════════════════════════════
    
    console.log('[LLM] 🔄 Falling back to DeepSeek Chat...');

    try {
      // Update model for fallback
      const fallbackPayload = {
        ...requestPayload,
        model: FALLBACK_MODEL,
      };

      // Create abort controller for fallback timeout
      const fallbackController = new AbortController();
      const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), FALLBACK_TIMEOUT);

      const fallbackResponse = await getDeepSeekClient().chat.completions.create(fallbackPayload, {
        signal: fallbackController.signal,
      });

      clearTimeout(fallbackTimeoutId);

      console.log('[LLM] ✅ Fallback model (DeepSeek) succeeded');
      console.log('[LLM] 📊 Usage:', {
        prompt_tokens: fallbackResponse.usage?.prompt_tokens,
        completion_tokens: fallbackResponse.usage?.completion_tokens,
        total_tokens: fallbackResponse.usage?.total_tokens,
      });

      // Add metadata about which model was used
      fallbackResponse._modelUsed = FALLBACK_MODEL;
      fallbackResponse._fallbackUsed = true;
      fallbackResponse._primaryError = primaryError.message;

      return fallbackResponse;

    } catch (fallbackError) {
      console.error('[LLM] ❌ Fallback model (DeepSeek) also failed:', fallbackError.message);
      
      // Both models failed - throw a combined error
      const combinedError = new Error(
        `Both LLM models failed. Primary (GPT-4o-mini): ${primaryError.message}. Fallback (DeepSeek): ${fallbackError.message}`
      );
      combinedError.primaryError = primaryError;
      combinedError.fallbackError = fallbackError;
      throw combinedError;
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Parse DeepSeek Custom Tool Call Format
// ═══════════════════════════════════════════════════════════════

/**
 * Parses DeepSeek's custom tool call format from message content
 * DeepSeek uses: <｜tool▁calls▁begin｜><｜tool▁call▁begin｜>function_name<｜tool▁sep｜>{"args"}<｜tool▁call▁end｜><｜tool▁calls▁end｜>
 * 
 * @param {string} content - Message content that may contain tool calls
 * @returns {Array} - Array of parsed tool call objects
 */
export function parseDeepSeekToolCalls(content) {
  if (!content || typeof content !== 'string') {
    return [];
  }

  const parsedToolCalls = [];
  const toolCallPattern = /<｜tool▁call▁begin｜>([^<]+)<｜tool▁sep｜>(\{[\s\S]*?\})<｜tool▁call▁end｜>/g;
  let match;

  while ((match = toolCallPattern.exec(content)) !== null) {
    const functionName = match[1].trim();
    const functionArgs = match[2].trim();

    try {
      // Validate JSON before adding
      JSON.parse(functionArgs);

      parsedToolCalls.push({
        id: `call_${Date.now()}_${parsedToolCalls.length}`,
        type: 'function',
        function: {
          name: functionName,
          arguments: functionArgs,
        },
      });
      console.log('[LLM] 🔍 Parsed DeepSeek tool call:', functionName);
    } catch (e) {
      console.error('[LLM] ❌ Error parsing tool call JSON:', e.message);

      // Try to extract valid JSON from potentially malformed response
      try {
        const jsonMatch = functionArgs.match(/\{[^{}]*\}/);
        if (jsonMatch) {
          JSON.parse(jsonMatch[0]); // Validate
          parsedToolCalls.push({
            id: `call_${Date.now()}_${parsedToolCalls.length}`,
            type: 'function',
            function: {
              name: functionName,
              arguments: jsonMatch[0],
            },
          });
          console.log('[LLM] 🔧 Recovered tool call with extracted JSON:', functionName);
        }
      } catch (e2) {
        console.error('[LLM] ❌ Could not recover tool call:', e2.message);
      }
    }
  }

  return parsedToolCalls;
}

/**
 * Cleans DeepSeek custom tokens from message content
 * 
 * @param {string} content - Message content with potential custom tokens
 * @returns {string} - Cleaned content
 */
export function cleanDeepSeekTokens(content) {
  if (!content || typeof content !== 'string') {
    return content;
  }
  return content.replace(/<｜tool▁calls▁begin｜>.*?<｜tool▁calls▁end｜>/gs, '').trim();
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Get Tool Calls from Response
// ═══════════════════════════════════════════════════════════════

/**
 * Extracts tool calls from an LLM response, handling both OpenAI and DeepSeek formats
 * 
 * @param {Object} response - LLM response object
 * @returns {Array} - Array of tool call objects
 */
export function getToolCallsFromResponse(response) {
  const message = response.choices?.[0]?.message;
  if (!message) {
    return [];
  }

  // Check for standard OpenAI tool_calls first
  if (message.tool_calls && message.tool_calls.length > 0) {
    return message.tool_calls;
  }

  // Check for DeepSeek custom format in content
  if (message.content && response._modelUsed === FALLBACK_MODEL) {
    const parsedCalls = parseDeepSeekToolCalls(message.content);
    if (parsedCalls.length > 0) {
      return parsedCalls;
    }
  }

  return [];
}

/**
 * Gets the message content from response, cleaning any custom tokens
 * 
 * @param {Object} response - LLM response object
 * @returns {string} - Cleaned message content
 */
export function getMessageContent(response) {
  const content = response.choices?.[0]?.message?.content;
  if (!content) {
    return '';
  }

  // Clean DeepSeek tokens if fallback was used
  if (response._fallbackUsed) {
    return cleanDeepSeekTokens(content);
  }

  return content;
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

const aiClient = {
  callLLMWithFallback,
  parseDeepSeekToolCalls,
  cleanDeepSeekTokens,
  getToolCallsFromResponse,
  getMessageContent,
  PRIMARY_MODEL,
  FALLBACK_MODEL,
};

export default aiClient;

