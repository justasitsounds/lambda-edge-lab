'use strict';

//returns a set-cookie header based on where the content was served from
exports.handler = (event, context, callback) => {

    const response = event.Records[0].cf.response; //response from the origin
    const reqHeaders = event.Records[0].cf.request; //request from cloudfront

    let poolorigin = 'a'; //default origin pool

    if(reqHeaders.origin.s3.domainName === process.env.ORIGIN_B){
        poolorigin = 'b';
    }
    response.headers['Set-Cookie'] = [{key:'Set-Cookie', value: `pool=${poolorigin}`}];

    callback(null, response);
};
