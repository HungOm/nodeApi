// create and export configuration variables 
//container for all environments 
var environments = {};
//staging enviroemnts
// Create PORT 
LOCAL_HTTP_PORT = process.env.LOCAL_HTTP_PORT||3000;
LOCAL_HTTPS_PORT = process.env.LOCAL_HTTPS_PORT||3001;

environments.staging = {
    'httpPort': LOCAL_HTTP_PORT,
    'httpsPort': LOCAL_HTTPS_PORT,
    'envName': 'staging',
    'hashingSecret': "thisIsAsecret",
    "maxChecks": 5,
    'templateGlobals':{
        'appName':'Uptime',
        'companyName':'NotRealCompany, Inc',
        'yearCreated':'2021',
        'baseUrl':'http://localhost:3000/'
    }

};

//testing enviroments
environments.testing = {
    'httpPort': 4000,
    'httpsPort': 4001,
    'envName': 'testing',
    'hashingSecret': "thisIsAsecret",
    "maxChecks": 5,
    'templateGlobals':{
        'appName':'Uptime',
        'companyName':'NotRealCompany, Inc',
        'yearCreated':'2021',
        'baseUrl':'http://localhost:4000/'
    }

};

//production environments 
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret': "thisIsAsecret",
    "maxChecks": 5,

    'templateGlobals':{
        'appName':'Uptime',
        'companyName':'NotRealCompany, Inc',
        'yearCreated':'2021',
        'baseUrl':'http://localhost:5000/'
    }
  
}
//Determine which enviroment was passed as command-line argument
var currentEnv = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
//check if curren enviroment is one of the defined above, if not , default to staging
var environmentToExport = typeof (environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.staging;
// export the module 
module.exports = environmentToExport;
// the line below generate ssl certs 
// openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
