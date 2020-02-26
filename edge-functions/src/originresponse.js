'use strict';

exports.handler = (event, context, callback) => {

    console.log("origin response");
    console.log(JSON.stringify(event));

    const response = event.Records[0].cf.response; //response from the origin
    const reqHeaders = event.Records[0].cf.request; //request from cloudfront

    let poolorigin = 'a'; //default origin pool

    if(reqHeaders.origin.s3.domainName === 'ab-test-b.s3.ap-southeast-2.amazonaws.com'){
        poolorigin = 'b';
    }
    response.headers['Set-Cookie'] = [{key:'Set-Cookie', value: `pool=${poolorigin}`}];

    console.log(JSON.stringify(response));

    callback(null, response);
};
