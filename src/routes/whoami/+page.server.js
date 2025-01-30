export async function load({ request, platform }) {
    // platform.context gives us access to the Cloudflare worker context
    const cf = platform.request.cf;
    
    return {
        clientInfo: {
            ip: cf.ip,
            country: cf.country,
            city: cf.city,
            continent: cf.continent,
            latitude: cf.latitude,
            longitude: cf.longitude,
            timezone: cf.timezone,
            region: cf.region,
            regionCode: cf.regionCode,
            asn: cf.asn,
            asOrganization: cf.asOrganization,
            postalCode: cf.postalCode,
            httpProtocol: cf.httpProtocol,
            tlsVersion: cf.tlsVersion,
            browser: request.headers.get('user-agent')
        }
    };
}
