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


//Responders object
cli.responders = {};

//Input handlers
e.on('man',function(str){
    cli.responders.help();
});
e.on('help',function(str){
    cli.responders.help();
    
});

e.on('exit',function(){

    cli.responders.exit();

});
e.on('stats',function(){
    cli.responders.stats();
});

e.on('list users',function(str){
    cli.responders.listUsers();
});

e.on('more user info',function(str){
    cli.responders.moreUserInfo(str);
});

e.on('list checks',function(str){
    cli.responders.listChecks(str);

});

e.on('more check info',function(str){
    cli.responders.moreCheckInfo(str);
});

e.on('list logs',function(str){
    cli.responders.listLogs(str);
});

e.on('more log info',function(str){
    cli.responders.moreLogInfo();

});




//Help /man
cli.responders.help = function(){
 console.log('You asked for help');

 const commands = {
    'man':'Show this help page',
    'help':'alias of the "man" command',
    'exit':'Kill the cli and the rest of the application',
    'stats':'Get the statistics on the underlying operating system',
    'list users':'Show a list of all the registered(undeleted) users in the system',
    'more user info --{userId}':'Show details of a specific user',
    'list checks --up --down':'show a list of all the active checks in the system, including their state. The "--up" and "--down" are optional',

    'more checks info --{checkId}':'Show details of a specified check',
    'list logs':'Show a list of all the log files available to be read ( Compressed and uncompressed',
    'more log info --{filename}':'Show details of a specified Log file'
 };

 //show a header for the help page that is as wide as  the screeen

 cli.horizontalLine();
 cli.centered('CLI MANUAL');
 cli.verticalSpace(2);
 
//  Show each command , followed by its explaination in white and yellow respectively
for(let key in commands){
    if(commands.hasOwnProperty(key)){
        let value = commands[key];
        let lines = '\x1b[33m'+key+'\x1b[0m';
        let padding = 60 - lines.length;
        for(i = 0;i<padding;i++){
            lines+=' ';
        }
        lines += '\x1b[37m'+value+'\x1b[0m'
        console.log(lines);
        cli.verticalSpace();

    }
}

cli.verticalSpace(1)

// endo of another horizontalLine 
cli.horizontalLine()
};


//create a vertical lines space
cli.verticalSpace =function(lines){
    lines = typeof(lines)=='number' && lines> 0?lines:1;
    for(i = 0;i<lines;i++){
        console.log('')

    }
}


//create a horizontal line a cross the screen;
cli.horizontalLine = function(){
    //GEt the available screen size
    let width = process.stdout.columns;
    let lines = '';
    for(i=0;i<width;i++){
        lines+='-'
    }
    console.log(lines);
}


//centered text on the screen

cli.centered = function(str){
    str = typeof(str) =='string' && str.trim().length>0?str.trim():'';
    // get the a vailabe screen size
    let width = process.stdout.columns;


    // calculate teh left padding there should be  
    let leftPadding = Math.floor((width-str.length)/2);

    // put in left padding spaces before the string itself.

    let lines = '';
    for(i=0;i<leftPadding;i++){
        lines+='';

    }

    lines+=str;
    console.log(lines);
}
//exit
cli.responders.exit = function(){
    console.log('You asked for exit');
    process.exit(0);
};

//stats
cli.responders.stats = function(){
    console.log("You asked for stats")
};


//list users
cli.responders.listUsers = function(){
    console.log("You asked to list users")

};

//more user info
cli.responders.moreUserInfo = function(){
    console.log("You asked for more user info")
};


//list checks
cli.responders.listChecks = function(){
    console.log("You asked to list checks")
};
 //more check info
cli.responders.moreCheckInfo = function(){
    console.log("You asked for more check info")

}

//list logs
cli.responders.listLogs = function(){
    console.log("You asked to list logs")

}


//more log info
cli.responders.moreLogInfo = function(){
    console.log("You asked for more log info");
};





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
            'more user info',
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