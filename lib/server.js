/*
 *
 * Server related tasks
 *
 */
//dependencies
const http = require("http");
const https = require('https');
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const fs = require('fs');
const config = require('./config');
// const _data = require('./lib/data');
const handlers = require('./handlers')
const helpers = require('./helpers');
const path = require('path');


//Instantiate the server object
const server = {};

// instantiate the https server 
server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};
server.httpsServer = https.createServer(server.httpsServerOptions, function (req, res) {
    server.unifiedServer(req, res)
});

// // instantiate the http server 
server.httpServer = http.createServer(function (req, res) {
    server.unifiedServer(req, res)
});


// server for both http and https 
server.unifiedServer = function (req, res) {
    //get the url and parse it
    var parsedUrl = url.parse(req.url, true);
    //get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, "");
    //get the http method
    var method = req.method.toLowerCase();
    //get query string as an object
    var query = parsedUrl.query;
    //get headers
    var headers = req.headers;
    //get the payload ther is any
    var decoder = new StringDecoder("utf-8");
    var buffer = "";
    req.on("data", function (data) {
        buffer += decoder.write(data);
    });
    req.on("end", function () {
        buffer += decoder.end();
        //choose the hanlder  this request should go to
        // If one is not found , use the not found handler
        var chosenHandler =
            typeof (server.router[trimmedPath]) !== "undefined" ?
            server.router[trimmedPath] :
            handlers.notFound;
        // var chosenHandler = router[trimmedPath] || handlers.notfound
        //construct the data object to send to the handler
        var data = {
            trimmedPath: trimmedPath,
            queryStringObject: query,
            method: method,
            headers: headers,
            payload: buffer !== '' ? helpers.parseJsonToObject(buffer) : helpers.parseJsonToObject('{}')
        };
        // route the request to the handler specified in the router
        chosenHandler(data, function (statusCode, payload) {
            // console.log(typeof(payload),payload)
            //use the status code back by the handler ,or default to 200
            statusCode = typeof (statusCode) == "number" ? statusCode : 200;
            //use the payload called back by the handler , or default to an empty object
            payload = typeof (payload) == "object" ? payload : {};
            //conver a payload to a string
            var payloadString = JSON.stringify(payload);
            // console.log(payloadString)
            //
            // return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            //send the response
            res.end(payloadString);
            //log the request path
            console.log(
                "Request recieved with these headers ",
                statusCode,
                payloadString
            );
        });
    });
}


// define router
server.router = {
    ping: handlers.ping,
    users: handlers.users,
    tokens: handlers.tokens,
    checks: handlers.checks
};


// Init script
server.init = function () {
    // Start the HTTP server
    server.httpServer.listen(config.httpPort, function () {
        console.log('The HTTP server is running on port ' + config.httpPort);
    });
    // Start the HTTPS server
    server.httpsServer.listen(config.httpsPort, function () {
        console.log('The HTTPS server is running on port ' + config.httpsPort);
    });
};


//Export the server module
module.exports = server;
