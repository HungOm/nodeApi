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
        var HashedPassword = helpers.hash(password);

        if (HashedPassword) {
          //create the use object
          var userObject = {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            hashedPassword: HashedPassword,
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

      // console.log(firstName,lastName,password,phone)

      //error if the phone is invalid
      if(phone){
        //Error if nothing is sent  update
        if(firstName||lastName || password ){
          //Look up the user

          _data.read('users',phone,function(err,userData){
            if(!err&&userData){
              // update the neceesary data 
              if(firstName){
                userData.firstName = firstName;

              }
              if(lastName){
                userData.lastName = lastName;
              }
              if(password){
                userData.hashedPassword = helpers.hash(password)
              }
              //store the updated data
              _data.update('users',phone,userData,function(err){
                if(!err){
                  callback(200)
                }else{
                  callback(500,{"Error":'Could not update the user'})
                }

              });

            }else{
              callback(400,{'Error':'The specified user does not exist'})
            }
          })

        }else{
          callback(400,{'Error':'Missing fields to update'})
        }

      }else{
        callback(400,{'Error':'Missing required field'})
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
    _data.read("users", phone, function (err, data) {
      if (!err && data) {
        //Remove the hashed password from the user object before returning to the requesting user
        // delete data.hashedPassword;
        _data.delete('users',phone,function(err){
          if(!err){
            callback(200)

          }else{
            callback(500,{"Error":"Could not remove the user"})
          }
        });
      } else {
        callback(404,{"Error":"Could not find the specified user"});
      }
    });
  } else {
    callback(400, { Error: "Missing  required field" });
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
