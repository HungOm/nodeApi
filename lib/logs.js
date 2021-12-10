/**
 * 
 * A Library for storing and rotating logs
 * 
 */
//Dependencies
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
//container for module 
const lib = {};
//Based directory of the logs folder
lib.basedDir = path.join(__dirname, '/../.logs/');
//Append a string to a file. Create the file if it does not exist.
lib.append = function (file, str, callback) {
    fs.open(lib.basedDir + file + '.log', 'a', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
            fs.appendFile(fileDescriptor, str + '\n', function (err) {
                if (!err) {
                    fs.close(fileDescriptor, function (err) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error closing file that was being appended')
                        }
                    })
                } else {
                    callback("Error appending the file")
                }
            })
        } else {
            callback("Could not open the file");
        }
    })
};
// List all the logs and , optionally include the compressed logs 
lib.list = function (includeCompressLogs, callback) {
    fs.readdir(lib.basedDir, function (err, data) {
        if (!err && data && data.length > 0) {
            let trimmedFileNames = [];
            data.forEach(function (fileName) {
                //Add the .log file
                if (fileName.indexOf('.log') > -1) {
                    trimmedFileNames.push(fileName.replace('.log', ''));
                }
                //Add on the .gz file 
                if (fileName.indexOf('.gz.b64') > -1 && includeCompressLogs) {
                    trimmedFileNames.push(fileName.replace('.gz.b64', ''));
                }
            });
            callback(false, trimmedFileNames);
        } else {
            callback(err, data)
        }
    })
}
//Compress the content of one .log file into a .gz.b64 file in the same directory;
lib.compress = function (logId, newFileId, callback) {
    let sourceFile = logId + '.log';
    let targetFile = newFileId + '.gz.b64';
    //Read the source the file
    fs.readFile(lib.basedDir + sourceFile, 'utf8', function (err, inputString) {
        // console.log(inputString)
        if (!err && inputString) {
            // compress the data using gzip 
            zlib.gzip(inputString, function (err, buffer) {
                if (!err && buffer) {
                    //Send the data to the target file
                    fs.open(lib.basedDir + targetFile , 'wx', function (err, fileDescriptor) {
                        if (!err && fileDescriptor) {
                            //write to the target file
                            fs.writeFile(fileDescriptor, buffer.toString('base64'), function (err) {
                                if (!err) {
                                    //close the target file 
                                    fs.close(fileDescriptor, function (err) {
                                        if (!err) {
                                            callback(false);
                                        } else {
                                            callback(err)
                                        }
                                    });
                                } else {
                                    callback(err)
                                }
                            });
                        } else {
                            callback(err)
                        }
                    });
                } else {
                    callback(err)
                }
            });
        } else {
            callback(err)
        }
    }); 
}
//Decompress the content of a .gz.b64 file into a string variable
lib.decompress = function (fileId, callback) {
    let fileName = fileId + '.gz.b64';
    fs.readFile(lib.basedDir + fileName, 'utf8', function (err, str) {
        if (!err && str) {
            //Decompress data
            let inputBuffer = Buffer.from(str, 'base64');
            zlib.unzip(inputBuffer, function (err, outputBuffer) {
                if (!err && outputBuffer) {
                    //callback 
                    let str = outputBuffer.toString();
                    callback(false, str)
                } else {
                    callback(err)
                }
            });
        } else {
            callback(err)
        }
    })
}
//Truncate log file
lib.truncate = function (logId, callback) {
    fs.truncate(lib.basedDir + logId + '.log', 0, function (err) {
        if (!err) {
            callback(false);
        } else {
            callback(err)
        }
    })
}
//Export the module
module.exports = lib;
