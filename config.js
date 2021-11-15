// create and export configuration variables 


//container for all environments 
var environments = {};


//staging enviroemnts

environments.staging={
    'port':3000,
    'envName':'staging'

};


//production environments 
environments.production={
    'port':5000,
    'envName':'production'

}

//Determine which enviroment was passed as command-line argument
var currentEnv = typeof(process.env.NODE_ENV) == 'string'?process.env.NODE_ENV.toLowerCase():'';

//check if curren enviroment is one of the defined above, if not , default to staging

var environmentToExport = typeof(environments[currentEnv])=='object'?environments[currentEnv]:environments.staging;


// export the module 
module.exports = environmentToExport;