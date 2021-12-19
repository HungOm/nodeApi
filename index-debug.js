/*
*
*
* primay file
*
*
*/

//Dependencies

const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');
const exampleDebugginProblem = require('./lib/exampleDebuggingProblem');

//Declare the app
var app = {};


app.init = function(){
  //start the server

  server.init();

  //start the workers
  workers.init();

  //command line after server starts
  setTimeout(function(){
    cli.init()
  },50);

  // set foo at 1 
  let foo = 1;

  //Increment foo
  foo++;

  //square foo
  foo = foo*foo;

  //Convert


  //call the init script that wil throw
  exampleDebugginProblem.init()

  
};


//execute 

app.init();


//Export the app;
module.exports = app;

