/**
 * Request handlers
 */

// Dependencies
var _data = require('./data');
var helpers = require('./helpers');
var config = require('./config');

// Define all the handlers
var handlers = {};
/*
* HTML Handlers
*
*/

// Index Handler
handlers.index = function(data, callback){
    // Reject any request that isn't a GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Uptime Monitoring - Made Simple',
            'head.description' : 'We offer free, simple uptime monitoring for HTTP/HTTPS sites all kinds. When your site goes down, we\'ll send you a text to let you know',
            'body.class' : 'index'           
        };
        // Read in a template as a string
        helpers.getTemplate('index',templateData,function(err,str){
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,function(err,str){
                    if(!err && str){
                        // Return that page as HTMl
                        callback(200,str,'html');
                    }else{
                        callback(500,undefined,'html');
                    }
                });
            }else{
                callback(500,undefined,'html');
            }
        });
    }else{
        callback(405,undefined,'html');
    }
};

// Create Account
handlers.accountCreate = function(data, callback){
    // Reject any request that isn't a GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Create an Account',
            'head.description' : 'Signup is easy and only takes a few seconds.',
            'body.class' : 'accountCreate'           
        };
        // Read in a template as a string
        helpers.getTemplate('accountCreate',templateData,function(err,str){
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,function(err,str){
                    if(!err && str){
                        // Return that page as HTMl
                        callback(200,str,'html');
                    }else{
                        callback(500,undefined,'html');
                    }
                });
            }else{
                callback(500,undefined,'html');
            }
        });
    }else{
        callback(405,undefined,'html');
    }
};

// Create New Session
handlers.sessionCreate = function(data, callback){
    // Reject any request that isn't a GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Login to your account.',
            'head.description' : 'Please enter your phone number and password to access your account.',
            'body.class' : 'sessionCreate'           
        };
        // Read in a template as a string
        helpers.getTemplate('sessionCreate',templateData,function(err,str){
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,function(err,str){
                    if(!err && str){
                        // Return that page as HTMl
                        callback(200,str,'html');
                    }else{
                        callback(500,undefined,'html');
                    }
                });
            }else{
                callback(500,undefined,'html');
            }
        });
    }else{
        callback(405,undefined,'html');
    }
};

// Session has been deleted
handlers.sessionDeleted = function(data, callback){
    // Reject any request that isn't a GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Logged Out',
            'head.description' : 'You have been logged out of your account.',
            'body.class' : 'sessionDeleted'          
        };
        // Read in a template as a string
        helpers.getTemplate('sessionDeleted',templateData,function(err,str){
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,function(err,str){
                    if(!err && str){
                        // Return that page as HTMl
                        callback(200,str,'html');
                    }else{
                        callback(500,undefined,'html');
                    }
                });
            }else{
                callback(500,undefined,'html');
            }
        });
    }else{
        callback(405,undefined,'html');
    }
};

// Checks all
// handlers.checksList = function(data,callback){
//     var templateData = {
//         'head.title' : 'Login to your account.',
//         'head.description' : 'Please enter your phone number and password to access your account.',
//         'body.class' : 'sessionCreate'           
//     };
//      // Read in a template as a string
//      helpers.getTemplate('index',templateData,function(err,str){
//         if(!err && str){
//             // Add the universal header and footer
//             helpers.addUniversalTemplates(str,templateData,function(err,str){
//                 if(!err && str){
//                     // Return that page as HTMl
//                     callback(200,str,'html');
//                 }else{
//                     callback(500,undefined,'html');
//                 }
//             });
//         }else{
//             callback(500,undefined,'html');
//         }
//     });
// };

// Favicon
handlers.favicon = function(data,callback){
    // Reject any request isn't a GET
    if(data.method == 'get'){
        helpers.getStaticAsset('favicon.ico',function(err,data){
            if(!err && data){
                // Callback the data
                callback(200,data,'favicon');
            }else{
                callback(500);
            }
        });
    }else{
        callback(405);
    }
};

