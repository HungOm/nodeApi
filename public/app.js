'use strict'
/**
 * 
 * frontend logic 
 * 
 */

const app = {};

console.log("Hello world")

//config 
app.config = {
    'sessionToken': false
}


//AJAX client for restful API

app.client = {};


//Interface for making api call
app.client.request = function (headers, path, method, queryStringObject, payload, callback) {

    //set defaults
    headers = typeof (headers) == 'object' && headers !== null ? headers : {};
    path = typeof (path) == 'string' ? path : '/';
    method = typeof (method) == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method) > -1 ? method.toUpperCase() : 'GET';
    queryStringObject = typeof (queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
    payload = typeof (payload) == 'object' && payload !== null ? payload : {};
    callback = typeof (callback) == 'function' ? callback : false;

    //For each query string parameter sent, add it to the path
    let requestUrl = path + '?';
    let counter = 0;
    for (let queryKey in queryStringObject) {
        if (queryStringObject.hasOwnPorpety(queryKey)) {
            counter++;
            //IF at least one query sring parameter has already been added prepend new ones with an ampersand
            if (counter > 1) {
                requestUrl += '&';

            }

            //Add the key and value 
            requestUrl += queryKey + '=' + queryStringObject[queryKey];
        }

    }



    let setHeaders = new Headers(headers)
    // if(headers){
    //     setHeaders.append(headers)


    // }
    setHeaders.append(
        'Content-Type','application/json'
    )
    if (app.config.sessionToken) {
        setHeaders.append('token', app.config.sessionToken.id);
    }
    const payloadString = JSON.stringify(payload);


    let requestOptions = {
        method: method,
        headers: setHeaders,
    };
    // catch the status code from promise 
    let statusCode = ''
    fetch(requestUrl, requestOptions)
        .then(response => {
            statusCode = response.status
            return response.json()
        }) 
        .then(result => 
            callback(statusCode, result)
            )
        .catch(error => callback(error, false));
}





app.client.request(undefined, 'api/users', 'GET', undefined, undefined, function (statusCode, payload) {
    console.log(statusCode, payload);
});

// set the payload as JSON
