'use strict';

// the `pool` cookie designates the user pool that the request belongs to
const cookieName = 'pool';

//returns cookies as an associative array, given a CloudFront request headers array
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

// returns either 'a' or 'b', with a default probability of 1:1
const choosePool = (chance = 2) => Math.floor(Math.random()*chance) === 0 ? 'b' : 'a';

//if the request does not have a pool cookie - assign one
exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    const parsedCookies = parseCookies(headers);

    if(!parsedCookies || !parsedCookies[cookieName]){
        let targetPool = choosePool();
        headers['cookie'] = [{ key: 'cookie', value: `${cookieName}=${targetPool}`}]
    }

    callback(null, request);
};
