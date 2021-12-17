/*
 * Helpers for various taska
 *
 */
//Dependencies
var crypto = require('crypto');
// const querystring = require('querystring'); //replaced with UrlSearchParams API
var config = require('./config');
const https = require('https');
const path = require('path');
const fs = require('fs');
// const { request } = require('http');
const accountSid = process.env.TWILIO_ACCOUNT_SID
// config.twilio.accountSid;
// const authToken = config.twilio.authToken;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE;
const twillioClient = require('twilio')(accountSid, authToken)
/**
 * 
 * const twillioClient = require('twilio')(accountSid, authToken)
 * "dependencies": {
 * "twilio": "^3.71.3"}
 * 
 * Add this if prefer to use twilio oficail client
 * 
 */
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
        return {}
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
helpers.sendTwilioSMS = function (phone, msg, callback) {
    // validaate parameter 
    phone = typeof (phone) == 'string' && phone.trim().length >= 10 && phone.trim().length <= 12 ? phone.trim() : false;
    msg = typeof (msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
    // if (phone && msg) {
    //     let phoneWithCode = "+6" + phone;
    //     //configure the request payload
    //     var payload = {
    //         'From': fromPhone,
    //         'To': phoneWithCode,
    //         'Body': msg
    //     }
    //     //Stringyfy the payload
    //     let params = new URLSearchParams(payload);
    //     let stringPayload = params.toString()
    //     // let stringPayload = querystring.stringify(payload)
    //     //configure the request details
    //     let requestDetails = {
    //         'protocol': 'https:',
    //         'hostname': 'api.twilio.com',
    //         'method': 'POST',
    //         'path': '/2010-04-01/Accounts/' + accountSid + '/Messages.json',
    //         'auth': accountSid + ':' + authToken,
    //         'headers': {
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //             'Content-Length': Buffer.byteLength(stringPayload)
    //         }
    //     }
    //     //Instantiate the request object 
    //     let req = https.request(requestDetails, function (res) {
    //         //Grab the status of the sent request
    //         var status = res.statusCode
    //         //Callback successfull if the request went through
    //         if (status == 200 || status == 201) {
    //             callback(false);
    //         } else {
    //             callback("Status code returned was " + status);
    //         }
    //     });
    //     //bind to the error event so the error doesnt get thrown
    //     req.on('error', function (e) {
    //         callback(e)
    //     });
    //     //Add the payload
    //     req.write(stringPayload)
    //     //End the request  
    //     req.end();
        /**
         * 
         * const twillioClient = require('twilio')(accountSid, authToken)
         * "dependencies": {
         * "twilio": "^3.71.3"}
         * 
         * Add this if prefer to use twilio oficail client
         * 
         */
        /**  ----------------------------------------------------------
         * with twilio official client request 
         * 
         * 
         * if (phone && msg) {
         *     let phoneWithCode = "+6" + phone;
         *     try{
         *         twillioClient.messages
         *         .create({
         *             to: phoneWithCode,
         *             from: fromPhone,
         *             body: msg,
         *         })
         *         .then(function(){
         *                 callback(false);
         *         }
         *             );
         *     }catch(e){
         *         console.log(e)
         *         callback(404,"Error: Something went wrong")
         *     }
         ----------------------------------------------------------
         */

               if (phone && msg) {
              let phoneWithCode = "+6" + phone;
              try{
                  twillioClient.messages
                  .create({
                      to: phoneWithCode,
                      from: fromPhone,
                      body: msg,
                  })
                  .then(function(){
                          callback(false);
                  }
                      );
              }catch(e){
                  console.log(e)
                  callback(404,"Error: Something went wrong")
              }
    } else {
        callback("Given parameters were missing or invalid.")
    }
};
//Get the string content of a template 
helpers.getTemplate = function(templateName,data,callback){
    templateName = typeof templateName =='string'&& templateName.length>0?templateName:false;
    data = typeof(data)=='object' && data !== null?data:{};
    if(templateName){
        let templateDir = path.join(__dirname,'/../templates/');
        fs.readFile(templateDir+templateName+'.html','utf8',function(err,str){
            if(!err && str && str.length>0){
                //Do interpolation on the string;
                let finalString = helpers.interpolate(str,data);
                callback(false,finalString);    
            }else{
                callback("No template could be found ")
            }
        });
    }else{
        callback('A valid template was not specified');
    }
}
//Add the universal header and footer to a string and pass a provide data object to header and footer for interpolation
helpers.addUniversalTempaltes = function(str,data,callback){
    str=typeof(str)=='string' && str.length> 0? str: '';
    data = typeof(data)=='object' && data !== null?data:{};
    //get the header 
    helpers.getTemplate('_header',data,function(err,headerString){
        if(!err && headerString){
            //Get the footer 
            helpers.getTemplate('_footer',data,function(err,footerString){
                if(!err && footerString){
                    //Add them all together
                    let fullString = headerString + str + footerString;
                    callback(false,fullString);
                }else{
                    callback('Could not find the footer template');
                }
            })
        }else{
            callback('Could not fine the header template');
        }
    })
}
//Take a given string and data objec find /replace all the keys withing it
helpers.interpolate = function(str,data){
    str=typeof(str)=='string' && str.length> 0? str: '';
    data = typeof(data)=='object' && data !== null?data:{};
    // add the templateGlobal to data Object, prepending their key name iwth global 
    for(let keyname in config.templateGlobals){
        if(config.templateGlobals.hasOwnProperty(keyname)){
            data['global.'+keyname] = config.templateGlobals[keyname];
        }
    }
    // for each key in the data object ,insert its value into the string corespponding placeholder
    for(let key in data){
        if(data.hasOwnProperty(key)&& typeof data[key]=='string'){
            let replace = data[key];
            let find ='{'+key+'}';
            str = str.replace(find,replace);
        }
    }
    return str;
}
//Get the content of the (public) assets
helpers.getStaticAsset = function(fileName,callback){
    fileName = typeof fileName =='string' && fileName.length>0?fileName:false;
    if(fileName){
        let publicDir = path.join(__dirname,'/../public/');
        fs.readFile(publicDir+fileName,function(err,data){
            if(!err && data){
                callback(false,data);
            }else{
                callback('No file could be found')
            }
        })
    }else{
        callback('A valid file name was not specified');
    }
}
//Export the module
module.exports = helpers