export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    // GET /status - Read status
    if (request.method === 'GET' && url.pathname === '/status') {
      const status = await env.MELORA_STATUS.get('current_status');
      
      if (!status) {
        return new Response(JSON.stringify({ text: "online", mood: "online", timestamp: Date.now() }), { headers });
      }
      return new Response(status, { headers });
    }

    // POST /status - Update status (Protected)
    if (request.method === 'POST' && url.pathname === '/status') {
      const authKey = request.headers.get('Authorization');
      if (authKey !== `Bearer ${env.API_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
      }

      try {
        const body = await request.json();
        if (!body.timestamp) body.timestamp = Date.now();
        
        await env.MELORA_STATUS.put('current_status', JSON.stringify(body));
        return new Response(JSON.stringify({ success: true, data: body }), { 
          status: 200,
          headers
        });
      } catch (e) {
        return new Response('Bad Request', { status: 400 });
      }
    }

    return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404, headers });
  },
};
