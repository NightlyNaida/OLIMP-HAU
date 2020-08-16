let fs = require('fs');
let path = require('path');

let getFiles = async function (dirPath,format,callback) {
    new Promise(function(resolve,reject){
        fs.readdir(dirPath, function (err, files) {
            if (err) reject(err);
            resolve(files);
        });
    })
    .then((files) => {
        let resultArr = [];
        for (let i in files){
            if(path.extname(files[i])=='.' + format) resultArr.push(files[i]);
        }
        callback(null,resultArr);
    })
}

module.exports = getFiles;