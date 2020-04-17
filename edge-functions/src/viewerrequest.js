'use strict';

// the `pool` cookie designates the user pool that the request belongs to
const cookieName = 'pool';

//returns cookies as an associative array, given a CloudFront request headers array
const parseCookies = require('./common.js').parseCookies;

// returns either 'a' or 'b', with a default probability of 1:1
const choosePool = (chance = 2) => Math.floor(Math.random()*chance) === 0 ? 'b' : 'a';

//if the request does not have a pool cookie - assign one
exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;

    callback(null, request);
};
