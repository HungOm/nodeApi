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
    // debugger
    if (method !== 'DELETE') {
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
    }
    // create new header object 
    let setHeaders = new Headers(headers)
    setHeaders.append(
        'Content-Type', 'application/json'
    )
    if (app.config.sessionToken) {
        setHeaders.append('token', app.config.sessionToken.token);
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
    console.log(queryStringObject + "- *****")
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
//Bind the log out button
app.bindLogoutButton = function () {
    document.getElementById("loggedOutButton").addEventListener("click", function (e) {
        // Stop it from redirecting anywhere
        e.preventDefault();
        // Log the user out
        app.logUserOut();
    });
};
//log the user out and redirect them
app.logUserOut = function () {
    // get the current token Id 
    let tokenId = typeof (app.config.sessionToken.token) == 'string' ? app.config.sessionToken.token : false;
    //send the current tokent to token endpoint to delete it
    var queryStringObject = {
        'token': tokenId
    };
    app.client.request(undefined, 'api/tokens', 'DELETE', queryStringObject, undefined, function (statusCode, responsePayload) {
        //set app.config.sessionToken as false
        app.setSessionToken(false);
        //redirect the user to the logged out page
        window.location = '/session/deleted'
    })
}
// Bind the forms
app.bindForms = function () {
    if (document.querySelector("form")) {
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
                    // make +0123455909 to 0123455909  
                    if (elements[i].name == 'phone') {
                        payload[elements[i].name] = valueOfElement.replace(/\D/g, "")
                    } else {
                        payload[elements[i].name] = valueOfElement;
                    }
                }
            }
            // Call the API
            app.client.request(undefined, path, method, undefined, payload, function (statusCode, responsePayload) {
                // Display an error on the form if needed
                if (statusCode !== 200) {
                    if (statusCode == 403) {
                        // log the user out
                        app.logUserOut();
                    } else {
                        // Try to get the error from the api, or set a default error message
                        var error = typeof (responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';
                        // Set the formError field with the error text
                        document.querySelector("#" + formId + " .formError").innerHTML = error;
                        // Show (unhide) the form error field on the form
                        document.querySelector("#" + formId + " .formError").style.display = 'block';
                    }
                } else {
                    // If successful, send to form response processor
                    app.formResponseProcessor(formId, payload, responsePayload);
                }
            });
        });
    }
};
// Form response processor
app.formResponseProcessor = function (formId, requestPayload, responsePayload) {
    let functionToCall = false;
    // If account creation was successful, try to immediately log the user in
    if (formId == 'accountCreate') {
        // Take the phone and password, and use it to log the user in
        let newPayload = {
            'phone': requestPayload.phone,
            'password': requestPayload.password
        };
        app.client.request(undefined, 'api/tokens', 'POST', undefined, newPayload, function (newStatusCode, newResponsePayload) {
            // Display an error on the form if needed
            if (newStatusCode !== 200) {
                // Set the formError field with the error text
                document.querySelector("#" + formId + " .formError").innerHTML = 'Sorry, an error has occured. Please try again.';
                // Show (unhide) the form error field on the form
                document.querySelector("#" + formId + " .formError").style.display = 'block';
            } else {
                // If successful, set the token and redirect the user
                app.setSessionToken(newResponsePayload);
                window.location = '/checks/all';
            }
        });
    }
    // If login was successful, set the token in localstorage and redirect the user
    if (formId == 'sessionCreate') {
        app.setSessionToken(responsePayload);
        window.location = '/checks/all';
    }
};
// Get the session token from localstorage and set it in the app.config object
app.getSessionToken = function () {
    var tokenString = localStorage.getItem('token');
    console.log(tokenString)
    if (typeof (tokenString) == 'string') {
        try {
            var token = JSON.parse(tokenString);
            app.config.sessionToken = token;
            if (typeof (token) == 'object') {
                app.setLoggedInClass(true);
            } else {
                app.setLoggedInClass(false);
            }
        } catch (e) {
            app.config.sessionToken = false;
            app.setLoggedInClass(false);
        }
    }
};
// Set (or remove) the loggedIn class from the body
app.setLoggedInClass = function (add) {
    var target = document.querySelector("body");
    console.log(target.classList)
    if (add) {
        target.classList.add('loggedIn');
    } else {
        target.classList.remove('loggedIn');
    }
};
// Set the session token in the app.config object as well as localstorage
app.setSessionToken = function (token) {
    console.log(token)
    app.config.sessionToken = token;
    var tokenString = JSON.stringify(token);
    localStorage.setItem('token', tokenString);
    if (typeof (token) == 'object') {
        app.setLoggedInClass(true);
    } else {
        app.setLoggedInClass(false);
    }
};
// Renew the token
app.renewToken = function (callback) {
    var currentToken = typeof (app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
    if (currentToken) {
        // Update the token with a new expiration
        var payload = {
            'token': currentToken.token,
            'extend': true,
        };
        app.client.request(undefined, 'api/tokens', 'PUT', undefined, payload, function (statusCode, responsePayload) {
            // Display an error on the form if needed
            if (statusCode == 200) {
                // Get the new token details
                var queryStringObject = {
                    'id': currentToken.token
                };
                app.client.request(undefined, 'api/tokens', 'GET', queryStringObject, undefined, function (statusCode, responsePayload) {
                    // Display an error on the form if needed
                    if (statusCode == 200) {
                        app.setSessionToken(responsePayload);
                        callback(false);
                    } else {
                        app.setSessionToken(false);
                        callback(true);
                    }
                });
            } else {
                app.setSessionToken(false);
                callback(true);
            }
        });
    } else {
        app.setSessionToken(false);
        callback(true);
    }
};
// Loop to renew token often
app.tokenRenewalLoop = function () {
    setInterval(function () {
        app.renewToken(function (err) {
            if (!err) {
                console.log("Token renewed successfully @ " + Date.now());
            }
        });
    }, 1000 * 60);
};
// Init (bootstrapping)
app.init = function () {
    // Bind all form submissions
    app.bindForms();
    // Bind logout logout button
    app.bindLogoutButton();
    // Get the token from localstorage
    app.getSessionToken();
    // Renew token
    app.tokenRenewalLoop();
};
// Call the init processes after the window loads
window.onload = function () {
    app.init();
};