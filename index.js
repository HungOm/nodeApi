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

//Declare the app
var app = {};


app.init = function(callback){
  //start the server

  server.init();

  //start the workers
  workers.init();

  //command line after server starts
  setTimeout(function(){
    cli.init()
    callback();
  },50);
  
};


//Self invoking only if required directly
if(require.main === module){
  app.init(function(){});
}


//Export the app;
module.exports = app;

