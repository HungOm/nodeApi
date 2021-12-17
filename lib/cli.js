'use-strict'
/**
 * 
 * cli related Tasks
 *
 */
//Dependencies
const readline = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');

class _events extends events {};
const e = new _events();

// Instiate the the CLI module object 
const cli = {};
//input processor
cli.processInput = function (str) {
    str = typeof (str) === 'string' && str.trim().length > 0 ? str.trim() : false;
    //Only process the input if the user actually wrote something. Otherwise ignore it;
    if (str) {
        //Codify the unique strings that indendify, the unique questions, allowed to be 
        let uniqueInput = [
            'man',
            'help',
            'exit',
            'stats',
            'list users',
            'list  user info',
            'list checks',
            'more checks info',
            'list logs',
            'more log info'
        ]
        //Go through the possible inputs, emit an event when a match is found
        let matchFound = false;
        let counter = 0;
        uniqueInput.some(function (input) {
            if (str.toLowerCase().indexOf(input) > -1) {
                matchFound = true;
                //Emit an event matching the unique input, and include the full string
                e.emit(input, str);
                return true;
            }
        });
        // if no match is found tell the user to try again 
        if (!matchFound) {
            console.log('Sorry, try again')
        };
    }
}
//initiate the script
cli.init = function () {
    //send the start message to the console, in dark blue 
    console.log('\x1b[34m%s\x1b[0m', "The CLI is running");
    //start the interface
    let _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '\x1b[34m ~\x1b[0m '
    })
    //create an initail prompt;
    _interface.prompt();
    // handle each line of input separately
    _interface.on('line', function (str) {
        //send to the input process
        cli.processInput(str)
        //re-initialize the promts after
        _interface.prompt();
    })
    _interface.on('close', function () {
        process.exit(0);
    })
}
//Export the module 
module.exports = cli;