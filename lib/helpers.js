/**
 * Helperts for various tasks
 * 
 */

 // Dependencies
 var crypto = require('crypto');
 var config = require('./config');
 var https = require('https');
 var querystring = require('querystring');

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
     body: 'Text poruke!',
     from: '+15088024281',
     to: '+38267286676'
   }).catch((err) =>{
    console.log('found error', err)})
  .then(message => console.log(message.sid)).then(message => console.log(message.error));
};

 // Expost module
 module.exports = helpers;