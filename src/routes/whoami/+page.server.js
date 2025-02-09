import dcColos from '../../lib/DC-Colos.json';
import { sendEmail } from '$lib/emailSender';

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
    let visitKey = null;
    
    // Store visit data in KV
    console.log('Platform env:', platform?.env);
    console.log('KV binding available:', !!platform?.env?.VISITOR_STATS);
    console.log('Distance:', distanceKm);
    console.log('Current datacenter:', cf?.colo);
    
    if (platform?.env?.VISITOR_STATS && distanceKm !== 'Not available') {
        const colo = cf?.colo || 'unknown';
        const timestamp = Date.now();
        
        // Create visit key
        visitKey = `visit:${colo}:${timestamp}`;
        
        // Store this visit
        await platform.env.VISITOR_STATS.put(
            visitKey,
            JSON.stringify({
                distance: distanceKm
            })
        );

        // Get all colos that have had visits (handling pagination)
        let allKeys = [];
        let cursor;
        do {
            const listResult = await platform.env.VISITOR_STATS.list({ cursor, limit: 1000 });
            allKeys.push(...listResult.keys);
            cursor = listResult.cursor;
        } while (cursor);

        coloStats = {};
        
        // Group keys by colo
        const coloVisits = {};
        allKeys.forEach(key => {
            const [_, visitColo, visitTime] = key.name.split(':');
            if (!coloVisits[visitColo]) {
                coloVisits[visitColo] = [];
            }
            coloVisits[visitColo].push(parseInt(visitTime));
        });

        
        // Calculate stats for each colo
        for (const [coloCd, visits] of Object.entries(coloVisits)) {
            // Get all visit data for this colo
            const visitDistances = await Promise.all(
                visits.map(async (time) => {
                    const key = `visit:${coloCd}:${time}`;
                    const data = await platform.env.VISITOR_STATS.get(key, { type: 'json' });
                    return data?.distance || null;
                })
            );
            
            // Filter out null values and calculate stats
            const validDistances = visitDistances.filter(d => d !== null);
            const averageDistance = validDistances.length > 0
                ? Math.round(validDistances.reduce((a, b) => a + b, 0) / validDistances.length)
                : 0;
            const previousMaxDistance = validDistances.length > 0
                ? Math.round(Math.max(...validDistances))
                : 0;
            
            // Check if current visitor sets new max for their colo
            const isNewMax = coloCd === colo && distanceKm > previousMaxDistance;
            const maxDistance = isNewMax ? distanceKm : previousMaxDistance;

            // Check if this is the first visitor
            const isFirstVisitor = coloCd === colo && visits.length === 1;

            coloStats[coloCd] = {
                totalVisitorsToThisColo: visits.length,
                averageDistance,
                maxDistance,
                isNewMax,
                isFirstVisitor,
                recentVisits: visits.length,
                name: (dcColos[coloCd] || {}).name || 'Unknown Location'
            };
        }

        // Ensure current colo exists in stats even if no visits
        console.log('Checking if colo exists in stats:', {
            colo,
            existingStats: !!coloStats[colo]
        });
        
        if (!coloStats[colo]) {
            console.log('New datacenter detected:', colo);
            coloStats[colo] = {
                totalVisitorsToThisColo: 1,
                averageDistance: Math.round(distanceKm),
                maxDistance: distanceKm,
                isNewMax: true,  // It's automatically a record for a new colo
                isFirstVisitor: true,  // It's automatically the first visitor
                recentVisits: 1,
                name: coloInfo.name
            };

            // Get client IP from request
            const clientIP = request.headers.get('cf-connecting-ip') || 'Unknown IP';

            console.log('New datacenter detected - before email attempt:', {
                colo,
                coloInfo,
                platformEnvKeys: platform?.env ? Object.keys(platform.env) : [],
                hasMailhopCreds: !!platform?.env?.MAILHOP_CREDS
            });

            try {
                console.log('Email parameters:', {
                    to: 'admin@selfie.pr',
                    subject: `New Datacenter Detected: ${coloInfo.name} (${colo})`,
                    platformExists: !!platform,
                    platformEnv: platform?.env ? Object.keys(platform.env) : 'no env'
                });

                const emailResult = await sendEmail({
                    to: 'admin@selfie.pr',
                    subject: `New Datacenter Detected: ${coloInfo.name} (${colo})`,
                    text: `A new Cloudflare datacenter has been detected:\n\n` +
                          `Datacenter: ${coloInfo.name} (${colo})\n` +
                          `Location: ${coloInfo.lat}, ${coloInfo.lon}\n` +
                          `First Visitor Distance: ${distanceKm}km\n` +
                          `Client IP: ${clientIP}`,
                    platform
                });

                console.log('Email send attempt completed:', {
                    success: !!emailResult,
                    result: emailResult
                });
            } catch (error) {
                console.error('Email send error:', {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                    platformExists: !!platform,
                    platformEnvExists: !!platform?.env
                });
            }
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
            visitKey: visitKey || null
        },
        stats: coloStats
    };
}
