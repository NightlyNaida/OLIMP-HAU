//модуль занимается обработкой новых изображений, прилетевших от клиента
//прилетевшие картинки грузятся в папку временного хранения другим модулем
//этот же модуль подводит их к нужному размеру

let fs = require('fs');
let sharp = require('sharp');
var path = require('path');


let expFunc = async function(callback){
    //записываем стек изображений в папку tempImg, предварительно её очистив
    let paths;
    console.log('get iamges files from ./tempIMG...');
    await getFiles('./tempIMG/',(err, files) => {
        if (err) callback(new Error(err));
        paths = files;
        console.log(`${paths}`);
    })
    let images = [];
    for (let i in paths){
        images.push({sharp: sharp(paths[i])});
        images[i].width = images[i].sharp.metadata().then(function(meta){meta.width});
        images[i].height = images[i].sharp.metadata().then(function(meta){meta.height});
    }

    callback(null, images);
}

 async function getFiles (dirPath) {
    let resultArr = [];
    let promise = new Promise(function(resolve,reject){
        fs.readdir(dirPath, function (err, files) {
            if (err) reject(err);
            resolve(files);
        });
    })
    let files = await promise;
    for (let i in files){
        if(path.extname(files[i])=='.png') resultArr.push(files[i]);
    }

    return resultArr;
}

getFiles('./tempIMG/').then(function(data){console.log(data)});