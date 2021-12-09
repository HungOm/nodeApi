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

//Declare the app
var app = {};


app.init = function(){
  //start the server

  server.init();

  //start the workers
  // workers.init();
};


//execute 

app.init();


//Export the app;
module.exports = app;

