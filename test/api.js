/**
 * API Test
 */

//Dependencies
const app = require('./../index');
const assert = require('assert');
const http = require('http');
const config = require('./../lib/config');


//create a holder for the test
const api = {};


// helper 
const helpers = {}

helpers.makeGetRequest = function(path,callback){
    //Configure the request details 
    let requestDetails = {
        'protocol':'http:',
        'hostname':'localhost',
        'port':config.httpPort,
        'method':'GET',
        'path':path,
        headers:{
            'Content-Type':'application/json'
        }
    };
    //Send the request details

    let req= http.request(requestDetails,function(res){
        callback(res);
    });
    req.end();

};

// The main the init function should be able to run without throwing
api['app init should start without throwing'] = function(done){
    assert.doesNotThrow(function(){
        app.init(function(err){
            done();
        })
    },TypeError)
}

//Make a request to /ping
api['/ping should respond to a GET with 200'] = function(done){
    helpers.makeGetRequest('/ping',function(response){
        assert.equal(response.statusCode,200)
        done();
    });
};

//Make a request to /api/users
api['/api/users should respond to a GET with 400'] = function(done){
    helpers.makeGetRequest('/api/users',function(response){
        assert.equal(response.statusCode,400)
        done();
    });
};


//Make a request to a /random/path
api['/random/path should respond to a GET with 404'] = function(done){
    helpers.makeGetRequest('/random/path',function(response){
        assert.equal(response.statusCode,404)
        done();
    });
};



//Export the test to the runner
module.exports = api;

