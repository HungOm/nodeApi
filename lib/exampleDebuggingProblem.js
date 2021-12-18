/**
 * 
 * This is an example to debugg when init() is call
 * 
 */

//Container for module
const example = {}


//Init function
example.init = function(){
    //This is an error created intentionally
    let foo = bar
}



//export module
module.exports = example