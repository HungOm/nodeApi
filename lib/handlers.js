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

  console.log(data.payload.tosAgreement+" ---------")
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
    data.payload.password.trim().length >=6
      ? data.payload.password.trim()
      : false;
  var tosAgreement =
    typeof data.payload.tosAgreement == "boolean" &&
    data.payload.tosAgreement == true
      ? true
      : false;

    console.log("-----------")
    console.log(password)
    console.log("------------")


  if (firstName && lastName && phone && password && tosAgreement) {
    //make sure the user doesnt already exist

    _data.read("users", phone, function (err, data) {
      if (err) {
        //Hash the password
        var HashedPassword = helpers.hash(password);

        if (HashedPassword) {
          //create the use object
          var userObject = {
            'firstName': firstName,
            'lastName': lastName,
            'phone': phone,
            'hashedPassword': HashedPassword,
            'tosAgreement': tosAgreement,
          };

          //store user object
          _data.create("users", phone, userObject, function (err) {
            if (!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, { Error: "could not create the new user" });
            }
          });
        }else{
            callback(500,{'Error':'could not hash the user\'s password'})
        }
      } else {
        callback(404, { Error: "A user with that phone number already exist" });
      }
    });
  } else {
    callback(400, { Error: "Missing required field"});
  }
};

//users - get

handlers._users.get = function (data, callback) {};

//users - put
handlers._users.put = function (data, callback) {};

//users - delete

handlers._users.delete = function (data, callback) {};

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