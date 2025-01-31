import dcColos from '../../lib/DC-Colos.json';

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
    
    const coloInfo = dcColos[cf?.colo] || { name: 'Unknown', lat: 'Not available', lon: 'Not available' };

    const clientLatitude = parseFloat(cf?.latitude) || 'Not available';
    const clientLongitude = parseFloat(cf?.longitude) || 'Not available';
    const coloLatitude = parseFloat(coloInfo.lat);
    const coloLongitude = parseFloat(coloInfo.lon);

    const distanceKm = (!isNaN(clientLatitude) && !isNaN(clientLongitude) &&
                        !isNaN(coloLatitude) && !isNaN(coloLongitude))
                        ? Math.round(getDistanceFromLatLonInKm(clientLatitude, clientLongitude, coloLatitude, coloLongitude))
                        : 'Not available';

    // Store visit data in KV
    if (platform?.env?.VISITOR_STATS && distanceKm !== 'Not available') {
        const colo = cf?.colo || 'unknown';
        const timestamp = Date.now();
        
        // Store this visit
        await platform.env.VISITOR_STATS.put(
            `visit:${colo}:${timestamp}`,
            JSON.stringify({
                distance: distanceKm,
                timestamp
            })
        );

        // Get recent visits (last 24 hours)
        const listOpts = {
            prefix: `visit:${colo}:`,
            limit: 1000
        };
        const visits = await platform.env.VISITOR_STATS.list(listOpts);
        const recentVisits = visits.keys
            .filter(key => (timestamp - parseInt(key.name.split(':')[2])) < 24 * 60 * 60 * 1000)
            .map(key => parseInt(key.name.split(':')[2]));

        // Calculate statistics
        const stats = {
            totalVisitorsToThisColo: recentVisits.length,
            averageDistance: Math.round(distanceKm), // For now, just the current distance
            recentVisits: recentVisits.length
        };

        return {
            clientInfo: {
                // Client Geographic Info
                latitude: clientLatitude,
                longitude: clientLongitude,
                
                // Cloudflare Worker Info
                datacenter: cf?.colo || 'Not available',
                coloName: coloInfo.name,
                coloLatitude: coloLatitude,
                coloLongitude: coloLongitude,
                distanceKm: distanceKm
            },
            stats
        };
    }

    return {
        clientInfo: {
            latitude: clientLatitude,
            longitude: clientLongitude,
            datacenter: cf?.colo || 'Not available',
            coloName: coloInfo.name,
            coloLatitude: coloLatitude,
            coloLongitude: coloLongitude,
            distanceKm: distanceKm
        }
    };
}
