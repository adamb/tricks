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

    let coloStats = null;
    
    // Store visit data in KV
    console.log('Platform env:', platform?.env);
    console.log('KV binding available:', !!platform?.env?.VISITOR_STATS);
    console.log('Distance:', distanceKm);
    
    if (platform?.env?.VISITOR_STATS && distanceKm !== 'Not available') {
        const colo = cf?.colo || 'unknown';
        const timestamp = Date.now();
        
        // Create visit key
        const visitKey = `visit:${colo}:${timestamp}`;
        
        // Store this visit
        await platform.env.VISITOR_STATS.put(
            visitKey,
            JSON.stringify({
                distance: distanceKm
            })
        );

        // Get all colos that have had visits
        const allKeys = await platform.env.VISITOR_STATS.list();
        coloStats = {};
        
        // Group keys by colo
        const coloVisits = {};
        allKeys.keys.forEach(key => {
            const [_, visitColo, visitTime] = key.name.split(':');
            if (!coloVisits[visitColo]) {
                coloVisits[visitColo] = [];
            }
            coloVisits[visitColo].push(parseInt(visitTime));
        });

        // Calculate stats for each colo
        for (const [coloCd, visits] of Object.entries(coloVisits)) {
            const recentVisits = visits.filter(time => (timestamp - time) < 24 * 60 * 60 * 1000);
            coloStats[coloCd] = {
                totalVisitorsToThisColo: recentVisits.length,
                averageDistance: Math.round(distanceKm), // Using current distance for now
                recentVisits: recentVisits.length,
                name: (dcColos[coloCd] || {}).name || 'Unknown Location'
            };
        }

        // Ensure current colo exists in stats even if no visits
        if (!coloStats[colo]) {
            coloStats[colo] = {
                totalVisitorsToThisColo: 1,
                averageDistance: Math.round(distanceKm),
                recentVisits: 1,
                name: coloInfo.name
            };
        }
    }

    return {
        clientInfo: {
            latitude: clientLatitude,
            longitude: clientLongitude,
            datacenter: cf?.colo || 'Not available',
            coloName: coloInfo.name,
            coloLatitude: coloLatitude,
            coloLongitude: coloLongitude,
            distanceKm: distanceKm,
            visitKey: platform?.env?.VISITOR_STATS ? `visit:${cf?.colo}:${Date.now()}` : null
        },
        stats: coloStats
    };
}
