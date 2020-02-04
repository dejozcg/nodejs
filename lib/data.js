/**
 * This file is libraby for storing and editing the data
 * 
 */

 // Dependencies
 var fs = require('fs');
 var path = require('path');
 var helpers = require('./helpers');

 // Container for the module
 var lib = {};

 // Base directory of the data folder
 lib.baseDir = path.join(__dirname, '/../.data/');

 // Writa data to a file
 lib.create = function(dir, file, data, callback){
    // Open th file for writing
    fs.open(lib.baseDir +dir +'/' +file +'.json', 'wx', function(err,fileDescriptor){
        if(!err && fileDescriptor){
            // Convert data to string
            var stringData = JSON.stringify(data);

            // Writing to file and close it
            fs.writeFile(fileDescriptor, stringData, function(err){
                if(!err){
                    fs.close(fileDescriptor, function(err){
                        if(!err){
                            callback(false);
                        }else{
                            callback('Error closing new file');
                        }
                    });
                }else{
                    callback('Error writing to new file');
                }
            });
        }else{
            callback('Could not create new file, it may already exist');
        }
    });
 };

 // Read data from file
 lib.read = function(dir, file, callback){
     fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', function(err, data){
         if(!err){
             var parsedData = helpers.parseJsonToObject(data);
             callback(false, parsedData);
         }else{
             callback(err,data);
         }
     });
 };

 // Udate data inside a file
 lib.update = function(dir, file, data, callback){
    // OPne the file for updating
    fs.open(lib.baseDir +dir + '/' +file +'.json', 'r+', function(err, fileDescriptor){
        if(!err && fileDescriptor){
            // Convert data to a string
            var stringData = JSON.stringify(data);

            // Truncate the file
            fs.ftruncate(fileDescriptor, function(err){
                if(!err){
                    // Write the file and close it
                    fs.writeFile(fileDescriptor, stringData, function(err){
                        if(!err){
                            // Close the file
                            fs.close(fileDescriptor,function(err){
                                if(!err){
                                    callback(false);
                                }else{
                                    callback('Error closing existing file');
                                }
                            });
                        }else{
                            callback('Error writing in existing file');
                        }
                    });
                }else{
                    callback('Error truncate the file');
                }
            });
        }else{
            callback('Error opening the file. It may not exist');
        }
    });
 };

 // Delete a file
 lib.delete = function(dir, file, callback){
    // Unlink the file
    fs.unlink(lib.baseDir + dir + '/' +file + '.json', function(err){
        if(!err){
            callback(false);
        }else{
            callback('Could not delete a file. It may not exist.');
        }
    });
 };

 // Export the module
 module.exports = lib;