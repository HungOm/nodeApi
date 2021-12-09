/*
 * Helpers for various taska
 *
 */
//Dependencies
var crypto = require('crypto');
// const querystring = require('querystring'); //replaced with UrlSearchParams API
var config = require('./config');
const https = require('https');



// container for Helpers 
var helpers = {};
//hash password
helpers.hash = function (str) {
    if (typeof (str) == 'string' && str.length > 0) {
        var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false
    }
}

//parse json to objec, without throwing an Error
helpers.parseJsonToObject = function (str) {
    // str.password = str.password.toString()
    try {
        var obj = JSON.parse(str)
        // make sure int password are in string numberic 
        if (obj.password) {
            obj.password = obj.password.toString()
        }
        return obj
    } catch (e) {
        return e
    }
}

//create a string of random alphanumeric characters , of a given length
helpers.createRandomString = function (strLength) {
    strLength = typeof (strLength) == 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
        //define all the possible characters that could go a string
        var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890'
        var str = '';
        for (i = 1; i <= strLength; i++) {
            // get a random charactor from the possibleCharacters string 
            var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // append this character to the final string 
            str += randomCharacter;
        };
        return str;
    } else {
        return false;
    }
}

//send sms via twillio
helpers.sendTwillioSMS = function (phone, msg, callback) {
    // validaate parameter 
    phone = typeof (phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false;
    msg = typeof (msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
    console.log(phone)
    if (phone && msg) {
        //configure the request payload
        var payload = {
            'from': config.twillio.fromPhone,
            'To': "+6" + phone,
            'Body': msg
        }
        //Stringyfy the payload
        let params = new URLSearchParams(payload);
        let stringPayload = params.toString()
        // let stringPayload = querystring.stringify(payload)
        //configure the request details
        console.log(stringPayload)
        let requestDetails = {
            'protocol': 'https:',
            'hostname': 'api.twillio.com',
            'method': 'POST',
            'path': '/2010-04-01/Accounts/' + config.twillio.accountId + '/messages.json',
            'auth': config.twillio.accountSid + ':' + config.twillio.authToken,
            'headers': {
                'Content-Type': 'application/x-wwww-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringPayload)
            }
        }
        //Instantiate the request object 
        let req = https.request(requestDetails, function (res) {
            //Grab the status of the sent request
            var status = res.statusCode
            //Callback successfull if the request went through
            if (status == 200 || status == 201) {
                callback(false);
            } else {
                callback("Status code returned was " + status);
            }
        });
        //bind to the error event so the error doesnt get thrown
        req.on('error', function (e) {
            callback(e)
        });
        //Add the payload
        req.write(stringPayload)
        //End the request  
        req.end();
    } else {
        callback("Given parameters were missing or invalid.")
    }
};
//Export the module
module.exports = helpers