let fs = require('fs');
let path = require('path');

let getFiles = async function (dirPath,format) {
    let resultArr = [];

    await new Promise(function(resolve,reject){
        fs.readdir(dirPath, function (err, files) {
            if (err) reject(err);
            resolve(files);
        });
    })
    .then((files) => {
        for (let i = 0; i < files.length; i++){
            if(path.extname(files[i]) == '.' + format) resultArr.push(files[i]);
        }
    })
    return resultArr;
}

module.exports = getFiles;

