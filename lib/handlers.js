/*
 *
 * Request handlers
 *
 */
//dependency
const config = require('./config')
var _data = require("./data");
var helpers = require("./helpers");
//define handler
var handlers = {};
/**
 * 
 * HTML handler
 * 
 */
// index handler 
handlers.index = function (data, callback) {
  if (data.method == 'get') {
    //Prepare data for interpolation
    let templateData = {
      'head.title': 'This is the title',
      'head.description': 'This is a meta description',
      'body.title': 'Uptime Monitoring',
      'body.class': 'index'
    }
    //Read the data as string
    helpers.getTemplate('index', templateData, function (err, str) {
      if (!err && str) {
        //Add  the universal head and footer
        helpers.addUniversalTempaltes(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, 'html')
          } else {
            callback(500, undefined, 'html')
          }
        })
        // callback(200,str,'html')
      } else {
        callback(500, undefined, 'html')
      }
    })
  } else {
    callback(405, undefined, 'html');
  }
}


//create account 

handlers.accountCreate = function (data, callback) {

  if (data.method == 'get') {
    //Prepare data for interpolation
    let templateData = {
      'head.title': 'Create an account',
      'head.description': 'Sign up, it is and it only take a few seconds',
      'body.title': 'Hello Templated world',
      'body.class': 'index'
    }
    //Read the data as string
    helpers.getTemplate('accountCreate', templateData, function (err, str) {
      if (!err && str) {
        //Add  the universal head and footer
        helpers.addUniversalTempaltes(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, 'html')
          } else {
            callback(500, undefined, 'html')
          }
        })
        // callback(200,str,'html')
      } else {
        callback(500, undefined, 'html')
      }
    })
  } else {
    callback(405, undefined, 'html');
  }
}


//create session
handlers.sessionCreate = function (data, callback) {

  if (data.method == 'get') {
    //Prepare data for interpolation
    let templateData = {
      'head.title': 'Log in to your account',
      'head.description': 'Please enter your phone number and password to access your account',
      'body.class': 'index'
    }
    //Read the data as string
    helpers.getTemplate('sessionCreate', templateData, function (err, str) {
      if (!err && str) {
        //Add  the universal head and footer
        helpers.addUniversalTempaltes(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, 'html')
          } else {
            callback(500, undefined, 'html')
          }
        })
        // callback(200,str,'html')
      } else {
        callback(500, undefined, 'html')
      }
    })
  } else {
    callback(405, undefined, 'html');
  }
}



//delete session
handlers.sessionDeleted = function (data, callback) {

  if (data.method == 'get') {
    //Prepare data for interpolation
    let templateData = {
      'head.title': 'Logout',
      'head.description': 'You have been logged out of your account',
      'body.class': 'sessionDeleted'
    }
    //Read the data as string
    helpers.getTemplate('sessionDeleted', templateData, function (err, str) {
      if (!err && str) {
        //Add  the universal head and footer
        helpers.addUniversalTempaltes(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, 'html')
          } else {
            callback(500, undefined, 'html')
          }
        })
        // callback(200,str,'html')
      } else {
        callback(500, undefined, 'html')
      }
    })
  } else {
    callback(405, undefined, 'html');
  }
}


//account edit
handlers.accountEdit = function (data, callback) {

  if (data.method == 'get') {
    //Prepare data for interpolation
    let templateData = {
      'head.title': 'Account Setting',
      'body.class': 'accountEdit'
    }
    //Read the data as string
    helpers.getTemplate('accountEdit', templateData, function (err, str) {
      if (!err && str) {
        //Add  the universal head and footer
        helpers.addUniversalTempaltes(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, 'html')
          } else {
            callback(500, undefined, 'html')
          }
        })
        // callback(200,str,'html')
      } else {
        callback(500, undefined, 'html')
      }
    })
  } else {
    callback(405, undefined, 'html');
  }
}



//account edit
handlers.accountDeleted = function (data, callback) {

  if (data.method == 'get') {
    //Prepare data for interpolation
    let templateData = {
      'head.title': 'Account delete',
      'head.description': 'Your account has been deleted',
      'body.class': 'accountDeleted'
    }
    //Read the data as string
    helpers.getTemplate('accountDeleted', templateData, function (err, str) {
      if (!err && str) {
        //Add  the universal head and footer
        helpers.addUniversalTempaltes(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, 'html')
          } else {
            callback(500, undefined, 'html')
          }
        })
        // callback(200,str,'html')
      } else {
        callback(500, undefined, 'html')
      }
    })
  } else {
    callback(405, undefined, 'html');
  }
}

