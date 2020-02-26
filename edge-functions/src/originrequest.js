'use strict';

const buckets = {
    a:'ab-test-a.s3.ap-southeast-2.amazonaws.com',
    b:'ab-test-b.s3.ap-southeast-2.amazonaws.com'
};
const cookieName = 'pool';

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

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    const requestOrigin = request.origin.s3;
    const parsedCookies = parseCookies(headers);
    let targetPool = 'a'

    console.log("origin request");
    console.log(JSON.stringify(event));

    if(parsedCookies && parsedCookies[cookieName]){
        targetPool = parsedCookies[cookieName];
    }

    let s3Origin = buckets[targetPool];
    
    requestOrigin.region = 'ap-southeast-2'; 
    requestOrigin.domainName = s3Origin;
    headers['host'] = [{ key: 'host', value: s3Origin }];
    headers['Cookie'] = [{key: 'Cookie',value:'random=' + targetPool}];

    console.log(JSON.stringify(request));

    callback(null, request);
};
