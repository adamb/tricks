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

    const clientLatitude = cf?.latitude || 'Not available';
    const clientLongitude = cf?.longitude || 'Not available';
    const coloLatitude = coloInfo.lat;
    const coloLongitude = coloInfo.lon;

    const distanceKm = (typeof clientLatitude === 'number' && typeof clientLongitude === 'number' &&
                        typeof coloLatitude === 'number' && typeof coloLongitude === 'number')
                        ? Math.round(getDistanceFromLatLonInKm(clientLatitude, clientLongitude, coloLatitude, coloLongitude))
                        : 'Not available';

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
        }
    };
}
