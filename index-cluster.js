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
const cluster = require('cluster');
const {
  cpus
} = require('os');


//Declare the app
var app = {};


app.init = function (callback) {

  // if we are on the master thread, start the background workers and CLI 
  if (cluster.isMaster) {
    //start the workers
    workers.init();

    //command line after server starts
    setTimeout(function () {
      cli.init()
      callback();
    }, 50);

    //Fork the process
    for (let i = 0; i < cpus().length; i++) {
      cluster.fork();
    }


  } else {

    // if we are not on the master thread , start the http server 

    //start the server
    server.init();



  }


};


//Self invoking only if required directly
if (require.main === module) {
  app.init(function () {});
}


//Export the app;
module.exports = app;
