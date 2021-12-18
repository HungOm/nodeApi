/*
*
*
* primay file
*
*
*/

// 'use strict'

//Dependencies

const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');

//Declare the app
var app = {};


foo ='bar';

debugger


app.init = function(){
  //start the server

  server.init();

  //start the workers
  workers.init();

  //command line after server starts
  setTimeout(function(){
    cli.init()
  },50);
  
};


//execute 

app.init();


//Export the app;
module.exports = app;