// Public asset
handlers.public = function(data, callback){
    // Reject any request that isn't a GET
    if(data.method == 'get'){
        // Get the filename being requested
        // console.log('trimed path je ' + data.trimedPath);
        var trimmedAssetName = data.trimedPath.replace('public/','').trim();
        // console.log('trimed asset je ' + trimmedAssetName);
        if(trimmedAssetName.length > 0){
            helpers.getStaticAsset(trimmedAssetName,function(err,data){
                if(!err && data){
                    // Determine the content type (default to plain text)
                    var contentType = 'plain';

                    if(trimmedAssetName.indexOf('.css') > -1){
                        contentType = 'css';
                    }
                    if(trimmedAssetName.indexOf('.png') > -1){
                        contentType = 'png';
                    }
                    if(trimmedAssetName.indexOf('.jpg') > -1){
                        contentType = 'jpg';
                    }
                    if(trimmedAssetName.indexOf('.ico') > -1){
                        contentType = 'favicon';
                    }

                    // Callbback the data
                    callback(200,data,contentType);
                }else{
                    callback(404);
                }
            });
        }else{
            callback(404);
        }
    }else{
        callback(405);
    }
};
  
/*
* JSON API Handlers
*
*/
// Users
handlers.users = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback('The metods is not allowed');
    }
};

// Container for users
handlers._users = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Option data: none
handlers._users.post = function (data, callback) {
    // Chack that all required fields are filled out
    var firstName = typeof(data.payloads.firstName) == 'string' && data.payloads.firstName.trim().length > 0 ? data.payloads.firstName.trim() : false;
    var lastName = typeof(data.payloads.lastName) == 'string' && data.payloads.lastName.trim().length > 0 ? data.payloads.lastName.trim() : false;
    var phone = typeof(data.payloads.phone) == 'string' && (data.payloads.phone.trim().length > 6 && data.payloads.phone.trim().length < 12)  ? data.payloads.phone.trim() : false;
    var password = typeof(data.payloads.password) == 'string' && data.payloads.password.trim().length > 7 ? data.payloads.password.trim() : false;
    var tosAgreement = typeof(data.payloads.tosAgreement) == 'boolean' && data.payloads.tosAgreement == true ? true : false;

    if(firstName && lastName && phone && password && tosAgreement){
        // Make shure that user with this phone not exist
        _data.read('users', phone, function(err, data){
            if(err){
                // Hash the password
                var hashedPassword = helpers.hash(password);

                // Create the user object
                if(hashedPassword){
                    var usrObject = {
                        firstName,
                        lastName,
                        phone,
                        hashedPassword,
                        'tosAgreement': true
                    };
    
                    // Store the user
                    _data.create('users', phone, usrObject, function(err){
                        if(!err){
                            callback(200);
                        }else{
                            console.log(err);
                            callback(500, {'Error': 'Could not create new user'});
                        }
                    });
                }else{
                    callback(500, {'Error': 'Could not create hash password for user'});
                }
            }else{
                callback(400, {'Error': 'A user with that phone number already exist'});
            }
        });
    }else{
        callback(400, {'Error' : 'Some fields are not fill.'});
    }
};

// Users - get
// Require data: phone
// Other data: none
handlers._users.get = function (data, callback) {
    // Chack that the phone number is valid
    var phone = typeof(data.queryStringObject.phone) == 'string' && (data.queryStringObject.phone.trim().length > 6 && data.queryStringObject.phone.trim().length < 12) ? data.queryStringObject.phone : false;
    if(phone){
        var tokenid = typeof(data.headers.tokenid) == 'string' && data.headers.tokenid.trim().length == 20 ? data.headers.tokenid : false;

        // Chack is it token valid
        handlers._tokens.verifyToken(tokenid, phone, function(tokenIsValid){
            if(tokenIsValid){
                // Lookup users
                _data.read('users', phone, function(err, data){
                    if(!err && data){
                        // Remove the hashed password from the users object before returning it to the request
                        delete data.hashedPassword;
                        callback(200, data);
                    }else{
                        callback(400, {'Error': 'Users with that phone not exist!'});
                    }
                });
            }else{
                callback(403, {'Error': 'Missing required token in header, or token is not valid'});
            }
        });
    }else{
        callback(400, {'Error': 'Missing required fields'});
    }
};

