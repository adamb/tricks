export async function load({ request, platform }) {
    // Get Cloudflare data from the request object
    const cf = request.cf;
    const clientIP = request?.cf?.ip || 'Not available';
    
    // Get Worker's IP from ipify
    let workerIP = 'Not available';
    let workerIpapiData = {};
    
    try {
        const ipifyResponse = await fetch('https://api.ipify.org');
        workerIP = await ipifyResponse.text();
        
        // Get worker IP location data from ipapi
        const workerIpapiResponse = await fetch(`https://api.ipapi.com/${workerIP}?access_key=${platform.env.IPAPI_KEY}`);
        workerIpapiData = await workerIpapiResponse.json();
    } catch (error) {
        console.error('Error fetching worker IP data:', error);
        workerIpapiData = { error: 'Failed to fetch worker location data' };
    }

    // Get client IP location data from ipapi
    let clientIpapiData = {};
    try {
        const clientIpapiResponse = await fetch(`https://api.ipapi.com/${clientIP}?access_key=${platform.env.IPAPI_KEY}`);
        clientIpapiData = await clientIpapiResponse.json();
    } catch (error) {
        console.error('Error fetching client IP data:', error);
        clientIpapiData = { error: 'Failed to fetch client location data' };
    }

    return {
        clientInfo: {
            // Client Network Info
            ip: clientIP,
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
            clientTrustScore: cf?.clientTrustScore || 'Not available',

            // Worker IP Info
            workerIP: workerIP,
            workerLocation: workerIpapiData,

            // Client IP Location
            clientLocation: clientIpapiData
        }
    };
}
