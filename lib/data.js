var fs = require("fs");
var path = require("path");
const helpers = require("./helpers");

// container for the module to be exported
var lib = {};

//base directory of the data folder
lib.baseDir = path.join(__dirname, "/../.data/");

//write data to a file
lib.create = function (dir, file, data, callback) {
  //open  the file for writing
  fs.mkdir(lib.baseDir+dir,{ recursive: true },function(err){

    if(!err){

        fs.open(lib.baseDir+dir+"/"+ file+".json","wx",function (err, fd) {
            // console.log(err)
          if (!err && fd) {
            // convert data to string
            var stringData = JSON.stringify(data);
    
            // write to file and close it
            fs.writeFile(fd, stringData, function (err) {
              if (!err) {
                fs.close(fd, function (err) {
                  if (!err) {
                    callback(false);
                  } else {
                    callback("Error closing new file");
                  }
                });
              } else {
                callback("Error writing to new file ");
              }
            });
          } else {
            //   console.log(fd)
            callback("Could not create file, it may already exist",err);
          }
        } );

    }else{
        callback("Could not creat folder. It may already exist")
    }

 

  })

 
};

//read data from file 
lib.read = function(dir,file,callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',function(err,data){

      if(!err && data){
        var parseData = helpers.parseJsonToObject(data)
        callback(false,parseData)
      }else{
        callback(err,data)
      }

    })

}

// update data in side a file 
lib.update = function(dir,file,data,callback){
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fd){
        if(!err&&fd){

                // convert data to string
                var stringData = JSON.stringify(data);

                //update file by truncating file 

                fs.ftruncate(fd,function(err){
                    if(!err){
                        //Write to the file and close it
                        fs.writeFile(fd,stringData,function(err){
                            if(!err){

                                fs.close(fd,function(err){
                                    if(!err){
                                      callback(false);

                                    }else{
                                        callback("There was an error closing the file ")
                                    }
                                })

                            }else{
                                callback("Error writing to existing file")
                            }
                        })

                    }else{
                        callback("Error truncating file")
                    }
                })


        }else{
            callback("Could not open file for updating, It may not exist yet")
        }
    })

};


lib.delete = function (dir,file,callback){
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
        if(!err){

            callback(false)

        }else{
            callback('Error deleting file');
        }
    })
}

// export module
module.exports = lib;
