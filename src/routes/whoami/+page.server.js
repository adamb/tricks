function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2-lat1);
    const dLon = deg2rad(lon2-lon1); 
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

export async function load({ request, platform }) {
    // Get Cloudflare data from the request object
    const cf = request.cf;
    
    // Get Worker's IP from ipify
    let workerIP = 'Not available';
    let workerIpapiData = {};
    
    try {
        const ipifyResponse = await fetch('https://api.ipify.org');
        workerIP = await ipifyResponse.text();
        
        // Get worker IP location data from ip-api.com
        const workerIpapiResponse = await fetch(`http://ip-api.com/json/${workerIP}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
        workerIpapiData = await workerIpapiResponse.json();
        
        if (workerIpapiData.status !== 'success') {
            throw new Error(workerIpapiData.message || 'IP lookup failed');
        }
    } catch (error) {
        console.error('Error fetching worker IP data:', error);
        workerIpapiData = { error: 'Failed to fetch worker location data' };
    }


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
            clientTrustScore: cf?.clientTrustScore || 'Not available',

            // Worker IP Info
            workerIP: workerIP,
            workerLocation: workerIpapiData,
            
            // Distance between client and worker
            distanceKm: cf?.latitude && cf?.longitude && workerIpapiData?.lat && workerIpapiData?.lon 
                ? Math.round(getDistanceFromLatLonInKm(
                    cf.latitude,
                    cf.longitude,
                    workerIpapiData.lat,
                    workerIpapiData.lon
                  ))
                : 'Not available'
        }
    };
}
