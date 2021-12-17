'use strict'
/**
 * 
 * frontend logic 
 * 
 */
const app = {};
console.log("App initilzed")
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
        if (queryStringObject.hasOwnProperty(queryKey)) {
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
    let myHeaders = new Headers({
        'Content-Type': 'application/json'
    });
    // For each header sent, add it to the request
    for (var headerKey in headers) {
        if (headers.hasOwnProperty(headerKey)) {
            myHeaders.set(headerKey, headers[headerKey]);
        }
    }
    if (app.config.sessionToken) {
        myHeaders.append('token', app.config.sessionToken.token);
    }
    //create new request options to pass to fetch request
    let requestOptions = {
        method: method,
        headers: myHeaders,
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
app.logUserOut = function (redirectUser) {
    // get the current token Id 
    let tokenId = typeof (app.config.sessionToken.token) == 'string' ? app.config.sessionToken.token : false;
    //send the current tokent to token endpoint to delete it
    var queryStringObject = {
        'token': tokenId
    };
    // Set redirectUser to default to true
    redirectUser = typeof (redirectUser) == 'boolean' ? redirectUser : true;
    app.client.request(undefined, 'api/tokens', 'DELETE', queryStringObject, undefined, function (statusCode, responsePayload) {
        //set app.config.sessionToken as false
        app.setSessionToken(false);
        //redirect the user to the logged out page
        if (redirectUser) {
            window.location = '/session/deleted'
        }
    })
}
// Bind the forms
app.bindForms = function () {
    if (document.querySelector("form")) {
        const allForms = document.querySelectorAll("form");
        for (let i = 0; i < allForms.length; i++) {
            allForms[i].addEventListener("submit", function (e) {
                // Stop it from submitting
                e.preventDefault();
                var formId = this.id;
                var path = this.action;
                var method = this.method.toUpperCase();
                // if (this._method !== undefined) {
                //     method = this._method.value
                // }
                // Hide the error message (if it's currently shown due to a previous error)
                document.querySelector("#" + formId + " .formError").style.display = 'none';
                // Hide the success message (if it's currently shown due to a previous error)
                if (document.querySelector("#" + formId + " .formSuccess")) {
                    document.querySelector("#" + formId + " .formSuccess").style.display = 'none';
                }
                // Turn the inputs into a payload
                var payload = {};
                var elements = this.elements;
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].type !== 'submit') {
                        // Determine class of element and set value accordingly
                        var classOfElement = typeof (elements[i].classList.value) == 'string' && elements[i].classList.value.length > 0 ? elements[i].classList.value : '';
                        var valueOfElement = elements[i].type == 'checkbox' && classOfElement.indexOf('multiselect') == -1 ? elements[i].checked : classOfElement.indexOf('intval') == -1 ? elements[i].value : parseInt(elements[i].value);
                        var elementIsChecked = elements[i].checked;
                        // Override the method of the form if the input's name is _method
                        var nameOfElement = elements[i].name;
                        // make +0123455909 to 0123455909  
                        if (nameOfElement == 'phone') {
                            payload[nameOfElement] = valueOfElement.replace(/\D/g, "")
                        } else {
                            // payload[elements[i].name] = valueOfElement;
                            if (nameOfElement == '_method') {
                                method = valueOfElement;
                            } else {
                                // Create an payload field named "method" if the elements name is actually httpmethod
                                if (nameOfElement == 'httpmethod') {
                                    nameOfElement = 'method';
                                }
                                if (nameOfElement == 'uid') {
                                    nameOfElement = 'id';
                                }
                                // If the element has the class "multiselect" add its value(s) as array elements
                                if (classOfElement.indexOf('multiselect') > -1) {
                                    if (elementIsChecked) {
                                        payload[nameOfElement] = typeof (payload[nameOfElement]) == 'object' && payload[nameOfElement] instanceof Array ? payload[nameOfElement] : [];
                                        payload[nameOfElement].push(valueOfElement);
                                    }
                                } else {
                                    payload[nameOfElement] = valueOfElement;
                                }
                            }
                        }
                    }
                }
                // If the method is DELETE, the payload should be a queryStringObject instead
                let queryStringObject = method == 'DELETE' ? payload : {};
                // Call the API
                app.client.request(undefined, path, method, queryStringObject, payload, function (statusCode, responsePayload) {
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
    // If forms saved successfully and they have success messages, show them
    var formsWithSuccessMessages = ['accountEdit1', 'accountEdit2', 'checksEdit1'];
    if (formsWithSuccessMessages.indexOf(formId) > -1) {
        document.querySelector("#" + formId + " .formSuccess").style.display = 'block';
    }
    // If the user just deleted their account, redirect them to the account-delete page
    if (formId == 'accountEdit3') {
        app.logUserOut(false);
        window.location = '/account/deleted';
    }
    //   if the user create checks succcessfully , redirect back to checkboard 
    if (formId == 'checksCreate') {
        window.location = '/checks/all';
    }
    //if checks deleted , redirect to dashboard
    if (formId == 'checksEdit2') {
        window.location = '/checks/all';
    }
};
//Load data on the page
app.loadDataOnPage = function () {
    //Get the current page from the body class
    let bodyClasses = document.querySelector('body').classList;
    let primaryClass = typeof (bodyClasses[0]) == 'string' ? bodyClasses[0] : false;
    if (primaryClass == 'accountEdit') {
        app.loadAccountEditPage();
    }
    // Logic for dashboard page
    if (primaryClass == 'checkDashboard') {
        app.loadChecksListPage();
    }
    if (primaryClass == 'checksEdit') {
        app.loadCheckEditPage()
    }
}
//Load account edit page
// Load the account edit page specifically
app.loadAccountEditPage = function () {
    // Get the phone number from the current token, or log the user out if none is there
    var phone = typeof (app.config.sessionToken.phone) == 'string' ? app.config.sessionToken.phone : false;
    if (phone) {
        // Fetch the user data
        var queryStringObject = {
            'phone': phone
        };
        app.client.request(undefined, 'api/users', 'GET', queryStringObject, undefined, function (statusCode, responsePayload) {
            if (statusCode == 200) {
                // Put the data into the forms as values where needed
                document.querySelector("#accountEdit1 .firstNameInput").value = responsePayload.firstName;
                document.querySelector("#accountEdit1 .lastNameInput").value = responsePayload.lastName;
                document.querySelector("#accountEdit1 .displayPhoneInput").value = responsePayload.phone;
                // Put the hidden phone field into both forms
                var hiddenPhoneInputs = document.querySelectorAll("input.hiddenPhoneNumberInput");
                for (var i = 0; i < hiddenPhoneInputs.length; i++) {
                    hiddenPhoneInputs[i].value = responsePayload.phone;
                }
            } else {
                // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
                //   app.logUserOut();
            }
        });
    } else {
        app.logUserOut();
    }
};
// Get the session token from localstorage and set it in the app.config object
app.getSessionToken = function () {
    var tokenString = localStorage.getItem('token');
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
    if (add) {
        target.classList.add('loggedIn');
    } else {
        target.classList.remove('loggedIn');
    }
};
// Set the session token in the app.config object as well as localstorage
app.setSessionToken = function (token) {
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
                    'token': currentToken.token
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
// Load the dashboard page specifically
app.loadChecksListPage = function () {
    // Get the phone number from the current token, or log the user out if none is there
    var phone = typeof (app.config.sessionToken.phone) == 'string' ? app.config.sessionToken.phone : false;
    if (phone) {
        // Fetch the user data
        var queryStringObject = {
            'phone': phone
        };
        app.client.request(undefined, 'api/users', 'GET', queryStringObject, undefined, function (statusCode, responsePayload) {
            if (statusCode == 200) {
                // Determine how many checks the user has
                var allChecks = typeof (responsePayload.checks) == 'object' && responsePayload.checks instanceof Array && responsePayload.checks.length > 0 ? responsePayload.checks : [];
                if (allChecks.length > 0) {
                    // Show each created check as a new row in the table
                    allChecks.forEach(function (checkId) {
                        // Get the data for the check
                        var newQueryStringObject = {
                            'id': checkId
                        };
                        app.client.request(undefined, 'api/checks', 'GET', newQueryStringObject, undefined, function (statusCode, responsePayload) {
                            if (statusCode == 200) {
                                var checkData = responsePayload;
                                // Make the check data into a table row
                                var table = document.getElementById("checksListTable");
                                var tr = table.insertRow(-1);
                                tr.classList.add('checkRow');
                                var td0 = tr.insertCell(0);
                                var td1 = tr.insertCell(1);
                                var td2 = tr.insertCell(2);
                                var td3 = tr.insertCell(3);
                                var td4 = tr.insertCell(4);
                                td0.innerHTML = responsePayload.method.toUpperCase();
                                td1.innerHTML = responsePayload.protocol + '://';
                                td2.innerHTML = responsePayload.url;
                                var state = typeof (responsePayload.state) == 'string' ? responsePayload.state : 'unknown';
                                td3.innerHTML = state;
                                td4.innerHTML = '<a href="/checks/edit?id=' + responsePayload.id + '">View / Edit / Delete</a>';
                            } else {
                                console.log("Error trying to load check ID: ", checkId);
                            }
                        });
                    });
                    if (allChecks.length < 5) {
                        // Show the createCheck CTA
                        document.getElementById("createCheckCTA").style.display = 'block';
                    }
                } else {
                    // Show 'you have no checks' message
                    document.getElementById("noChecksMessage").style.display = 'table-row';
                    // Show the createCheck CTA
                    document.getElementById("createCheckCTA").style.display = 'block';
                }
            } else {
                // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
                app.logUserOut();
            }
        });
    } else {
        app.logUserOut();
    }
};
// get the checks edit page
app.loadCheckEditPage = function () {
    let id = typeof (window.location.href.split('=')[1]) == 'string' && window.location.href.split('=')[1].length > 0 ? window.location.href.split('=')[1] : false;
    if (id) {
        let queryStringObject = {
            'id': id
        };
        app.client.request(undefined, 'api/checks', 'GET', queryStringObject, undefined, function (statusCode, responsePayload) {
            if (statusCode == 200) {
                let hiddenIdInputs = document.querySelectorAll('input.hiddenIdInput');
                for (let i = 0; i < hiddenIdInputs.length; i++) {
                    hiddenIdInputs[i].value = responsePayload.id;
                }
                document.querySelector("#checksEdit1 .displayIdInput").value = responsePayload.id;
                document.querySelector("#checksEdit1 .displayStateInput").value = responsePayload.state;
                document.querySelector("#checksEdit1 .protocolInput").value = responsePayload.protocol;
                document.querySelector("#checksEdit1 .urlInput").value = responsePayload.url;
                document.querySelector("#checksEdit1 .methodInput").value = responsePayload.method;
                document.querySelector("#checksEdit1 .timeoutInput").value = responsePayload.timeoutSeconds;
                let successCodeCheckboxes = document.querySelectorAll("#checksEdit1 input.successCodesInput");
                for (var i = 0; i < successCodeCheckboxes.length; i++) {
                    if (responsePayload.successCodes.indexOf(parseInt(successCodeCheckboxes[i].value)) > -1) {
                        successCodeCheckboxes[i].checked = true;
                    }
                }
                debugger
            } else {
                window.location = '/checks/all';
            }
        })
    } else {
        window.location = '/checks/all';
    }
}
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
    app.loadDataOnPage()
};
// Call the init processes after the window loads
window.onload = function () {
    app.init();
};