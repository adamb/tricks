export async function load({ request }) {
    // Get Cloudflare data from the request object
    const cf = request.cf;
    
    return {
        clientInfo: {
            // Client Network Info
            ip: cf?.ip || 'Not available',
            asn: cf?.asn || 'Not available',
            asOrganization: cf?.asOrganization || 'Not available',
            httpProtocol: cf?.httpProtocol || 'Not available',
            tlsVersion: cf?.tlsVersion || 'Not available',
            browser: request.headers.get('user-agent') || 'Not available',
            
            // Geographic Info
            country: cf?.country || 'Not available',
            city: cf?.city || 'Not available',
            continent: cf?.continent || 'Not available',
            latitude: cf?.latitude || 'Not available',
            longitude: cf?.longitude || 'Not available',
            timezone: cf?.timezone || 'Not available',
            region: cf?.region || 'Not available',
            regionCode: cf?.regionCode || 'Not available',
            postalCode: cf?.postalCode || 'Not available',
            
            // Cloudflare Worker Info
            datacenter: cf?.colo || 'Not available',
            rayID: request.headers.get('cf-ray') || 'Not available',
            workerVersion: cf?.workerVersion || 'Not available',
            requestPriority: cf?.requestPriority || 'Not available',
            tlsCipher: cf?.tlsCipher || 'Not available',
            botManagement: cf?.botManagement?.score || 'Not available',
            clientTrustScore: cf?.clientTrustScore || 'Not available'
        }
    };
}
