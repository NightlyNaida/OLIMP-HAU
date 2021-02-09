const { reject } = require('async');
let fs = require('fs');
const { resolve } = require('path');
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

async function readFile(path){
    let file = await new Promise ((resolve,reject) => {
      fs.readFile(path,(err,data) => {
        if(err){reject(err)}
        resolve(data);
      })
    }).catch(err => {throw new Error(err)});
    return file;
}

async function copyFile(pathToRead,pathToWrite){
    await new Promise((resolve, reject) => {
        fs.copyFile(pathToRead, pathToWrite, (err) => {
            if (err) {reject(err)}
            resolve('Succesful copy');
        })
    })
}

async function writeFile (pathToWrite,data){
    return await new Promise((resolve,reject) => {
        fs.writeFile(pathToWrite,data,(err) => {
            if (err) reject(err);
            console.log(`file writed to path ${pathToWrite}`);
            resolve();
        })
    })
}



module.exports = {readFile: readFile, getFiles: getFiles, copyFile: copyFile, writeFile: writeFile};

