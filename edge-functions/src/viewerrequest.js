'use strict';

const customContentHeader = 'x-content-pool';

function parseCookies(headers) {
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

exports.handler = async function(event, context, callback) {
    console.log("viewerrequest");
    console.log(event);
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    const parsedCookies = parseCookies(headers);
    let pooldest = 'a'
    
    if(parsedCookies && parsedCookies['pool']){
        pooldest = parsedCookies['pool'];
    }

    request.headers[customContentHeader] = [{ key: customContentHeader, value: pooldest}];

    callback(null, request);
};
