// primay file

//dependencies
const http = require("http");
const url = require("url");

const StringDecoder = require("string_decoder").StringDecoder;

const server = http.createServer(function (req, res) {
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
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    //construct the data object to send to the handler

    var data = {
      trimmedPath: trimmedPath,
      queryStringObject: query,
      method: method,
      headers: headers,
      payload: buffer,
    };

    // route the request to the handler specified in the router
    chosenHandler(data, function (statusCode, payload) {
      //use the status code back by the handler ,or default to 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      //use the payload called back by the handler , or default to an empty object
      payload = typeof payload == "object" ? payload : {};

      //conver a payload to a string
      var payloadString = JSON.stringify(payload);

      //

      // return the response
      res.setHeader('Content-Type','application/json');
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
});

server.listen(3000, function () {
  console.log("This server is listening on port 3000");
});

//define handler
var handlers = {};

handlers.sample = function (data, callback) {
  //call http status code , and a payload object
  callback(406, { name: "sample handlers" });
};

//not founder handlers
handlers.notFound = function (data, callback) {
  callback(404);
};

// define router
var router = {
  sample: handlers.sample,
};
