/*
 *
 * Workers related tasks
 *
 */
//Dependencies. 
const path = require('path');
const fs = require('fs');
const _data = require('./data');
const https = require('https');
const http = require('http');
const helpers = require('./helpers');
const url = require('url');
const { PassThrough } = require('stream');
//instatiate the workers object 
const workers = {};
//Look up all checks, get their data, send to a validator
workers.gatherAllChecks = function(){
    // get all the checks exists in the systems 
    _data.list('checks',function(err,checks){
        if(!err && checks && checks.length > 0){
            checks.forEach(check => {
                //Read in the check data
                _data.read('checks',check,function(err,originalCheckData){
                    if(!err && originalCheckData){
                        //Pass it to the check validator, and let that function continue or log error
                        workers.validateCheckData(originalCheckData)
                    }else{
                        console.log("Error reading one of the check data. ",err)
                    }
                })
            });
        }else{
            console.log("Error: Could not find any checks to process")
        }
    })
}
//Sanity - check the check data
workers.validateCheckData = function(originalCheckData){
    originalCheckData = typeof(originalCheckData) == 'object' && originalCheckData !== null ? originalCheckData : {};
    originalCheckData.id = typeof(originalCheckData.id) == 'string' && originalCheckData.id.trim().length == 20 ? originalCheckData.id.trim() : false;
    originalCheckData.userPhone = typeof(originalCheckData.userPhone) == 'string' && originalCheckData.userPhone.trim().length == 10 ? originalCheckData.userPhone.trim() : false;
    originalCheckData.protocol = typeof(originalCheckData.protocol) == 'string' && ['http','https'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol : false;
    originalCheckData.url = typeof(originalCheckData.url) == 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim() : false;
    originalCheckData.method = typeof(originalCheckData.method) == 'string' &&  ['post','get','put','delete'].indexOf(originalCheckData.method) > -1 ? originalCheckData.method : false;
    originalCheckData.successCodes = typeof(originalCheckData.successCodes) == 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ? originalCheckData.successCodes : false;
    originalCheckData.timeoutSeconds = typeof(originalCheckData.timeoutSeconds) == 'number' && originalCheckData.timeoutSeconds % 1 === 0 && originalCheckData.timeoutSeconds >= 1 && originalCheckData.timeoutSeconds <= 5 ? originalCheckData.timeoutSeconds : false;
    // Set the keys that may not be set (if the workers have never seen this check before)
    originalCheckData.state = typeof(originalCheckData.state) == 'string' && ['up','down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down';
    originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) == 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;
if(originalCheckData.id && originalCheckData.userPhone && originalCheckData.protocol &&
    originalCheckData.url  &&
    originalCheckData.method  &&
    originalCheckData.successCodes  &&
    originalCheckData.timeoutSeconds){
            workers.performCheck(originalCheckData);
        }else{
            console.log("One of the checks is not properly formmated. Skipping it-")
        }
}
//Perform the check , take the originalCheck data nad the outcome of the check process to the next step
workers.performCheck = function(originalCheckData){
    // prepare the initail check outcome 
    let checkOutcome = {
        'error':false,
        'responseCode':false
    };
    //Mark the outcome has not been sent yet
    let outComeSent= false;
    //parse the hostname and the path out of the original check data
    let parsedUrl = url.parse(originalCheckData.protocol+"://"+originalCheckData.url,true);
    let hostname = parsedUrl.hostname;
    let path = parsedUrl.path;//Using path , not "pathname" because we want the query string
    //Construct the request
    let requestDetails = {
        'protocol':originalCheckData.protocol+":",
        'hostname':hostname,
        'method':originalCheckData.method.toUpperCase(), // the method needs to be uppercase
        'timeout':originalCheckData.timeoutSeconds * 1000
    }
    //Instatiate the request object using http or https module
    let _moduleToUse = originalCheckData.protocol =='http'? http:https;
    let req = _moduleToUse.request(requestDetails,function(res){
        let status = res.statusCode;
        //UPdate the check out come and pass the data along
        checkOutcome.responseCode=status;
        if(!outComeSent){
            workers.processCheckOutCome(originalCheckData,checkOutcome);
            outComeSent= true;
        }
    });
    //Bind to the Error event so it doesnt get thrown
    req.on('error',function(e){
        //UPdate the checkout come and pass the data along
        checkOutcome.error = {
            'error':true,
            value:e
        }
        if(!outComeSent){
            workers.processCheckOutCome(originalCheckData,checkOutcome);
            outComeSent= true;
        }
    });
        //Bind to the timeout 
        req.on('timeout',function(e){
            //UPdate the checkout come and pass the data along
            checkOutcome.error = {
                'error':true,
                value:'timeout'
            }
            if(!outComeSent){
                workers.processCheckOutCome(originalCheckData,checkOutcome);
                outComeSent= true;
            }
        });
        //End the request
        req.end()
}
//Process the check outcome, update the check data as needed, trigger alert
//special logic for accormodating the check that never been tested before (dont alert )
workers.processCheckOutCome=function(originalCheckData,checkOutcome){
    //Decide if the check is up or down
    let state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode)>-1? 'up':'down';
    //Decide if alert is waranted
    let alertWarrented = originalCheckData.lastChecked && originalCheckData.state !== state ? true:false
    //Update the check data
    let newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();
    //save the updates
    _data.update('checks',newCheckData.id,newCheckData,function(err){
        if(!err){
            //send the new check data to the next phase in the process if needed
            if(alertWarrented){
                workers.alertUserToStatusChange(newCheckData)
            }else{
                console.log('Check outcome has not changed, no alert needed');
            }
        }else{
            console.log("Error tryning to save the updates to one of the checks")
        }
    })
}
//Alert the user as to change in their check status
workers.alertUserToStatusChange=function(newCheckData){
    let msg = 'Alert: Your check for '+newCheckData.method.toUpperCase()+' '+newCheckData.protocol+'://'+newCheckData.url+' is currently '+newCheckData.state;
    helpers.sendTwilioSMS(newCheckData.userPhone,msg,function(err){
        if(!err){
            console.log("Success: User was alerted to a status change in their check, via sms: ",msg)
        }else{
            console.log("Error: Could not send SMS alert who had a state change their check.", err)
        }
    })
}
//timers to execute workers once per minutes
workers.loop = function () {
    setInterval(function () {
        workers.gatherAllChecks();
    }, 200 * 60)
}
//initiate the workers
workers.init = function(){
    //Execute all the checks immediately
    workers.gatherAllChecks();
    //call the loops so the checks continues to execute later on 
    workers.loop();
}
// Export the module 
module.exports = workers