// Users - put
// Reguired data: phone
// Option data: firstName, lastName, password (at least one must be specified)
handlers._users.put = function (data, callback) {
    // Chack for the reguired field
    var phone = typeof(data.payloads.phone) == 'string' && (data.payloads.phone.trim().length > 6 && data.payloads.phone.trim().length < 12)  ? data.payloads.phone.trim() : false;
    
    // Chack for optional field
    var firstName = typeof(data.payloads.firstName) == 'string' && data.payloads.firstName.trim().length > 0 ? data.payloads.firstName.trim() : false;
    var lastName = typeof(data.payloads.lastName) == 'string' && data.payloads.lastName.trim().length > 0 ? data.payloads.lastName.trim() : false;
    var password = typeof(data.payloads.password) == 'string' && data.payloads.password.trim().length > 7 ? data.payloads.password.trim() : false;
    
    // Erro if phone is invalid
    if(phone){
        // chack one of option fields
        if(firstName || lastName || password){
            var tokenid = typeof(data.headers.tokenid) == 'string' && data.headers.tokenid.trim().length == 20 ? data.headers.tokenid : false;
            handlers._tokens.verifyToken(tokenid, phone, function(tokenIsValid){
                if(tokenIsValid){
                    // Lookup the users
                    _data.read('users', phone, function(err, usrData){
                        if(!err && usrData){
                            if(firstName){
                                usrData.firstName = firstName;
                            }
                            if(lastName){
                                usrData.lastName = lastName;
                            }
                            if(password){
                                usrData.hashedPassword = helpers.hash(password);
                            }
                            // Store the data 
                            _data.update('users', phone, usrData, function(err){
                                if(!err){
                                    callback(200);
                                }else{
                                    console.log(err);
                                    callback(400, {'Error': 'Error on updating users data'});
                                }
                            });
                        }else{
                            callback(400, {'Error': 'Could not read user data'});
                        }
                    });
                }else{
                    callback(403, {'Error': 'Missing required token in header, or token is not valid'});
                }
            });
        }else{
            callback(400, {'Error': 'Optional fields are not exist'});
        }
    }else{
        callback(400, {'Error' : 'Phone number is invalid'});
    }
    
};

// Users - delete
// Require data: phone
// @TODO: Clean (delete) any other data files associated with this user
handlers._users.delete = function(data, callback){
    var phone = typeof(data.queryStringObject.phone) == 'string' && (data.queryStringObject.phone.trim().length > 6 && data.queryStringObject.phone.trim().length < 12)  ? data.queryStringObject.phone.trim() : false;
   if(phone){
    var tokenid = typeof(data.headers.tokenid) == 'string' && data.headers.tokenid.trim().length == 20 ? data.headers.tokenid : false;
    handlers._tokens.verifyToken(tokenid, phone, function(tokenIsValid){
        if(tokenIsValid){
            _data.read('users', phone, function(err, usrData){
                if(!err && usrData){
                    _data.delete('users', phone, function(err){
                        if(!err){
                            // Delete each of the checks associated with the user
                            var userChecks = typeof(usrData.check) == 'object' && usrData.check instanceof Array ? usrData.check : [];
                            var checksToDelete = userChecks.length;
                                if(checksToDelete > 0){
                                var checksDeleted = 0;
                                var deletionErrors = false;
                                // Loop through the checks
                                userChecks.forEach(function(checkId){
                                    // Delete the check
                                    _data.delete('checks',checkId,function(err){
                                    if(err){
                                        deletionErrors = true;
                                    }
                                    checksDeleted++;
                                    if(checksDeleted == checksToDelete){
                                        if(!deletionErrors){
                                        callback(200);
                                        } else {
                                        callback(500,{'Error' : "Errors encountered while attempting to delete all of the user's checks. All checks may not have been deleted from the system successfully."});
                                        }
                                    }
                                    });
                                });
                                } else {
                                callback(200, {'Info': 'User is deleted'});
                                }
                        }else{
                            console.log(err);
                            callback(400, {'Error': 'Error deleting user'});
                        }
                    });
                }else{
                    callback(400, {'Error': 'Someting went wrong'});
                }
            });
        }else{
            callback(403, {'Error': 'Missing required token in header, or token is not valid'});
        }
    });
   }else{
       callback(400, {'Error': 'Please fill the phone number'});
   }
};

