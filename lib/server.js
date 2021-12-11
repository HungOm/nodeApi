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
const util = require('util');
const debug = util.debuglog('servers');

// run with NODE_DEBUG=servers on terminal 


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

        

          // If the request is within the public directory use to the public handler instead
    //    chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;
        // var chosenHandler = router[trimmedPath] || handlers.notfound
        //construct the data object to send to the handler


        var data = {
            trimmedPath: trimmedPath,
            queryStringObject: query,
            method: method,
            headers: headers,
            payload: helpers.parseJsonToObject(buffer) 
        };
        // route the request to the handler specified in the router
        chosenHandler(data, function (statusCode,payload,contentType) {
            //Determin the type of response (fallback to JSON)
            contentType = typeof(contentType)=='string'?contentType:'json';
            // console.log(typeof(payload),payload)
            //use the status code back by the handler ,or default to 200
            statusCode = typeof (statusCode) == "number" ? statusCode : 200;
            //use the payload called back by the handler , or default to an empty object
           
            
            // return the response parts that are content specific
            // console.log(data)
            let payloadString= '';
            if(contentType=="json"){
                res.setHeader('Content-Type', 'application/json');
                payload = typeof (payload) == "object" ? payload : {};

                payloadString = JSON.stringify(payload);

            }
            if(contentType=='html'){
                res.setHeader('Content-Type', 'text/html');
                payloadString = typeof (payload) == "string" ? payload : '';

            }        
            
            // return the response parts that are common to all content type
            res.writeHead(statusCode);
            //send the response
            res.end(payloadString);


            //if the response 200 print green, otherwise red

            if(statusCode==200){
                debug('\x1b[32m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode)

            }else{
                debug('\x1b[31m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode)


            }
        });
    });
}


// define router
server.router = {
    "":handlers.index,
    "account/create":handlers.accountCreate,
    "account/edit":handlers.accountEdit,
    "account/deleted":handlers.accountDeleted,
    "session/create":handlers.sessionCreate,
    "session/deleted":handlers.sessionDeleted,
    "checks/all":handlers.checksList,
    "checks/create":handlers.checksCreate,
    'checks/edit':handlers.checksEdit,
    "ping": handlers.ping,
   "api/users": handlers.users,
    "api/tokens": handlers.tokens,
    "api/checks": handlers.checks
};


// Init script
server.init = function () {
    // Start the HTTP server
    server.httpServer.listen(config.httpPort, function () {
        // console.log(;
        console.log('\x1b[36m%s\x1b[0m','The HTTP server is running on port ' + config.httpPort);

    });
    // Start the HTTPS server
    server.httpsServer.listen(config.httpsPort, function () {
        // console.log('The HTTPS server is running on port ' + config.httpsPort);
        console.log('\x1b[35m%s\x1b[0m','The HTTP server is running on port ' + config.httpsPort);


    });
};


//Export the server module
module.exports = server;
