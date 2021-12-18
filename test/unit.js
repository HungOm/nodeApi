
/**
 * 
 * this is unit test
 *  
 */

//Dependencies
const helpers = require('./../lib/helpers') // ./ -> means back out of current folder
const assert = require('assert');
const logs = require('./../lib/logs');
const exampleDebugginProblem = require('./../lib/exampleDebuggingProblem');


//Holder for this test 

const unit = {};




//Assert get a nubmer function is returnning a number
unit['helpers.getANumber should return a number'] = function (done) {
    let val = helpers.getANumber();
    assert.equal(typeof val, 'number');
    done();
}
//Assert get a nubmer function is returnning a number
unit['helpers.getANumber should return 1'] = function (done) {
    let val = helpers.getANumber();
    assert.equal(val, 1);
    done();
}
//Assert get a nubmer function is returnning a number
unit['helpers.getANumber should return 2'] = function (done) {
    let val = helpers.getANumber();
    assert.equal(val, 2);
    done();
}


//Log.list should return array and a false error;
unit['logs.list should callback a false error and an array of log names'] = function(done){
    logs.list(true,function(err,logFileNames){
        assert.equal(err,false);
        assert.ok(logFileNames instanceof Array);
        assert.ok(logFileNames.length>1);
        done();
    });
};


//Logs truncate should not throw if the log id does not exist
unit['Log truncate should not throw if the log id does not exist. It should callback an error instead.'] = function(done){
    assert.doesNotThrow(function(){
       logs.truncate('I do not exist',function(err){
           assert.ok(err);
           done();
       }) 
    },TypeError);
};

//exampleDebuggingProblem.init should not throw , (but it does)
unit['exampleDebuggingProblem.init should not throw when called'] = function(done){
    assert.doesNotThrow(function(){
      exampleDebugginProblem.init();
      done();
    },TypeError);
};


//export the test to the runner
module.exports = unit