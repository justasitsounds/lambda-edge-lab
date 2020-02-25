'use strict';

const buckets = {
    a:'ab-test-a.s3.ap-southeast-2.amazonaws.com',
    b:'ab-test-a.s3.ap-southeast-2.amazonaws.com'
};
const customContentHeader = 'x-content-pool';

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    const requestOrigin = request.origin.s3;
    let s3Origin = buckets['a']; 

    console.log("origin request");
    console.log(JSON.stringify(event));

    if (headers && headers[customContentHeader]) {
        console.log('headers[customContentHeader] == ' + headers[customContentHeader]);
        if (headers[customContentHeader][0].value !== ''){
            s3Origin = buckets[headers[customContentHeader][0].value]; 
        }
    }

    requestOrigin.region = 'ap-southeast-2'; 
    requestOrigin.domainName = s3Origin;
    request.headers['host'] = [{ key: 'host', value: s3Origin }];

    console.log(JSON.stringify(request));

    callback(null, request);
};
