/**
 * Primary file for the API 
 */

// Dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');

// Declare the app
var app = {};

// Init function
app.init = function(callback){      //                    Ovo callback da probam da logujem
    // Start the server
    server.init();

    // Start the workers
    workers.init();

    // Start the CLI, but make sure it starts last
    setTimeout(function(){
        cli.init();
        callback();              //                    Ovo callback da probam da logujem
    },50);
};

// Execute 
if(require.main === module){
    app.init(function(){});             //                    Ovo function da probam da vidim kakva je razlika
}

// Export the app
module.exports = app;