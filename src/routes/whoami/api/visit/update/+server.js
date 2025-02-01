export async function POST({ request, platform }) {
    if (!platform?.env?.VISITOR_STATS || !platform?.env?.UPDATE_API_SECRET) {
        return new Response(JSON.stringify({ error: 'Required environment variables not available' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const { visitKey, clientIP, secret } = await request.json();
    
    if (!visitKey || !clientIP || !secret) {
        return new Response(JSON.stringify({ error: 'Missing required data' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // Validate the secret - accept either platform or vite secret
        const platformSecret = platform.env.UPDATE_API_SECRET;
        const viteSecret = platform.env.VITE_UPDATE_API_SECRET;
        
        if (secret !== platformSecret && secret !== viteSecret) {
            return new Response(JSON.stringify({ error: 'Invalid secret' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get existing visit data
        const existingData = await platform.env.VISITOR_STATS.get(visitKey, { type: 'json' });
        if (!existingData) {
            return new Response(JSON.stringify({ error: 'Visit not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Update with client IP
        const updatedData = {
            ...existingData,
            clientIP
        };

        // Store updated data
        await platform.env.VISITOR_STATS.put(visitKey, JSON.stringify(updatedData));

        return new Response(JSON.stringify(updatedData), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
