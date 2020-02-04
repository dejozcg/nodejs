/**
 * Create and export coonfiguration variables
 * 
 */

// +15088024281

 // Container for all the environments
 var environments = {};

 // Staging (default) environment
 environments.staging = {
     'httpPort': 3000,
     'httpsPort': 3001,
     'envName': 'staging',
     'hashingSecret': 'secretKey',
     'maxCheck': 5,
     'twilio' : {
        'accountSid' : 'ACbf9af8f391f3f0f22e1cd3bc213d767c',
        'authToken' : 'ac6cdacdd12ef39976f55de9c9deb629',
        'fromPhone' : '+38267802725'
      }
 };

 // Production environment
 environments.production = {
     'httpPort': 5000,
     'httpsPort': 5001,
     'envName': 'production',
     'hashingSecret': 'AlsosecretKey',
     'maxCheck': 5,
     'twilio' : {
        'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
        'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
        'fromPhone' : '+15005550006'
      }
 };

// Determine which environment was passed as a comand-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default string
var environmentToExport = typeof(environments[currentEnvironment]) == 'object'? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;
