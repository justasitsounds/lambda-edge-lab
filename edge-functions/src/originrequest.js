'use strict';

const buckets = {
    a:'ab-test-a.s3.ap-southeast-2.amazonaws.com',
    b:'ab-test-a.s3.ap-southeast-2.amazonaws.com'
};
const customContentHeader = 'x-content-pool';

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;

    console.log("origin request");
    console.log(JSON.stringify(event));

    if (headers && headers[customContentHeader]) {

        if (headers[customContentHeader][0].value !== '') {

            let s3Origin = buckets[headers[customContentHeader][0].value]; 
            /* Set S3 origin fields */
            request.origin = {
                s3: {
                    domainName: s3Origin,
                    region: 'ap-southeast-2',
                    authMethod: 'none',
                    path: '',
                    customHeaders: {}
                }
            };
            request.headers['host'] = [{ key: 'host', value: s3Origin }];
        }
    }

    console.log(JSON.stringify(request));

    callback(null, request);
};
