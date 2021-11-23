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
        var hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
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

//create a string of random alphanumeric characters , of a given length
helpers.createRandomString =function(strLength){
    strLength = typeof(strLength)=='number' && strLength>0?strLength:false;

    if(strLength){

        //define all the possible characters that could go a string
        var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890'
        
        var str ='';
        for(i=1;i<=strLength;i++){
            // get a random charactor from the possibleCharacters string 

            var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random()*possibleCharacters.length));

            // append this character to the final string 
            str+=randomCharacter;
        };
        return str;

    }else{
        return false;
    }
}






//Export the module

module.exports =helpers