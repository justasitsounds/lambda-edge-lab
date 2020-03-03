'use strict';

// the S3 origins that correspond to content for Pool A and Pool B
const origins = require('./origins_config.js');

// the `pool` cookie determines which origin to route to
const cookieName = 'pool';

const parseCookies = (headers) => {
    const parsedCookie = {};
    if (headers.cookie) {
        headers.cookie[0].value.split(';').forEach((cookie) => {
            if (cookie) {
                const parts = cookie.split('=');
                parsedCookie[parts[0].trim()] = parts[1].trim();
            }
        });
    }
    return parsedCookie;
}

// changes request origin depending on value of the `pool` cookie 
exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    const requestOrigin = request.origin.s3;
    const parsedCookies = parseCookies(headers);

    let targetPool = parsedCookies[cookieName];
    let s3Origin = `${origins[targetPool]}.s3.ap-southeast-2.amazonaws.com`;
    
    requestOrigin.region = 'ap-southeast-2'; 
    requestOrigin.domainName = s3Origin;
    headers['host'] = [{ key: 'host', value: s3Origin }];

    callback(null, request);
};
