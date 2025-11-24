/**
 * OpenAI/DeepSeek Compatible Function Definitions
 * Based on Kursfind AI Supabase Schema
 * 
 * These functions enable the AI to query the database intelligently
 * during chat conversations.
 */

export const functionDefinitions = [
  // ═══════════════════════════════════════════════════════════════
  // 1. SEARCH COURSES
  // ═══════════════════════════════════════════════════════════════
  {
    type: "function",
    function: {
      name: "search_courses",
      description: "Searches for vocational training courses matching user criteria. Returns courses from the Kursfind AI database with details like title, location, duration, funding options, and provider information. Use this when users ask about courses, training programs, bootcamps, or specific skills.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Free-text search query for course title, description, or keywords (e.g., 'Web Development', 'Data Science', 'Pflege')"
          },
          category: {
            type: "string",
            description: "Course category filter",
            enum: [
              "IT & Tech",
              "Digital Marketing",
              "Design",
              "Business & Management",
              "Healthcare (Pflege)",
              "Project Management",
              "Data & Analytics",
              "Cybersecurity",
              "Other"
            ]
          },
          location: {
            type: "string",
            description: "City or region where the course takes place (e.g., 'Berlin', 'München', 'Online')"
          },
          format: {
            type: "string",
            description: "Course delivery format",
            enum: ["Online", "Präsenz", "Hybrid", "Vollzeit", "Teilzeit", "Abendkurs"]
          },
          funding_eligible: {
            type: "boolean",
            description: "Filter for courses eligible for Bildungsgutschein or other funding (true = only funded courses)"
          },
          funding_type: {
            type: "string",
            description: "Specific funding type",
            enum: ["Bildungsgutschein", "AVGS", "Aufstiegs-BAföG", "Bildungsprämie", "Self-funded"]
          },
          language: {
            type: "string",
            description: "Course language (e.g., 'Deutsch', 'English', 'Türkçe')"
          },
          start_date_from: {
            type: "string",
            format: "date",
            description: "Earliest acceptable start date (ISO format: YYYY-MM-DD)"
          },
          start_date_to: {
            type: "string",
            format: "date",
            description: "Latest acceptable start date (ISO format: YYYY-MM-DD)"
          },
          duration_min: {
            type: "string",
            description: "Minimum course duration (e.g., '3 Monate', '6 Wochen')"
          },
          duration_max: {
            type: "string",
            description: "Maximum course duration (e.g., '12 Monate', '1 Jahr')"
          },
          provider_id: {
            type: "string",
            description: "Filter by specific provider ID (text format)"
          },
          is_featured: {
            type: "boolean",
            description: "Show only featured/highlighted courses"
          },
          status: {
            type: "string",
            description: "Course status",
            enum: ["active", "inactive", "draft"],
            default: "active"
          },
          certificate_type: {
            type: "string",
            description: "Type of certificate awarded (e.g., 'IHK-Zertifikat', 'Träger-Zertifikat', 'Staatlich anerkannt')"
          },
          max_results: {
            type: "integer",
            description: "Maximum number of courses to return (default: 10, max: 50)",
            default: 10
          },
          offset: {
            type: "integer",
            description: "Pagination offset for results (default: 0)",
            default: 0
          },
          sort_by: {
            type: "string",
            description: "Sort results by field",
            enum: ["relevance", "start_date", "view_count", "application_count", "created_at"],
            default: "relevance"
          }
        },
        required: []
      }
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // 2. GET COURSE DETAILS
  // ═══════════════════════════════════════════════════════════════
  {
    type: "function",
    function: {
      name: "get_course_details",
      description: "Retrieves complete details for a specific course by ID or slug. Returns full course information including curriculum, learning objectives, career paths, prerequisites, and provider details. Use this when users ask about a specific course or need detailed information.",
      parameters: {
        type: "object",
        properties: {
          course_id: {
            type: "string",
            description: "Course ID (bigint as string) or course slug"
          },
          include_provider: {
            type: "boolean",
            description: "Include full provider details in response",
            default: true
          },
          include_similar: {
            type: "boolean",
            description: "Include similar/related courses",
            default: false
          }
        },
        required: ["course_id"]
      }
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // 3. SEARCH PROVIDERS
  // ═══════════════════════════════════════════════════════════════
  {
    type: "function",
    function: {
      name: "search_providers",
      description: "Searches for training providers (Bildungsträger) in the Kursfind AI network. Returns provider information including company name, location, certifications, and course offerings. Use this when users ask about specific training providers or want to compare providers.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Free-text search for provider name or description"
          },
          city: {
            type: "string",
            description: "Filter by provider city/location"
          },
          certification: {
            type: "string",
            description: "Filter by certification type (e.g., 'AZAV', 'ISO 9001', 'ZFU')"
          },
          year_founded_min: {
            type: "integer",
            description: "Minimum year founded (for established providers)"
          },
          has_courses: {
            type: "boolean",
            description: "Only show providers with active courses",
            default: true
          },
          max_results: {
            type: "integer",
            description: "Maximum number of providers to return (default: 10)",
            default: 10
          }
        },
        required: []
      }
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // 4. GET PROVIDER DETAILS
  // ═══════════════════════════════════════════════════════════════
  {
    type: "function",
    function: {
      name: "get_provider_details",
      description: "Retrieves complete details for a specific provider including their courses, FAQs, certifications, and contact information. Use this when users ask about a specific provider or need detailed provider information.",
      parameters: {
        type: "object",
        properties: {
          provider_id: {
            type: "string",
            description: "Provider ID (bigint as string) or provider_id (text)"
          },
          include_courses: {
            type: "boolean",
            description: "Include list of provider's courses",
            default: true
          },
          include_faqs: {
            type: "boolean",
            description: "Include provider FAQs",
            default: true
          },
          include_stats: {
            type: "boolean",
            description: "Include provider statistics (total courses, applications, etc.)",
            default: false
          }
        },
        required: ["provider_id"]
      }
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // 5. SEARCH APPLICATIONS (Student Context)
  // ═══════════════════════════════════════════════════════════════
  {
    type: "function",
    function: {
      name: "search_student_applications",
      description: "Searches for course applications submitted by the current logged-in student. Returns application status, course details, provider information, and timeline. Use this when students ask about 'my applications', 'application status', or 'courses I applied to'. IMPORTANT: Only works for authenticated students - requires student_id from session.",
      parameters: {
        type: "object",
        properties: {
          student_id: {
            type: "string",
            description: "Student ID (bigint as string) - automatically filled from session"
          },
          status: {
            type: "string",
            description: "Filter by application status",
            enum: ["pending", "contacted", "interview_scheduled", "accepted", "rejected", "enrolled", "withdrawn"]
          },
          course_id: {
            type: "string",
            description: "Filter by specific course ID"
          },
          provider_id: {
            type: "string",
            description: "Filter by specific provider ID"
          },
          funding_type: {
            type: "string",
            description: "Filter by funding type used in application"
          },
          has_funding_approved: {
            type: "boolean",
            description: "Filter by funding approval status"
          },
          applied_after: {
            type: "string",
            format: "date",
            description: "Show applications submitted after this date (ISO format)"
          },
          applied_before: {
            type: "string",
            format: "date",
            description: "Show applications submitted before this date (ISO format)"
          },
          sort_by: {
            type: "string",
            enum: ["applied_at", "updated_at", "status"],
            default: "applied_at"
          },
          sort_order: {
            type: "string",
            enum: ["asc", "desc"],
            default: "desc"
          }
        },
        required: ["student_id"]
      }
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // 6. SEARCH APPLICATIONS (Provider Context)
  // ═══════════════════════════════════════════════════════════════
  {
    type: "function",
    function: {
      name: "search_provider_applications",
      description: "Searches for applications received by the current logged-in provider. Returns student applications for provider's courses with contact details and status. Use this when providers ask about 'applications', 'new students', or 'pending applications'. IMPORTANT: Only works for authenticated providers - requires provider_id from session.",
      parameters: {
        type: "object",
        properties: {
          provider_id: {
            type: "string",
            description: "Provider ID (bigint as string) - automatically filled from session"
          },
          status: {
            type: "string",
            description: "Filter by application status",
            enum: ["pending", "contacted", "interview_scheduled", "accepted", "rejected", "enrolled", "withdrawn"]
          },
          course_id: {
            type: "string",
            description: "Filter by specific course ID"
          },
          provider_viewed: {
            type: "boolean",
            description: "Filter by whether provider has viewed the application"
          },
          has_funding_approved: {
            type: "boolean",
            description: "Filter by student's funding approval status"
          },
          applied_after: {
            type: "string",
            format: "date",
            description: "Show applications received after this date"
          },
          sort_by: {
            type: "string",
            enum: ["applied_at", "updated_at", "provider_viewed"],
            default: "applied_at"
          },
          max_results: {
            type: "integer",
            default: 20
          }
        },
        required: ["provider_id"]
      }
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // 7. SEARCH SAVED COURSES
  // ═══════════════════════════════════════════════════════════════
  {
    type: "function",
    function: {
      name: "search_saved_courses",
      description: "Retrieves courses saved/bookmarked by the current logged-in student. Returns saved courses with student's personal notes and save date. Use this when students ask about 'my saved courses', 'bookmarked courses', or 'courses I'm interested in'. IMPORTANT: Only works for authenticated students - requires student_id from session.",
      parameters: {
        type: "object",
        properties: {
          student_id: {
            type: "string",
            description: "Student ID (bigint as string) - automatically filled from session"
          },
          category: {
            type: "string",
            description: "Filter saved courses by category"
          },
          location: {
            type: "string",
            description: "Filter saved courses by location"
          },
          funding_type: {
            type: "string",
            description: "Filter saved courses by funding type"
          },
          has_notes: {
            type: "boolean",
            description: "Only show saved courses with personal notes"
          },
          saved_after: {
            type: "string",
            format: "date",
            description: "Show courses saved after this date"
          },
          sort_by: {
            type: "string",
            enum: ["saved_at", "course_title", "start_date"],
            default: "saved_at"
          },
          sort_order: {
            type: "string",
            enum: ["asc", "desc"],
            default: "desc"
          }
        },
        required: ["student_id"]
      }
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // 8. GET STUDENT PROFILE
  // ═══════════════════════════════════════════════════════════════
  {
    type: "function",
    function: {
      name: "get_student_profile",
      description: "Retrieves the current student's profile information including interests, education level, location preferences, and activity summary. Use this to personalize recommendations or when students ask about 'my profile' or 'my preferences'. IMPORTANT: Only works for authenticated students.",
      parameters: {
        type: "object",
        properties: {
          student_id: {
            type: "string",
            description: "Student ID (bigint as string) - automatically filled from session"
          },
          include_stats: {
            type: "boolean",
            description: "Include statistics (total applications, saved courses, etc.)",
            default: true
          }
        },
        required: ["student_id"]
      }
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // 9. GET COURSE STATISTICS
  // ═══════════════════════════════════════════════════════════════
  {
    type: "function",
    function: {
      name: "get_course_statistics",
      description: "Retrieves aggregated statistics about courses in the database. Use this when users ask about 'how many courses', 'most popular courses', 'trending courses', or general platform statistics.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "Get statistics for specific category only"
          },
          location: {
            type: "string",
            description: "Get statistics for specific location only"
          },
          funding_type: {
            type: "string",
            description: "Get statistics for specific funding type only"
          },
          time_period: {
            type: "string",
            description: "Time period for statistics",
            enum: ["last_7_days", "last_30_days", "last_90_days", "all_time"],
            default: "all_time"
          },
          metrics: {
            type: "array",
            items: {
              type: "string",
              enum: ["total_courses", "total_applications", "total_views", "avg_duration", "popular_categories", "popular_locations", "trending_courses"]
            },
            description: "Specific metrics to return"
          }
        },
        required: []
      }
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // 10. COMPARE COURSES
  // ═══════════════════════════════════════════════════════════════
  {
    type: "function",
    function: {
      name: "compare_courses",
      description: "Compares multiple courses side-by-side showing key differences in duration, price, funding, location, curriculum, and provider. Use this when users ask to 'compare courses' or want to see differences between specific courses.",
      parameters: {
        type: "object",
        properties: {
          course_ids: {
            type: "array",
            items: {
              type: "string"
            },
            description: "Array of course IDs to compare (2-5 courses)",
            minItems: 2,
            maxItems: 5
          },
          comparison_fields: {
            type: "array",
            items: {
              type: "string",
              enum: ["duration", "price", "funding", "location", "format", "start_dates", "curriculum", "prerequisites", "certificate", "provider", "reviews"]
            },
            description: "Specific fields to compare (default: all key fields)"
          }
        },
        required: ["course_ids"]
      }
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // 11. GET CHAT HISTORY
  // ═══════════════════════════════════════════════════════════════
  {
    type: "function",
    function: {
      name: "get_chat_history",
      description: "Retrieves previous chat conversations for the current student. Use this when users ask about 'previous conversations', 'chat history', or want to reference earlier discussions. IMPORTANT: Only works for authenticated students.",
      parameters: {
        type: "object",
        properties: {
          student_id: {
            type: "string",
            description: "Student ID (bigint as string) - automatically filled from session"
          },
          conversation_id: {
            type: "string",
            description: "Specific conversation UUID to retrieve"
          },
          limit: {
            type: "integer",
            description: "Maximum number of messages to return",
            default: 50
          },
          include_course_context: {
            type: "boolean",
            description: "Include course context information for each message",
            default: false
          }
        },
        required: ["student_id"]
      }
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // 12. RECOMMEND COURSES (AI-Powered)
  // ═══════════════════════════════════════════════════════════════
  {
    type: "function",
    function: {
      name: "recommend_courses",
      description: "Gets personalized course recommendations based on student profile, interests, previous applications, saved courses, and career goals. Uses AI matching to find best-fit courses. Use this when students ask for 'recommendations', 'what courses are good for me', or 'suggest courses'.",
      parameters: {
        type: "object",
        properties: {
          student_id: {
            type: "string",
            description: "Student ID for personalized recommendations (optional - uses session if available)"
          },
          career_goal: {
            type: "string",
            description: "User's career goal or target job (e.g., 'Web Developer', 'Data Analyst', 'Pflegefachkraft')"
          },
          current_skills: {
            type: "array",
            items: {
              type: "string"
            },
            description: "User's current skills or experience"
          },
          interests: {
            type: "array",
            items: {
              type: "string"
            },
            description: "User's interests or preferred topics"
          },
          constraints: {
            type: "object",
            properties: {
              max_duration: {
                type: "string",
                description: "Maximum acceptable duration"
              },
              location: {
                type: "string",
                description: "Preferred location"
              },
              format: {
                type: "string",
                description: "Preferred format (Online, Präsenz, Hybrid)"
              },
              funding_required: {
                type: "boolean",
                description: "Must be funding-eligible"
              }
            }
          },
          max_results: {
            type: "integer",
            default: 5,
            description: "Number of recommendations to return"
          }
        },
        required: []
      }
    }
  }
];

/**
 * USAGE EXAMPLE IN CHAT ROUTE:
 * 
 * import { functionDefinitions } from './function-definitions'
 * 
 * const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
 *   },
 *   body: JSON.stringify({
 *     model: 'deepseek-chat',
 *     messages: conversationMessages,
 *     tools: functionDefinitions,  // <-- Add function definitions here
 *     tool_choice: 'auto',
 *     temperature: 0.7
 *   })
 * })
 * 
 * // Handle function calls in response
 * if (responseData.choices[0].message.tool_calls) {
 *   for (const toolCall of responseData.choices[0].message.tool_calls) {
 *     const functionName = toolCall.function.name
 *     const functionArgs = JSON.parse(toolCall.function.arguments)
 *     
 *     // Execute the function and get results
 *     const functionResult = await executeFunctionCall(functionName, functionArgs)
 *     
 *     // Add function result back to conversation
 *     conversationMessages.push({
 *       role: 'tool',
 *       tool_call_id: toolCall.id,
 *       content: JSON.stringify(functionResult)
 *     })
 *   }
 *   
 *   // Make another API call with function results
 *   const finalResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
 *     },
 *     body: JSON.stringify({
 *       model: 'deepseek-chat',
 *       messages: conversationMessages,
 *       temperature: 0.7
 *     })
 *   })
 * }
 */

// Export individual functions for easier imports
export const searchCoursesFunction = functionDefinitions[0];
export const getCourseDetailsFunction = functionDefinitions[1];
export const searchProvidersFunction = functionDefinitions[2];
export const getProviderDetailsFunction = functionDefinitions[3];
export const searchStudentApplicationsFunction = functionDefinitions[4];
export const searchProviderApplicationsFunction = functionDefinitions[5];
export const searchSavedCoursesFunction = functionDefinitions[6];
export const getStudentProfileFunction = functionDefinitions[7];
export const getCourseStatisticsFunction = functionDefinitions[8];
export const compareCoursesFunction = functionDefinitions[9];
export const getChatHistoryFunction = functionDefinitions[10];
export const recommendCoursesFunction = functionDefinitions[11];

