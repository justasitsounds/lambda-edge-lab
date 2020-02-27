'use strict';

const origins = {
    a:'ab-test-a.s3.ap-southeast-2.amazonaws.com',
    b:'ab-test-b.s3.ap-southeast-2.amazonaws.com'
};
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

const rollTheDice = () => Math.floor(Math.random()*3) === 0 ? 'b' : 'a';

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
    }else{
        targetPool = rollTheDice();
    }

    let s3Origin = origins[targetPool];
    
    requestOrigin.region = 'ap-southeast-2'; 
    requestOrigin.domainName = s3Origin;
    headers['host'] = [{ key: 'host', value: s3Origin }];

    console.log(JSON.stringify(request));

    callback(null, request);
};