// Tokens
handlers.tokens = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback('The metods is not allowed');
    }
};

// Container for _tokens 
handlers._tokens = {};

// Tokens - post
// Required data: phone, password
// Option data: none
handlers._tokens.post = function (data, callback) {
    // Chack that all required fields are filled out
    var phone = typeof(data.payloads.phone) == 'string' && (data.payloads.phone.trim().length > 6 && data.payloads.phone.trim().length < 12)  ? data.payloads.phone.trim() : false;
    var password = typeof(data.payloads.password) == 'string' && data.payloads.password.trim().length > 7 ? data.payloads.password.trim() : false;

    if(phone && password){
        _data.read('users', phone, function(err, usrData){
            if(!err && usrData){
                var hashedPassword = helpers.hash(password);
                if(usrData.hashedPassword == hashedPassword){
                    var tokenid = helpers.createRandomString(20);
                    var dateExpire = Date.now() + 1000 * 60 * 60;
                    // Create the user object
                    var tokenData = {
                        phone,
                        tokenid,
                        dateExpire
                    };
                    // Store the token
                    _data.create('tokens', tokenid, tokenData, function(err){
                        if(!err){
                            callback(200, tokenData);
                        }else{
                            callback(400, {'Error': 'Error creating token'});
                        }
                    });
                }else{
                    callback(400, {'Error': 'Password not corect'});
                }
            }else{
                callback(400, {'Error': 'Can not read user data'});
            }
        });
    }else{
        callback(400, {'Error': 'Please fill all fields'});
    }
};

// Tokens - get
// Require data: tokenId
// Other data: none
handlers._tokens.get = function (data, callback) {
        // Chack that the tokenId number is valid
        var tokenid = typeof(data.queryStringObject.tokenid) == 'string' && data.queryStringObject.tokenid.trim().length == 20 ? data.queryStringObject.tokenid : false;
        if(tokenid){
            // Lookup token
            _data.read('tokens', tokenid, function(err, tokenData){
                if(!err && tokenData){
                    callback(200, tokenData);
                }else{
                    callback(400, {'Error': 'Token with that id not exist!'});
                }
            });
        }else{
            callback(400, {'Error': 'Missing required fields'});
        }
};