// create a new checks 
handlers.checksCreate = function (data, callback) {

  if (data.method == 'get') {
    //Prepare data for interpolation
    let templateData = {
      'head.title': 'Create a new check',
      'body.class': 'checksCreate'
    }
    //Read the data as string
    helpers.getTemplate('checksCreate', templateData, function (err, str) {
      if (!err && str) {
        //Add  the universal head and footer
        helpers.addUniversalTempaltes(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, 'html')
          } else {
            callback(500, undefined, 'html')
          }
        })
        // callback(200,str,'html')
      } else {
        callback(500, undefined, 'html')
      }
    })
  } else {
    callback(405, undefined, 'html');
  }
}


//checks List ( dasshbaord)
handlers.checksList = function (data, callback) {

  if (data.method == 'get') {
    //Prepare data for interpolation
    let templateData = {
      'head.title': 'Dashboard',
      'head.description': 'Welcome,to your dashbaord',
      'body.class': 'checkDashboard'
    }
    //Read the data as string
    helpers.getTemplate('checkList', templateData, function (err, str) {
      if (!err && str) {
        //Add  the universal head and footer
        helpers.addUniversalTempaltes(str, templateData, function (err, str) {
          if (!err && str) {
            callback(200, str, 'html')
          } else {
            callback(500, undefined, 'html')
          }
        })
        // callback(200,str,'html')
      } else {
        callback(500, undefined, 'html')
      }
    })
  } else {
    callback(405, undefined, 'html');
  }
}



//Faicon handler 
handlers.favicon = function (data, callback) {
  //REject any request that is not a get method
  if (data.method == 'get') {
    //Read in the favicon's data
    helpers.getStaticAsset('favicon.ico', function (err, data) {
      if (!err && data) {
        // callback  the data 
        callback(200, data, 'favicon');
      } else {
        callback(500)
      }
    });

  } else {
    callback(405);
  }
}

// //Public assets

handlers.public = function (data, callback) {
  if (data.method == 'get') {
    //Get the filename requested
    let trimmedAssetName = data.trimmedPath.replace('public/', '').trim();
    if (trimmedAssetName.length > 0) {
      // Read in the asset's data
      helpers.getStaticAsset(trimmedAssetName, function (err, data) {
        if (!err && data) {
          // Determine the content type (default to plain text) 
          var contentType = 'plain';

          if (trimmedAssetName.indexOf('.css') > -1) {
            contentType = 'css';
          }

          if (trimmedAssetName.indexOf('.png') > -1) {
            contentType = 'png';
          }

          if (trimmedAssetName.indexOf('.jpg') > -1) {
            contentType = 'jpg';
          }

          if (trimmedAssetName.indexOf('.ico') > -1) {
            contentType = 'favicon';
          }
          callback(200, data, contentType)

        } else {
          callback(405)
        }

      })
    } else {

      callback(405)

    }


  } else {
    callback(405)
  }
}





/**
 * 
 * JSON API Handler
 * 
 */
//users
handlers.users = function (data, callback) {
  var acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};


