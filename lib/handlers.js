/*
 *
 * Request handlers
 *
 */
//dependency
var _data = require("./data");
var helpers = require("./helpers");
//define handler
var handlers = {};
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
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  var lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  var phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;
  var password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length >= 6
      ? data.payload.password.trim()
      : false;
  var tosAgreement =
    typeof data.payload.tosAgreement == "boolean" &&
    data.payload.tosAgreement == true
      ? true
      : false;
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
              // console.log(err);
              callback(500, { Error: "could not create the new user" });
            }
          });
        } else {
          callback(500, { Error: "could not hash the user's password" });
        }
      } else {
        callback(404, { Error: "A user with that phone number already exist" });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};
//users - get
//required data: phone
//Optional data: none
// @TODO only let authenticated use access objects
handlers._users.get = function (data, callback) {
  var phone =
    typeof data.queryStringObject.phone == "string" &&
    data.queryStringObject.phone.trim().length == 10
      ? data.queryStringObject.phone.trim()
      : false;
  if (phone) {
    var token =
      typeof data.headers.token == "string" ? data.headers.token : false;
    // varify if the given token is valid for the phone number
    handlers._tokens.varifyToken(token, phone, function(tokenIsValid) {
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
        callback(403, { Error: "Missing required valid token in header" });
      }
    });
  } else {
    callback(400, { Error: "Missing  required field" });
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
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;
  var firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  var lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  var password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length >= 6
      ? data.payload.password.trim()
      : false;
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
                  callback(500, { Error: "Could not update the user" });
                }
              });
            } else {
              callback(400, { Error: "The specified user does not exist" });
            }
          });
        } else {
          callback(400, { Error: "Missing fields to update" });
        }
      } else {
        callback(403, { Error: "Missing required token in header" });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};
//users - delete
//required field - phone
//@TODO only let authenicate user delete their objects
//@TODO clean up (Delete) any other datafile associated with this user
handlers._users.delete = function (data, callback) {
  //check that the phone number is valid
  var phone =
    typeof data.queryStringObject.phone == "string" &&
    data.queryStringObject.phone.trim().length == 10
      ? data.queryStringObject.phone.trim()
      : false;
  if (phone) {
    var token =
      typeof data.headers.token == "string" ? data.headers.token : false;
    // varify if the given token is valid for the phone number
    handlers._tokens.varifyToken(token, phone, function (tokenIsValid) {
      if (tokenIsValid) {
        _data.read("users", phone, function (err, data) {
          if (!err && data) {
            //Remove the hashed password from the user object before returning to the requesting user
            // delete data.hashedPassword;
            _data.delete("users", phone, function (err) {
              if (!err) {
                callback(200);
              } else {
                callback(500, { Error: "Could not remove the user" });
              }
            });
          } else {
            callback(404, { Error: "Could not find the specified user" });
          }
        });
      } else {
        callback(403, { Error: "Missing required token in header" });
      }
    });
  } else {
    callback(400, { Error: "Missing  required field" });
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
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;
  var password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length >= 6
      ? data.payload.password.trim()
      : false;
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
            id: tokenId,
            expires: expires,
          };
          //store the token
          _data.create("tokens", tokenId, tokenObject, function (err) {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, { Error: "Could not create new token" });
            }
          });
        } else {
          callback(400, { Error: "Password did not match" });
        }
      } else {
        callback(400, { Error: "Could not find the specified user" });
      }
    });
  } else {
    callback(400, { Error: "Missing required fields" });
  }
};
//Token - get
handlers._tokens.get = function (data, callback) {
  var id =
    typeof data.queryStringObject.id == "string" &&
    data.queryStringObject.id.trim().length == 20
      ? data.queryStringObject.id.trim()
      : false;
  if (id) {
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        //Remove the hashed password from the user object before returning to the requesting user
        callback(200, tokenData);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: "Missing  required field" });
  }
};
//Token - put
//required data -id,extend(expiration time) -> 1 hour extension by default
//Optional data- non
handlers._tokens.put = function (data, callback) {
  var id =
    typeof data.payload.id == "string" && data.payload.id.trim().length == 20
      ? data.payload.id.trim()
      : false;
  var extend =
    typeof data.payload.extend == "boolean" && data.payload.extend == true
      ? true
      : false;
  if (id && extend) {
    //Look up the token
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        //check to make sure the token is not expired yet
        if (tokenData.expires > Date.now()) {
          //set the expiration an hour from now
          tokenData.expires = Date.now() + 1000 * 60 * 60;
          //store the new update
          _data.update("tokens", id, tokenData, function (err) {
            if (!err) {
              callback(200, { Success: "Token extended 1 hour from now." });
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
        callback(400, { Error: "Specified token  does not exist" });
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
    data.queryStringObject.id.trim().length == 20
      ? data.queryStringObject.id.trim()
      : false;
  console.log(id);
  if (id) {
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        //Remove the hashed password from the user object before returning to the requesting user
        // delete data.hashedPassword;
        _data.delete("tokens", id, function (err) {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: "Could not delete the speicifed token" });
          }
        });
      } else {
        callback(404, { Error: "Could not find the specified token" });
      }
    });
  } else {
    callback(400, { Error: "Missing  required field" });
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
    }else{
      callback(false);
    }
  });
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