// Tokens - put
// Reguired data: id, extend
// Option data: none
handlers._tokens.put = function (data, callback) {
    var tokenid = typeof(data.payloads.tokenid) == 'string' && data.payloads.tokenid.trim().length == 20 ? data.payloads.tokenid.trim() : false;
    var extend = typeof(data.payloads.extend) == 'boolean' && data.payloads.extend == true ? true : false;
    if(tokenid && extend){
        // Lookup the token
        _data.read('tokens', tokenid, function(err,tokenData){
            if(!err && tokenData){
                // chack is it tokens expireda
                if(tokenData.dateExpire > Date.now()){
                    // Set expiration for one hour for now
                    tokenData.dateExpire = Date.now() + 1000 * 60 * 60;
                    // Store the new date
                    _data.update('tokens', tokenid, tokenData, function(err){
                        if(!err){
                            callback(200);
                        }else{
                            callback(500, {'Error': 'Can not update token expiration data'});
                        }
                    });
                }else{
                    callback(400, {'Error': 'The token has already expired, and can not by updated'});
                }
            }else{
                callback(500, {'Error': 'Specified token not exist'});
            }
        });
    }else{
        callback(400, {'Error': "Missing required field's or field's are invalid"});
    }
};
handlers._tokens.put = function(data,callback){
  var tokenid = typeof(data.payloads.tokenid) == 'string' && data.payloads.tokenid.trim().length == 20 ? data.payloads.tokenid.trim() : false;
  var extend = typeof(data.payloads.extend) == 'boolean' && data.payloads.extend == true ? true : false;
  if(tokenid && extend){
    // Lookup the existing token
    _data.read('tokens',tokenid,function(err,tokenData){
      if(!err && tokenData){
        // Check to make sure the token isn't already expired
        if(tokenData.dateExpire > Date.now()){
          // Set the expiration an hour from now
          tokenData.dateExpire = Date.now() + 1000 * 60 * 60;
          console.log(tokenData.dateExpire);
          // Store the new updates
          _data.update('tokens',tokenid,tokenData,function(err){
            if(!err){
              callback(200);
            } else {
              callback(500,{'Error' : 'Could not update the token\'s expiration.'});
            }
          });
        } else {
          callback(400,{"Error" : "The token has already expired, and cannot be extended."});
        }
      } else {
        callback(400,{'Error' : 'Specified user does not exist.'});
      }
    });
  } else {
    callback(400,{"Error": "Missing required field(s) or field(s) are invalid."});
  }
};

// Tokens - delete
// Require data: tokenid
// Option data: none
handlers._tokens.delete = function(data, callback){
    var tokenid = typeof(data.queryStringObject.tokenid) == 'string' && data.queryStringObject.tokenid.trim().length == 20 ? data.queryStringObject.tokenid.trim() : false;
    if(tokenid){
        // Lookup token
        _data.read('tokens', tokenid, function(err,tokenData){
            if(!err && tokenData){
                _data.delete('tokens', tokenid, function(err){
                    if(!err){
                        callback(200, {'info': 'Token is deleted'});
                    }else{
                        callback(400, {'Error': 'Error deleting token'});
                    }
                });
            }else{
                callback(400, {'Error': 'Specified token does not exist'});
            }
        });
    }else{
        callback(400, {'Error': "Missing required field's or field's are invalid"});
    }
};

// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function(tokenid, phone, callback){
    // Lookup the token
    _data.read('tokens', tokenid, function(err, tokenData){
        if(!err && tokenData){
            if(tokenData.dateExpire > Date.now() && tokenData.phone == phone){
                callback(true);
            }else{
                callback(false);
            }
        }else{
            callback(false);
        }
    });
};

// Checks
handlers.check = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._check[data.method](data, callback);
    } else {
        callback('The metods is not allowed');
    }
};

// Container for Check
handlers._check = {};

