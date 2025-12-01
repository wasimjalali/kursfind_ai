/**
 * Health Check API Endpoint
 * Used by the PWA to check connectivity status
 */

export async function GET() {
  return Response.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}
