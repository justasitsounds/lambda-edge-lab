'use strict';

const AWS = require('aws-sdk');
var s3 = new AWS.S3();

var config = async function(bucket){
    var params = {
        Bucket: `{bucket}`,
        Key: 'lambda_edge_config.json'
    };
    return s3.getObject(params).promise();
}

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

const customContentHeader = 'x-content-pool';

exports.handler = async function(event, context, callback) {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    const parsedCookies = parseCookies(headers);
    var c = await config()
    
    if(parsedCookies && parsedCookies['pool']){
        const pooldest = parsedCookies['pool'];
 
        request.headers[customContentHeader] = [{ key: customContentHeader, value: pooldest}];
    }

    callback(null, request);
};
