'use strict';

const handler = require('serverless-express/handler');
const app = require('./server');

exports.handler = handler(app);