//container for handler users submethods
handlers._users = {};
//users - post
handlers._users.post = function (data, callback) {
  // required data => firstname, lastname, phone ,password,tosAgreement
  //check all required fields are filled out

  var firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0 ?
    data.payload.firstName.trim() :
    false;
  var lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0 ?
    data.payload.lastName.trim() :
    false;
  var phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length >= 10 && data.payload.phone.trim().length <= 12 ?
    data.payload.phone.trim() :
    false;
  var password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length >= 6 ?
    data.payload.password.trim() :
    false;
  var tosAgreement =
    typeof data.payload.tosAgreement == "boolean" &&
    data.payload.tosAgreement == true ?
    true :
    false;
  if (firstName && lastName && phone && password && tosAgreement) {
    //make sure the user doesnt already exist
    _data.read("users", phone, function (err, data) {
      if (err) {
        //Hash the password
        var hashedPassword = helpers.hash(password);
        if (hashedPassword) {
          //create the use object
          var userObject = {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            hashedPassword: hashedPassword,
            tosAgreement: tosAgreement,
          };
          //store user object
          _data.create("users", phone, userObject, function (err) {
            if (!err) {
              callback(200);
            } else {
              callback(500, {
                Error: "could not create the new user"
              });
            }
          });
        } else {
          callback(500, {
            Error: "could not hash the user's password"
          });
        }
      } else {
        callback(404, {
          Error: "A user with that phone number already exist"
        });
      }
    });
  } else {
    callback(400, {
      Error: "Missing required field"
    });
  }
};
//users - get
//required data: phone
//Optional data: none
// @TODO only let authenticated use access objects
handlers._users.get = function (data, callback) {

  var phone =
    typeof data.queryStringObject.phone == "string" &&
    data.queryStringObject.phone.trim().length >= 10 && data.queryStringObject.phone.trim().length <= 12 ?
    data.queryStringObject.phone.trim() :
    false;

  if (phone) {
    let token =
      typeof data.headers.token == "string" ? data.headers.token : false;


    // varify if the given token is valid for the phone number
    handlers._tokens.varifyToken(token, phone, function (tokenIsValid) {

      if (tokenIsValid) {
        _data.read("users", phone, function (err, data) {
          if (!err && data) {
            //Remove the hashed password from the user object before returning to the requesting user
            delete data.hashedPassword;
            callback(200, data);
          } else {
            callback(404);
          }
        });
      } else {
        callback(403, {
          Error: "Missing required valid token in header"
        });
      }
    });
  } else {
    callback(400, {
      Error: "Missing  required field"
    });
  }
};
//users - put
//reuqire - phone
//optional - none
//Optional data: firstName, lastName,password(at least one must be specified)
// @TODO only let an authenticated user update their own object. they are not allowed to update others info
handlers._users.put = function (data, callback) {
  //check for rewquired field
  var phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length >= 10 && data.payload.phone.trim().length <= 12 ?
    data.payload.phone.trim() :
    false;

  var firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0 ?
    data.payload.firstName.trim() :
    false;
  var lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0 ?
    data.payload.lastName.trim() :
    false;
  var password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length >= 6 ?
    data.payload.password.trim() :
    false;
  //error if the phone is invalid
  if (phone) {
    var token =
      typeof data.headers.token == "string" ? data.headers.token : false;
    // varify if the given token is valid for the phone number
    handlers._tokens.varifyToken(token, phone, function (tokenIsValid) {
      if (tokenIsValid) {
        //Error if nothing is sent  update
        if (firstName || lastName || password) {
          //Look up the user
          _data.read("users", phone, function (err, userData) {
            if (!err && userData) {
              // update the neceesary data
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.hashedPassword = helpers.hash(password);
              }
              //store the updated data
              _data.update("users", phone, userData, function (err) {
                if (!err) {
                  callback(200);
                } else {
                  callback(500, {
                    Error: "Could not update the user"
                  });
                }
              });
            } else {
              callback(400, {
                Error: "The specified user does not exist"
              });
            }
          });
        } else {
          callback(400, {
            Error: "Missing fields to update"
          });
        }
      } else {
        callback(403, {
          Error: "Missing required token in header"
        });
      }
    });
  } else {
    callback(400, {
      Error: "Missing required field"
    });
  }
};
//users - delete
//required field - phone
//@TODO only let authenicate user delete their objects
//@TODO clean up (Delete) any other datafile associated with this user
handlers._users.delete = function (data, callback) {
  //check that the phone number is valid
  var phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length >= 10 && data.payload.phone.trim().length <= 12 ?
    data.payload.phone.trim() :
    false;
  if (phone) {
    var token =
      typeof data.headers.token == "string" ? data.headers.token : false;
    // varify if the given token is valid for the phone number
    handlers._tokens.varifyToken(token, phone, function (tokenIsValid) {
      if (tokenIsValid) {
        _data.read("users", phone, function (err, userData) {
          if (!err && userData) {
            //Remove the hashed password from the user object before returning to the requesting user
            // delete data.hashedPassword;
            _data.delete("users", phone, function (err) {
              if (!err) {
                // callback(200);
                // delete each of the checks associcated with user 
                var userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                var checksToDelete = userChecks.length;
                if (checksToDelete > 0) {
                  var checksDeleted = 0;
                  var deletionError = false;
                  //loop through checks
                  userChecks.forEac(function (checkId) {
                    //delete the check
                    _data.delete('checks', checkId, function (err) {
                      if (err) {
                        deletionError = true
                      } else {
                        checksDeleted++;
                        if (checksDeleted == checksToDelete) {
                          if (!deletionError) {
                            callback(200)
                          } else {
                            callback(500, {
                              "Errors": "Error encountered attempting to delete all of the user\s checks. All checks may not have been deleted from the system successfully"
                            })
                          }
                        }
                      }
                    })
                  })
                } else {
                  callback(200)
                }
              } else {
                callback(500, {
                  Error: "Could not remove the user"
                });
              }
            });
          } else {
            callback(404, {
              Error: "Could not find the specified user"
            });
          }
        });
      } else {
        callback(403, {
          Error: "Missing required token in header"
        });
      }
    });
  } else {
    callback(400, {
      Error: "Missing  required field"
    });
  }
};
//tokens
handlers.tokens = function (data, callback) {
  var acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405);
  }
};
//Constainers for all token methods
handlers._tokens = {};
//Token - post
// required data - phone,password
//Optional data - none
handlers._tokens.post = function (data, callback) {

  var phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length >= 10 && data.payload.phone.trim().length <= 12 ?
    data.payload.phone.trim() :
    false;
  var password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length >= 6 ?
    data.payload.password.trim() :
    false;
  if (phone && password) {
    //Look up the user match with provided phone number
    _data.read("users", phone, function (err, userData) {
      if (!err && userData) {
        //Hash the password, and compare it with the password stored in user
        var hashedPassword = helpers.hash(password);
        if (hashedPassword == userData.hashedPassword) {
          //if valid create new token with random name. set expiration date, - 1hour in the futre
          var tokenId = helpers.createRandomString(20);
          var expires = Date.now() + 1000 * 60 * 60;
          var tokenObject = {
            phone: phone,
            token: tokenId,
            expires: expires,
          };
          //store the token
          _data.create("tokens", tokenId, tokenObject, function (err) {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, {
                Error: "Could not create new token"
              });
            }
          });
        } else {
          callback(400, {
            Error: "Password did not match"
          });
        }
      } else {
        callback(400, {
          Error: "Could not find the specified user"
        });
      }
    });
  } else {
    callback(400, {
      Error: "Missing required fields"
    });
  }
};
//Token - get
// required data - id 
handlers._tokens.get = function (data, callback) {
  var token =
    typeof data.queryStringObject.token == "string" &&
    data.queryStringObject.token.trim().length == 20 ?
    data.queryStringObject.token.trim() :
    false;
  if (token) {
    _data.read("tokens", token, function (err, tokenData) {
      if (!err && tokenData) {
        callback(200, tokenData);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, {
      Error: "Missing  required field"
    });
  }
};
//Token - put
//required data -id,extend(expiration time) -> 1 hour extension by default
//Optional data- non
handlers._tokens.put = function (data, callback) {
  var token =
    typeof data.payload.token == "string" && data.payload.token.trim().length == 20 ?
    data.payload.token.trim() :
    false;
  var extend =
    typeof data.payload.extend == "boolean" && data.payload.extend == true ?
    true :
    false;
  if (token && extend) {
    //Look up the token
    _data.read("tokens", token, function (err, tokenData) {
      if (!err && tokenData) {
        //check to make sure the token is not expired yet
        if (tokenData.expires > Date.now()) {
          //set the expiration an hour from now
          tokenData.expires = Date.now() + 1000 * 60 * 60;
          //store the new update
          _data.update("tokens", token, tokenData, function (err) {
            if (!err) {
              callback(200, {
                Success: "Token extended 1 hour from now."
              });
            } else {
              callback(500, {
                Error: "Could not update the token's expriation",
              });
            }
          });
        } else {
          callback(400, {
            Error: "The token has expired and cant be extended",
          });
        }
      } else {
        callback(400, {
          Error: "Specified token  does not exist"
        });
      }
    });
  } else {
    callback(400, {
      Error: "Missing required field(s) or field(s) are invalid",
    });
  }
};
//Token - delete
//required data = id
// optional data = none
handlers._tokens.delete = function (data, callback) {
  //check that the phone number is valid
  var id =
    typeof data.queryStringObject.id == "string" &&
    data.queryStringObject.id.trim().length == 20 ?
    data.queryStringObject.id.trim() :
    false;
  if (id) {
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        // delete the token based on id ;
        _data.delete("tokens", id, function (err) {
          if (!err) {
            callback(200);
          } else {
            callback(500, {
              Error: "Could not delete the speicifed token"
            });
          }
        });
      } else {
        callback(404, {
          Error: "Could not find the specified token"
        });
      }
    });
  } else {
    callback(400, {
      Error: "Missing  required field"
    });
  }
};
handlers._tokens.varifyToken = function (id, phone, callback) {
  _data.read("tokens", id, function (err, tokenData) {
    if (!err && tokenData) {
      //check if token is for the given user and is not expired.
      if (tokenData.phone == phone && tokenData.expires >= Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};
//Checks 
handlers.checks = function (data, callback) {
  var acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._checks[data.method](data, callback);
  } else {
    callback(405);
  }
};
//Container for all the checks methods
handlers._checks = {};
// checks - post 
// required data: protocol ,url,method,sucessCode,timeoutSeconds
// optional data - none 
handlers._checks.post = function (data, callback) {
  var protocol =
    typeof data.payload.protocol == "string" && ['https', 'http'].indexOf(data.payload.protocol) > -1 ?
    data.payload.protocol :
    false;
  var url =
    typeof data.payload.url == "string" &&
    data.payload.url.trim().length > 0 ?
    data.payload.url.trim() :
    false;
  var method = typeof (data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
  var successCodes = typeof (data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
  var timeoutSeconds = typeof (data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;
  if (protocol && url && method && successCodes && timeoutSeconds) {
    //Get the token from the headers
    var token = typeof (data.headers.token) == "string" ? data.headers.token : false;
    //look up the user by reading the token
    _data.read('tokens', token, function (err, tokenData) {
      if (!err && tokenData) {
        var userPhone = tokenData.phone
        _data.read('users', userPhone, function (err, userData) {
          if (!err && userData) {
            var userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
            //varify the user has less than the max-check-per-user
            if (userChecks.length < config.maxChecks) {
              //create a random id for the checks
              var checkId = helpers.createRandomString(20);
              //  create the check object , and include the user phone
              var checkObject = {
                'id': checkId,
                "userPhone": userPhone,
                'protocol': protocol,
                'url': url,
                'method': method,
                "successCodes": successCodes,
                "timeoutSeconds": timeoutSeconds
              }
              _data.create('checks', checkId, checkObject, function (err) {
                if (!err) {
                  //Add the check ID to the user
                  userData.checks = userChecks
                  userData.checks.push(checkId)
                  //save the new user data
                  _data.update('users', userPhone, userData, function (err) {
                    if (!err) {
                      // return the data about the new check 
                      callback(200, checkObject);
                    } else {
                      callback(500, {
                        "Error": "Could not update the user with new check"
                      })
                    }
                  })
                } else {
                  callback(500, {
                    "Error": "Could not create the new check"
                  })
                }
              })
            } else {
              callback(400, {
                "Error": "The user already has the maximum number checks ( " + config.maxChecks + " )"
              })
            }
          } else {
            callback(403);
          }
        })
      } else {
        callback(403);
      }
    })
  } else {
    callback(400, {
      "Error": "Missing required inputs, or inputs are invalid"
    })
  }
}
//Checks - get
// Required data: id 
// Optional data : none 
// @TODO only let authenticated use access objects
handlers._checks.get = function (data, callback) {
  var id =
    typeof data.queryStringObject.id == "string" &&
    data.queryStringObject.id.trim().length == 20 ?
    data.queryStringObject.id.trim() :
    false;
  if (id) {
    //look up the check
    _data.read('checks', id, function (err, checkData) {
      if (!err && checkData) {
        var token =
          typeof data.headers.token == "string" ? data.headers.token : false;
        // varify if the given token is valid and belongs to the user who created the check
        handlers._tokens.varifyToken(token, checkData.userPhone, function (tokenIsValid) {
          if (tokenIsValid) {
            //Return the check data
            callback(200, checkData)
          } else {
            callback(403);
          }
        });
      } else {
        callback(404)
      }
    })
  } else {
    callback(400, {
      Error: "Missing  required field"
    });
  }
};
//checks put
//required data - id,
// optional data -protocol,url,methods,successCode, TimeoutSeconds
handlers._checks.put = function (data, callback) {
  //check for the reuqired fields and 
  var id =
    typeof data.payload.id == "string" &&
    data.payload.id.trim().length == 20 ?
    data.payload.id.trim() :
    false;
  // check for the optional fields
  var protocol =
    typeof data.payload.protocol == "string" && ['https', 'http'].indexOf(data.payload.protocol) > -1 ?
    data.payload.protocol :
    false;
  var url =
    typeof data.payload.url == "string" &&
    data.payload.url.trim().length > 0 ?
    data.payload.url.trim() :
    false;
  var method = typeof (data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
  var successCodes = typeof (data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
  var timeoutSeconds = typeof (data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;
  //check if the id is valid
  if (id) {
    //check if one or more optional data is present
    if (protocol || url || method || successCodes || timeoutSeconds) {
      _data.read('checks', id, function (err, checkData) {
        if (!err && checkData) {
          var token =
            typeof data.headers.token == "string" ? data.headers.token : false;
          handlers._tokens.varifyToken(token, checkData.userPhone, function (tokenIsValid) {
            if (tokenIsValid) {
              // //Return the check data
              // callback(200,checkData)
              // update the check where neccessary 
              if (protocol) {
                checkData.protocol = protocol
              }
              if (url) {
                checkData.url = url
              }
              if (method) {
                checkData.method = method
              }
              if (successCodes) {
                checkData.successCodes = successCodes
              }
              if (timeoutSeconds) {
                checkData.timeoutSeconds = timeoutSeconds
              }
              _data.update('checks', id, checkData, function (err) {
                if (!err) {
                  callback(200)
                } else {
                  callback(500, {
                    'Error': "Could not update the check."
                  })
                }
              })
            } else {
              callback(403);
            }
          });
        } else {
          callback(400, {
            "Error": "Check ID did not exist."
          })
        }
      })
    } else {
      callback(400, {
        "Error": "Missing fields to update."
      })
    }
  } else {
    callback(400, {
      "Error": "Missing the required field"
    })
  }
}
// checks - delete 
// required data - id
// optional dat - none 
handlers._checks.delete = function (data, callback) {
  //check that the phone number is valid
  var id =
    typeof data.queryStringObject.id == "string" &&
    data.queryStringObject.id.trim().length == 20 ?
    data.queryStringObject.id.trim() :
    false;
  if (id) {
    //Look up the checks 
    _data.read('checks', id, function (err, checkData) {
      if (!err && checkData) {
        let token =
          typeof data.headers.token == "string" ? data.headers.token : false;
        // varify if the given token is valid for the id number
        handlers._tokens.varifyToken(token, checkData.userPhone, function (tokenIsValid) {
          if (tokenIsValid) {
            //Delete the check data 
            _data.delete('checks', id, function (err) {
              if (!err) {
                // look up ther user 
                _data.read("users", checkData.userPhone, function (err, userData) {
                  if (!err) {
                    var userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                    // remove the delete check from their list of checks 
                    var checkPosition = userChecks.indexOf(id);
                    if (checkPosition > -1) {
                      userChecks.splice(checkPosition, 1)
                      // re-save the user data 
                      _data.update("users", checkData.userPhone, userData, function (err) {
                        if (!err) {
                          callback(200);
                        } else {
                          callback(500, {
                            Error: "Could not update the user"
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        "Error": "Could not find the check on the user object, so could not remove it"
                      })
                    }
                  } else {
                    callback(404, {
                      Error: "Could not find the specified user"
                    });
                  }
                });
              } else {
                callback(500, {
                  "Error": "Could not delete the check data"
                })
              }
            })
          } else {
            callback(403);
          }
        });
      } else {
        callback(400, {
          "Error": "Thie specified checkID does not exist"
        })
      }
    });
  } else {
    callback(400, {
      Error: "Missing  required field"
    });
  }
};
// handlers.sample = function (data, callback) {
//   //call http status code , and a payload object
//   callback(406, { name: "sample handlers" });
// };
//ping handler
handlers.ping = function (data, callback) {
  callback(200);
};
//not founder handlers
handlers.notFound = function (data, callback) {
  callback(404);
};
// Export the handlers
module.exports = handlers;