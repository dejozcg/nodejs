/**
 * Helperts for various tasks
 * 
 */

 // Dependencies
 var crypto = require('crypto');
 var config = require('./config');
 var https = require('https');
 var querystring = require('querystring');
 var path = require('path');
 var fs = require('fs');

// Container for all the helpers
var helpers = {};

// Create SHA256 hash
helpers.hash = function(str){
    if(typeof(str) == 'string' && str.length > 0){
        var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;
    }else{
        return false;
    }
};

// Take JSON string to an Object in all case, without throwing
helpers.parseJsonToObject = function(str){
    try{
        var obj = JSON.parse(str);
        return obj;
    }catch(e){
        return {};
    }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function(srtLength){
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if(srtLength){
        var possibleCharacters = 'abvgdeziklmnoprstufh1234567890';
        var str = '';
        for(i = 1; i <= srtLength; i++){
            var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            str += randomCharacter;
        }
        return str;
    }else{
        return false;
    }
};

helpers.sendTwilioSms = function(phone, msg, callback){
    // Validate parameters
    phone = typeof(phone) == 'string' ? phone.trim() : false;
    msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length < 1600 ? msg.trim() : false;
    if(phone && msg){
        // Configure the request payload
        var payload = {
            'From' : config.twilio.fromPhone,
            'To' : '+382'+phone,
            'Body' : msg
        };
        var stringPayload = querystring.stringify(payload);

        // Configure the request details
        var requestDetails = {
            'protocol' : 'https:',
            'hostname' : 'api.twilio.com',
            'method' : 'POST',
            //'path' : //'https://demo.twilio.com/welcome/sms/reply/', '/2010-04-01/Accounts/' +config.twilio.accountSid +'/Messages.json',
            'path' :  '/2010-04-01/Accounts/' +config.twilio.accountSid +'/Messages.json',
            'auth' : config.twilio.accountSid + ':' + config.twilio.authToken,
            'headers' : {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Content-Length' : Buffer.byteLength(stringPayload)
            }
        };

        
        // Instantiate the request object
        var req = https.request(requestDetails, function(res){
            // Grab the status of the sent request

            console.log(requestDetails);
            var status = res.statusCode;
            // Callback successfully if the request went through
            if(status == 200 || status == 201){
                callback(false);
            }else{
                callback('Status code return was ' + status);
            }
        });

        // Bind to the error event so it doesn't get thrown
        req.on('error',function(e){
            callback(e);
        });

        // Add the payload
        req.write(stringPayload);

        // End the request
        req.end();

    }else{
        callback('Given parameters were missing or invalid');
    }
};

const client = require('twilio')(config.twilio.accountSid, config.twilio.authToken);

helpers.sendTwilioSms1 = function(phone, msg, callback){
client.messages
  .create({
     body: msg,
     from: config.twilio.fromPhone,
     to: '+38267286676'
   })
  .then(message => console.log(message.sid));
};

// Get the string content of a template
helpers.getTemplate = function(templateNeme,data,callback){
    templateNeme = typeof(templateNeme) == 'string' && templateNeme.length > 0 ? templateNeme : false;
    data = typeof(data) == 'object' && data.length != null ? data : {};
    if(templateNeme){
        var templatesDir = path.join(__dirname,'/../templates/');
        fs.readFile(templatesDir + templateNeme + '.html', 'utf8', function(err,str){
            if(!err && str && str.length > 0){
                // Do interpolation on the string
                var finalString = helpers.interpolate(str,data);
                callback(false,finalString);
            }else{
                callback('No template could be find');
            }
        });
    }else{
        callback('A valid template name was not specified');
    }
};

// Add the universal header and footer to a string, and pass provided data object to header and footer for interpolation
helpers.addUniversalTemplates = function(str,data,callback){

    str = typeof(str) == 'string' && str.length > 0 ? str : '';
    data = typeof(data) == 'object' && data.length !== null ? data : {};

    // Get the header
    helpers.getTemplate('_header',data,function(err,headerString){
        if(!err && headerString){
            // Get the footer
            helpers.getTemplate('_footer',data,function(err,footerString){
                if(!err && footerString){
                    // Add them all together
                    var fullString = headerString + str + footerString;
                    callback(false, fullString);
                }else{
                    callback('Could not find the footer template');
                }
            });
        }else {
            callback('Could not find the header template');
        }
    });
};

// Take a given string and data object, and find/replace all the keys within it
helpers.interpolate = function(str,data){
    str = typeof(str) == 'string' && str.length > 0 ? str : '';
    data = typeof(data) == 'object' && data.length != null ? data : {};

    // Add the templateGlobals to the data object, prepending their key name with "global."
    for(var keyName in config.templateGlobals){
        if(config.templateGlobals.hasOwnProperty(keyName)){
            data['global.'+keyName] = config.templateGlobals[keyName];
        }
    }

    // For each key in the data object, insert its value into the string at the corresponding placeholder
    for(var key in data){
        if(data.hasOwnProperty(key) && typeof(data[key] == 'string')){
            var replace = keyName;
            var find = '{' + keyName +'}';
            str = str.replace(find,replace)
        }
    }

    return str;
};


// Expost module
module.exports = helpers;