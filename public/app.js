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

    // create new header object 
    let setHeaders = new Headers(headers)
    setHeaders.append(
        'Content-Type', 'application/json'
    )
    if (app.config.sessionToken) {
        setHeaders.append('token', app.config.sessionToken.id);
    }
    //create new request options to pass to fetch request
    let requestOptions = {
        method: method,
        headers: setHeaders,
    };
    // send payload in string format if it post/put/or delete request 
    if (method !== 'GET') {
        requestOptions.body = JSON.stringify(payload);
    }
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

// Bind the forms
app.bindForms = function () {
    document.querySelector("form").addEventListener("submit", function (e) {
        // Stop it from submitting
        e.preventDefault();
        var formId = this.id;
        var path = this.action;
        var method = this.method.toUpperCase();
        // Hide the error message (if it's currently shown due to a previous error)
        document.querySelector("#" + formId + " .formError").style.display = 'hidden';
        // Turn the inputs into a payload
        var payload = {};
        var elements = this.elements;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].type !== 'submit') {
                var valueOfElement = elements[i].type == 'checkbox' ? elements[i].checked : elements[i].value;
                payload[elements[i].name] = valueOfElement;
            }
        }
        // Call the API
        app.client.request(undefined, path, method, undefined, payload, function (statusCode, responsePayload) {
            // Display an error on the form if needed
            if (statusCode !== 200) {
                // Try to get the error from the api, or set a default error message
                var error = typeof (responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';
                // Set the formError field with the error text
                document.querySelector("#" + formId + " .formError").innerHTML = error;
                // Show (unhide) the form error field on the form
                document.querySelector("#" + formId + " .formError").style.display = 'block';
            } else {
                // If successful, send to form response processor
                app.formResponseProcessor(formId, payload, responsePayload);
            }
        });
    });
};
// Form response processor
app.formResponseProcessor = function (formId, requestPayload, responsePayload) {
    var functionToCall = false;
    if (formId == 'accountCreate') {
        // @TODO Do something here now that the account has been created successfully
        console.log('account create form was successfully submited')
    }
};
// Init (bootstrapping)
app.init = function () {
    // Bind all form submissions
    app.bindForms();
};
// Call the init processes after the window loads
window.onload = function () {
    app.init();
    app.client.request(undefined, 'api/users', 'GET', undefined, undefined, function (statusCode, payload) {
        console.log(statusCode + "*****");
    });
};