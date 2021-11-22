/*
* Helpers for various taska
*
*/


//Dependencies
var crypto = require('crypto');
var config = require('./config')


// container for Helpers 

var helpers = {};


//hash password

helpers.hash = function(str){
    if(typeof(str)=='string' && str.length>0){
        var hash = crypto.createHmac('sha256',config.hashingSecret).update('hex');
        return hash;
    }else{
        return false
    }

}

//parse json to objec, without throwing an Error

helpers.parseJsonToObject = function(str){

        try{
            var obj = JSON.parse(str)
            return obj
        }catch(e){
        
            return e
        }
}






//Export the module

module.exports =helpers