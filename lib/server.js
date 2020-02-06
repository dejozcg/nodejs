// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');
var handlers = require('./handlers');
var helpers = require('./helpers');
var path = require('path');

// @TODO: GET RID OF THIS
// helpers.sendTwilioSms('67286676', 'Beale', function (err) {
//     console.log('this was the error', err);
// });
helpers.sendTwilioSms1('67286676', 'Beale', function (err, msg) {
    console.log('this was the error', err, msg);
});

// Instantiate the server module object
var server = {};

// Instantiate the HTTP server
server.httpServer = http.createServer(function (req, res) {
    server.unifiedServer(req, res);
});

// Instantiate the HTTPS server
server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
};

// Start the server, and have it listen on port 3000
server.httpsServer = https.createServer(server.httpsServerOptions, function (req, res) {
    server.unifiedServer(req, res);
});

// All the server logic for both the http and https server
server.unifiedServer = function (req, res) {
    // Get the URL and parse it
    var parsedURL = url.parse(req.url, true);

    // Get the path
    var path = parsedURL.pathname;
    var trimedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string
    var queryStringObject = parsedURL.query;

    // Get the HTTP method
    var method = req.method.toLowerCase();

    // Get the request object headers
    var headers = req.headers;

    // Get the payloads, if have any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    req.on('end', function () {
        buffer += decoder.end();

        // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
        var chosenHandler = typeof(server.router[trimedPath]) !== 'undefined' ? server.router[trimedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        var data = {
            trimedPath,
            queryStringObject,
            method,
            headers,
            payloads: helpers.parseJsonToObject(buffer)
        };

        // Route the request to the handler specified in the router
        chosenHandler(data, function (statusCode, payloads) {
            // Use the status code returned from the handler, or set the default status code to 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            // Use the payload returned from the handler, or set the default payload to an empty object
            payloads = typeof (payloads) == 'object' ? payloads : {};

            // Convert the payload to a string
            payloadString = JSON.stringify(payloads);

            // Return responds
            res.setHeader('content-type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            //console.log('Returning this response: ',statusCode,payloadString);
        });
    });
};

// Define the request router
server.router = {
    'ping': handlers.ping,
    'users': handlers.users,
    'tokens': handlers.tokens,
    'checks': handlers.check
};

// Init script
server.init = function(){
    // Start the server, and have it listen on port 3000
    server.httpServer.listen(config.httpPort, function () {
        console.log("The http server liten on port " + config.httpPort + " in " + config.envName + " mode.");
    });

    // Start the server, and have it listen on port 3001
    server.httpsServer.listen(config.httpsPort, function () {
        console.log("The https server liten on port " + config.httpsPort + " in " + config.envName + " mode.");
    });
};

// Export modules
module.exports = server;