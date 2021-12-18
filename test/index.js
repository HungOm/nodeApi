/**
 * Test runner
 */

//Application log for test runner\
_app = {}; //global
//Container for the tests
_app.tests = {};


//Add on the unit tests 
_app.tests.unit = require('./unit');


//Count all the test
_app.countTest = function () {
    let counter = 0;
    for (let key in _app.tests) {
        if (_app.tests.hasOwnProperty(key)) {
            let subTests = _app.tests[key];
            for (let testName in subTests) {
                if (subTests.hasOwnProperty(testName)) {
                    counter++;
                }
            }
        }
    }
    return counter;
}
//produce a test report outcome report;
_app.produceTestReport = function (limit, successes, errors) {
    console.log("");
    console.log("------------BEGIN TEST REPORT -------------");
    console.log("");
    console.log("Total Tests: ", limit);
    console.log("Pass ", successes);
    console.log("Fail ", errors.length);
    console.log("");
    // if there is  error print them in details ;
    if (errors.length > 0) {
        console.log("------------ BEGIN ERROR DETAILS ----------");
        console.log("");
        errors.forEach(function (testError) {
            console.log('\x1b[31m%s\x1b[0m', testError.name);
            console.log(testError.error);
            console.log("");
        })
        console.log("");
        console.log("------------ END ERROR DETAILS ------------");
    }
    console.log("")
    console.log("------------ END TEST REPORT -------------");
}
//Run all test, with error and success data
_app.runTest = function () {
    let errors = [];
    let sucesses = 0;
    let limit = _app.countTest();
    let counter = 0;
    for (let key in _app.tests) {
        if (_app.tests.hasOwnProperty(key)) {
            let subTests = _app.tests[key];
            for (let testName in subTests) {
                if (subTests.hasOwnProperty(testName)) {
                    (function () {
                        let temTest = testName;
                        let testVal = subTests[testName]
                        //Call the test
                        try {
                            testVal(function () {
                                //If it calls back without throwing error, it succeeded, so log it in green
                                console.log('\x1b[32m%s\x1b[0m', temTest);
                                counter++;
                                sucesses++;
                                if (counter == limit) {
                                    _app.produceTestReport(limit, sucesses, errors)
                                }
                            })
                        } catch (e) {
                            //If it throw , it means test fail, therefore capture the errors
                            errors.push({
                                'name': testName,
                                'error': e
                            });
                            console.log('\x1b[31m%s\x1b[0m', temTest);
                            counter++;
                            if (counter == limit) {
                                _app.produceTestReport(limit, sucesses, errors)
                            }
                        }
                    })();
                }
            }
        }
    }
}
//Run the test
_app.runTest();