// Checks - post
// Required data: protocol, url, method, successCodes, timeoutSeconds
// Option data: none
handlers._check.post = function (data, callback) {
    var protocol = typeof(data.payloads.protocol) == 'string' && ['https','http'].indexOf(data.payloads.protocol) > -1 ? data.payloads.protocol.trim() : false;
    var url = typeof(data.payloads.url) == 'string' && data.payloads.url.trim().length > 0 ? data.payloads.url.trim() : false;
    var method = typeof(data.payloads.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payloads.method) > -1 ? data.payloads.method.trim() : false;
    var successCodes = typeof(data.payloads.successCodes) == 'object' && data.payloads.successCodes instanceof Array && data.payloads.successCodes.length > 0 ? data.payloads.successCodes : false;
    var timeoutSeconds = typeof(data.payloads.timeoutSeconds) == 'number' && data.payloads.timeoutSeconds % 1 === 0 && data.payloads.timeoutSeconds >= 1 && data.payloads.timeoutSeconds <= 5 ? data.payloads.timeoutSeconds : false;
  
    if(protocol && url && method && successCodes && timeoutSeconds){
        // Get token from headers
        var tokenid = typeof(data.headers.tokenid) == 'string' && data.headers.tokenid.trim().length == 20 ? data.headers.tokenid : false;
        
        if(tokenid){
            _data.read('tokens', tokenid, function(err, tokenData){
                if(!err && tokenData){
                    var userPhone = tokenData.phone;

                    // Lookup the user data
                    _data.read('users', userPhone, function(err, usrData){
                        if(!err && usrData){
                            var usrCheck = typeof(usrData.check) == 'object' && usrData.check instanceof Array ? usrData.check : [];
                            // Verify that user has less than the number of max-checks per user
                            if(usrCheck.length < config.maxCheck){
                                // Create random id for check
                                var checkId = helpers.createRandomString(20);

                                // Create check object including userPhone
                                var checkData = {
                                    'id': checkId,
                                    userPhone,
                                    protocol,
                                    url,
                                    method,
                                    successCodes,
                                    timeoutSeconds
                                };

                                // Save the object
                                _data.create('checks', checkId, checkData, function(err){
                                    if(!err){
                                        // Add check id to the user's object
                                        usrData.check = usrCheck;
                                        usrData.check.push(checkId);
                                        _data.update('users', userPhone, usrData, function(err){
                                            if(!err){
                                                 // Return the data about the new check
                                                 callback(200, checkData);
                                            }else{
                                                callback(500,{'Error' : 'Could not update the user with the new check.'});
                                            }
                                        });
                                    }else{
                                        callback(500,{'Error' : 'Could not create the new check'});
                                    }
                                });
                            }else{
                                callback(400,{'Error' : 'The user already has the maximum number of checks ('+config.maxChecks+').'});
                            }
                        }else{
                            callback(403);
                        }
                    });
                }else{
                    callback(403);
                }
            });
        } else{
            callback(403);
        }
    }else{
        callback(400,{'Error' : 'Missing required inputs, or inputs are invalid'});
    }
};

// Checks - get
// Required data: protocol, url, method, successCodes, timeoutSeconds
// Option data: none
handlers._check.get = function (data, callback) {
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id){
        _data.read('checks', id, function(err, checkData){
            if(!err && checkData){
                // get the token from header
                var tokenid = typeof(data.headers.tokenid) == 'string' && data.headers.tokenid.trim().length == 20 ? data.headers.tokenid : false;
                if(tokenid){
                    // Verify that the token is valid and belong to the user who created
                    handlers._tokens.verifyToken(tokenid, checkData.userPhone, function(isValid){
                        if(isValid){
                            // Return the check data
                            callback(200, checkData);
                        }else{
                            callback(403);
                        }
                    });
                }else{
                    callback(404);
                }
            }else{
                callback(404);
            }
        });
    }else{
        callback(404, {'Error': 'Mising required field'});
    }
};

