export async function handler(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      status: 'ok',
      service: 'WorldPulse Live News Wire',
      environment: 'netlify-production',
      timestamp: Date.now(),
    }),
  };
}
