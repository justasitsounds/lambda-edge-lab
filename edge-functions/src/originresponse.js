'use strict';

// the S3 origins that correspond to content for Pool A and Pool B
const origins = require('./origins_config.js');

//returns a set-cookie header based on where the content was served from
exports.handler = (event, context, callback) => {

    const response = event.Records[0].cf.response; //response from the origin
    const reqHeaders = event.Records[0].cf.request; //request from cloudfront

    let poolorigin = 'a'; //default origin pool

    if(reqHeaders.origin.s3.domainName.indexOf(origins.b) === 0){
        poolorigin = 'b';
    }
    response.headers['Set-Cookie'] = [{key:'Set-Cookie', value: `pool=${poolorigin}`}];

    callback(null, response);
};