// Checks - put
// Required data: id
// Option data: protocol, url, method, successCodes, timeoutSeconds 
handlers._check.put = function (data, callback) {
    // Chack for the reguired field
    var id = typeof(data.payloads.id) == 'string' && data.payloads.id.trim().length == 20 ? data.payloads.id.trim() : false;
    
    // Chack for optional field
    var protocol = typeof(data.payloads.protocol) == 'string' && ['https','http'].indexOf(data.payloads.protocol) > -1 ? data.payloads.protocol.trim() : false;
    var url = typeof(data.payloads.url) == 'string' && data.payloads.url.trim().length > 0 ? data.payloads.url.trim() : false;
    var method = typeof(data.payloads.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payloads.method) > -1 ? data.payloads.method.trim() : false;
    var successCodes = typeof(data.payloads.successCodes) == 'object' && data.payloads.successCodes instanceof Array && data.payloads.successCodes.length > 0 ? data.payloads.successCodes : false;
    var timeoutSeconds = typeof(data.payloads.timeoutSeconds) == 'number' && data.payloads.timeoutSeconds % 1 === 0 && data.payloads.timeoutSeconds >= 1 && data.payloads.timeoutSeconds <= 5 ? data.payloads.timeoutSeconds : false;
  
    if(id){
        // Chack to make sure ono or more optional fields has been sent
        if(protocol || url || method || successCodes || timeoutSeconds){
            // Lookup to checks
            _data.read('checks', id, function(err, checkData){
                if(!err && checkData){
                    // Get the token from headers
                    var tokenid = typeof(data.headers.tokenid) == 'string' && data.headers.tokenid.trim().length == 20 ? data.headers.tokenid : false;
                    handlers._tokens.verifyToken(tokenid, checkData.userPhone, function(isValid){
                        if(isValid){
                            if(protocol){
                                checkData.protocol = protocol;
                            }
                            if(url){
                                checkData.url = url;
                            }
                            if(method){
                                checkData.method = method;
                            }
                            if(successCodes){
                                checkData.successCodes = successCodes;
                            }
                            if(timeoutSeconds){
                                checkData.timeoutSeconds = timeoutSeconds;
                            }
                            _data.update('checks', id, checkData, function(err){
                                if(!err){
                                    callback(200, checkData);
                                }else{
                                    callback(500, {'Error': 'Could not update check'});
                                }
                            });
                        }else{
                            callback(400, {'Error': 'Token did not valid'});
                        }
                    });
                }else{
                    callback(400, {'Error': 'Check id did not exist'});
                }
            });
        }else{
            callback(400, {'Error': 'Missing fields to update'});
        }
    }else{
        callback(400, {'Error': 'Missing required fields'});
    }
};

// Checks - delete
// Required data: id, tokenid
// Option data: protocol, url, method, successCodes, timeoutSeconds 
handlers._check.delete = function (data, callback) {
    tokenid = typeof(data.headers.tokenid) == 'string' && data.headers.tokenid.trim().length == 20 ? data.headers.tokenid.trim() : false;
    id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;

    if(tokenid && id){
        _data.read('checks', id, function(err, checkData){
            if(!err && checkData){
                handlers._tokens.verifyToken(tokenid, checkData.userPhone, function(isValid){
                    if(isValid){
                        _data.delete('checks', id, function(err){
                            if(!err){
                                // Lookup the user's object to get all their checks
                                _data.read('users',checkData.userPhone,function(err, userData){
                                    if(!err){
                                        var userChecks = typeof(userData.check) == 'object' && userData.check instanceof Array ? userData.check : [];
                                        // Remove the deleted check from their list of checks
                                        var checkPosition = userChecks.indexOf(id);
                                        if(checkPosition > -1){
                                            userChecks.splice(checkPosition,1);
                                            // Re-save the user's data
                                            userData.check = userChecks;
                                            _data.update('users',checkData.userPhone,userData,function(err){
                                            if(!err){
                                                callback(200);
                                            } else {
                                                callback(500,{'Error' : 'Could not update the user.'});
                                            }
                                            });
                                        }else {
                                            callback(500,{"Error" : "Could not find the check on the user's object, so could not remove it."});
                                        }
                                    } else {
                                    callback(500,{"Error" : "Could not find the user who created the check, so could not remove the check from the list of checks on their user object."});
                                    }
                                });
                            }else{
                                callback(400, {'Error': 'Error deleting file'});
                            }
                        });
                    }else{
                        callback(403, {'Error': 'User not autorized'});
                    }
                });
            }else{
                callback(400, {'Error': 'file not exist'});
            }
        });
    }else{
        callback(400, {'Error': 'Missing required fields'});
    }
};

// sample handler
handlers.ping = function (data, callback) {
    callback(200);
};

// not found handler
handlers.notFound = function (data, callback) {
    callback(404);
};

// Export the module
module.exports = handlers;