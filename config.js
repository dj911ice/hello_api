/*
CONFIGUATION TO EXPORT FILE
*/

//Environments
var enviornments = {};

//Development (Default) environment
enviornments.dev = {
	'httpPort' : 3000,
	'envName' : 'Development'
};

//Enviorment to pass to command line
var currentEnviornment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//Check current environment
var enviornmentToExport = typeof(enviornments[currentEnviornment]) == 'object' ? enviornments[currentEnviornment] : enviornments.dev;

//Module(s) to export
module.exports = enviornmentToExport;