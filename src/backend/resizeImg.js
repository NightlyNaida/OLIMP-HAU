//модуль занимается обработкой новых изображений, прилетевших от клиента
//прилетевшие картинки грузятся в папку временного хранения другим модулем
//этот же модуль подводит их к нужному размеру


let sharp = require('sharp');
let path = require('path');
const TEMP_FOLDER = './tempIMG' //папка, куда складываются логотипы, полученные от клиента


let expFunc = async function(callback){
    //записываем стек изображений в папку tempImg, предварительно её очистив
    console.log(`get iamges files from ${TEMP_FOLDER}`);
    let promise = new Promise(function(resolve, reject){
        let paths
        resolve(getFiles(TEMP_FOLDER));
    })
    promise.then(function(paths){
        console.log(`Finded files: ~${paths}`);
        let promises = [];
        console.log(`Generating image objects...`);
        for(let i in paths){
            promises.push(new Promise(function(resolve,reject){
                let image = {};
                image.sharp = sharp(TEMP_FOLDER + '/' + paths[i]);
                image.sharp.metadata().then(function(meta){image.width = meta.width;
                                                           image.height = meta.height;
                                                           image.name = path.basename(paths[i]);
                                                           resolve(image);});
            }));
        }
        return Promise.all(promises);
    })
    .then(
        images => {
            console.log(`Objects are generated: ${images}`);
            console.log(`Correcting images size...`);
            let promises = [];
            for(i in images){
                promises.push(
                    new Promise(function(resolve,reject){
                        images[i].sharp.resize({width: 300}).toFile('logos/' + images[i].name, (err,info) => {
                            if(err) throw new Error(err);
                            resolve(info);
                        })
                    })
                )
            }
            return Promise.all(promises);
        }
    )
    .then(function(data){console.log(`Images are writed succesful: ${data}`)});


    // for(let i in images){
    //     if(images[i].width > images[i].height){
    //         images[i].sharp.resize({width:300}).toFile('./logos/' + images[i].name);
    //     }
    //     else if (images.width < images.height){
    //         images[i].sharp.resize({height:350}).toFile('./logos' + images[i].name)
    //     }
    // }
}


expFunc();