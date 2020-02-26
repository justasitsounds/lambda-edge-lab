'use strict';

exports.handler = (event, context, callback) => {

    console.log("origin response");
    console.log(JSON.stringify(event));

    const response = event.Records[0].cf.response;
    response.headers['Set-Cookie'] = [{key:'Set-Cookie', value: 'barbs=streisandh'}];

    console.log(JSON.stringify(response));

    callback(null, response);
};
