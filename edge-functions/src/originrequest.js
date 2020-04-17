'use strict';

// the S3 origins that correspond to content for Pool A and Pool B
const origins = require('./origins_config.js');
const parseCookies = require('./common.js').parseCookies;

// the `pool` cookie determines which origin to route to
const cookieName = 'pool';

// changes request origin depending on value of the `pool` cookie 
exports.handler = (event, context, callback) => {

    const request = event.Records[0].cf.request;

    callback(null, request);
};
