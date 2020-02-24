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
var util = require('util');
var debug = util.debuglog('server');


// @TODO: GET RID OF THIS
// helpers.sendTwilioSms('67286676', 'Beale', function (err) {
//     console.log('this was the error', err);
// });
// helpers.sendTwilioSms1('67286676', 'Beale', function (err, msg) {
//     console.log('this was the error', err, msg);
// });

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

        // If the request is within the public directory use to the public handler instead
        chosenHandler = trimedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;


        // Construct the data object to send to the handler
        var data = {
            trimedPath,
            queryStringObject,
            method,
            headers,
            payloads: helpers.parseJsonToObject(buffer)
        };

        // Route the request to the handler specified in the router
        chosenHandler(data, function (statusCode, payloads, contentType) {

            // Determinate the type of response (fallback to JSON)
            contentType = typeof(contentType) == 'string' ? contentType : 'json';

            // Use the status code returned from the handler, or set the default status code to 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            // Return the response parts that are content-type specific
            var payloadString = '';
            if(contentType == 'json'){
                res.setHeader('content-type', 'application/json');
                payloads = typeof(payloads) == 'object' ? payloads : {};
                // Convert the payload to a string
                payloadString = JSON.stringify(payloads);
            }

            if(contentType == 'html'){
                res.setHeader('content-type', 'text/html');
                payloadString = typeof(payloads) == 'string' ? payloads : '';
            }
            if(contentType == 'favicon'){
                res.setHeader('content-type', 'image/x-icon');
                payloadString = typeof(payloads) !== 'undefined' ? payloads : '';
            }
            if(contentType == 'plain'){
                res.setHeader('content-type', 'text/plain');
                payloadString = typeof(payloads) !== 'undefined' ? payloads : '';
            }
            if(contentType == 'css'){
                res.setHeader('content-type', 'text/css');
                payloadString = typeof(payloads) !== 'undefined' ? payloads : '';
            }
            if(contentType == 'png'){
                res.setHeader('content-type', 'image/png');
                payloadString = typeof(payloads) !== 'undefined' ? payloads : '';
            }
            if(contentType == 'jpg'){
                res.setHeader('content-type', 'image/jpg');
                payloadString = typeof(payloads) !== 'undefined' ? payloads : '';
            }

            // Return the response-parts common to all content-types
            res.writeHead(statusCode);
            res.end(payloadString);
            //console.log('Returning this response: ',statusCode,payloadString);
                        
            // Use the payload returned from the handler, or set the default payload to an empty object
            payloads = typeof (payloads) == 'object' ? payloads : {};

            // If the response is 200, print green, otherwise print red
            if(statusCode == 200){
                debug('\x1b[32m%s\x1b[0m',method.toUpperCase()+' /'+trimedPath+' '+statusCode);
            } else {
                debug('\x1b[31m%s\x1b[0m',method.toUpperCase()+' /'+trimedPath+' '+statusCode);
            }
        });
    });
};

// Define the request router
server.router = {
    '' : handlers.index,
    'account/create' : handlers.accountCreate,
    'account/edit' : handlers.accountEdit,
    'account/deleted' : handlers.accountDeleted,
    'session/create' : handlers.sessionCreate,
    'session/deleted' : handlers.sessionDeleted,
    'checks/all' : handlers.checksList,
    'checks/create' : handlers.checksCreate,
    'checks/edit' : handlers.checksEdit,
    'ping' : handlers.ping,
    'api/users' : handlers.users,
    'api/tokens' : handlers.tokens,
    'api/checks' : handlers.check,
    'favicon.ico' : handlers.favicon,
    'public' : handlers.public
};

// Init script
server.init = function(){
    // Start the server, and have it listen on port 3000
    server.httpServer.listen(config.httpPort, function () {
        console.log('\x1b[36m%s\x1b[0m','The HTTP server is running on port '+config.httpPort);
    });

    // Start the server, and have it listen on port 3001
    server.httpsServer.listen(config.httpsPort, function () {
        // console.log("The https server liten on port " + config.httpsPort + " in " + config.envName + " mode.");
        console.log('\x1b[35m%s\x1b[0m','The HTTPS server is running on port '+config.httpsPort);
    });
};

// Export modules
module.exports = server;