'use strict';

// the S3 origins that correspond to content for Pool A and Pool B
const originconfig = require('./origins_config.js');

//returns a set-cookie header based on where the content was served from
exports.handler = (event, context, callback) => {

    const response = event.Records[0].cf.response; //response from the origin

    callback(null, response);
};
