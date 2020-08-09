//модуль занимается обработкой новых изображений, прилетевших от клиента
//прилетевшие картинки грузятся в папку временного хранения другим модулем
//этот же модуль подводит их к нужному размеру

let fs = require('fs');
let sharp = require('sharp');
var path = require('path');


let expFunc = async function(callback){
    //записываем стек изображений в папку tempImg, предварительно её очистив
    console.log('get iamges files from ./tempIMG...');
    let paths = await getFiles('./tempIMG/');
    console.log(`Finded files: ${paths}`);
    console.log(`Generate images objects...`);
    let images = [];
    for (let i in paths){
        images.push({sharp: sharp(paths[i])});
        images[i].width = images[i].sharp.metadata().then(function(meta){meta.width});
        images[i].height = images[i].sharp.metadata().then(function(meta){meta.height});
        images[i].name = path.basename(path[i]);
    }
    console.log(`Generated objects ${images}`);
    console.log(`Correcting images size...`);
    for(let i in images){
        if(images[i].width > images[i].height){
            images[i].sharp.resize({width:300}).toFile('./logos/' + images[i].name);
        }
        else if (images.width < images.height){
            images[i].sharp.resize({height:350}).toFile('./logos' + images[i].name)
        }
    }
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

expFunc();