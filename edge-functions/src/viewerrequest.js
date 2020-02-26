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
    console.log(JSON.stringify(event));
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    const parsedCookies = parseCookies(headers);
    let targetPool = 'a'
    
    if(parsedCookies && parsedCookies['pool']){
        targetPool = parsedCookies['pool'];
    }

    request.headers['Set-Cookie'] = [{key: 'Set-Cookie',value:'pool=' + targetPool}];
    request.headers[customContentHeader] = [{ key: customContentHeader, value: targetPool}];

    console.log(JSON.stringify(request));

    callback(null, request);
};
