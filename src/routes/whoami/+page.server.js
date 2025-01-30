export async function load({ request }) {
    // Get Cloudflare data from the request object
    const cf = request.cf;
    
    return {
        clientInfo: {
            ip: cf?.ip || 'Not available',
            country: cf?.country || 'Not available',
            city: cf?.city || 'Not available',
            continent: cf?.continent || 'Not available',
            latitude: cf?.latitude || 'Not available',
            longitude: cf?.longitude || 'Not available',
            timezone: cf?.timezone || 'Not available',
            region: cf?.region || 'Not available',
            regionCode: cf?.regionCode || 'Not available',
            asn: cf?.asn || 'Not available',
            asOrganization: cf?.asOrganization || 'Not available',
            postalCode: cf?.postalCode || 'Not available',
            httpProtocol: cf?.httpProtocol || 'Not available',
            tlsVersion: cf?.tlsVersion || 'Not available',
            browser: request.headers.get('user-agent') || 'Not available'
        }
    };
}
