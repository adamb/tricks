export async function load({ request }) {
    // Get raw Cloudflare data from the request object
    const cf = request.cf || {};
    
    return {
        clientInfo: {
            // Raw CF object
            rawCf: cf,
            // Additional headers
            headers: {
                rayID: request.headers.get('cf-ray'),
                userAgent: request.headers.get('user-agent')
            }
        }
    };
}
