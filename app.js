// Import packages to use in nodejs
const express = require('express');
const bodyParser = require('body-parser');

// include routes
const apiRouter = require('./routes/api');

// include other imports
const constants = require('./util/constants');
const helper = require('./util/helper');

// Initiate the express
const app = express();

// Setup the body parser to accept the data
// app.use(bodyParser.urlencoded({extended: true})); // Ideally for Form based request
app.use(bodyParser.json()); // Ideally for JSON based request

// Setup up common middleware for CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

// Setup api router in app
app.use('/api', apiRouter);

// Default api route => 404 routes
app.use((req, res, next) => {
    return helper.failureResponse(res,constants.NO_ROUTE_FOUND, [], 404);
});

// Make server listen to port 8080
app.listen(8080);