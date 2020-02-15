'use strict';


const s3DomainName = 'societyoneform-uat.societyone.com.au.s3.amazonaws.com';
const customContentHeader = 'x-content-pool';

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;

    if (headers && headers[customContentHeader]) {

        if (headers[customContentHeader][0].value === 'b') {

            /* Set S3 origin fields */
            request.origin = {
                s3: {
                    domainName: s3DomainName,
                    region: '',
                    authMethod: 'none',
                    path: '',
                    customHeaders: {}
                }
            };
            request.headers['host'] = [{ key: 'host', value: s3DomainName }];
        }
    }

    callback(null, request);
};
