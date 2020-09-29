let sharp = require('sharp'); //для обработки картинок
let getFiles = require('./getFiles'); //модуль для загрузки файлов
let iconPath = require('./iconsPath.json'); //список, хранящий пути до логотипов команд


const backgroundPath = './background/background.png';  //путь до бэкграунда
const spaceBetweenLogos = 400 //умножить на 2, тк применяется к позиционированнию каждого логотипа
const exportPath = './final/head.png';
const marginImageY = -70 //расстояние на которое приподнимутся логотипы
const marginCoeffY = 100 //расстояние на которое приподнимутся коэффиценты
const logosPath = './logos/';

let images = [];

let expFunc = async function(matchObj){
    console.log('take coefficents from temp path...');
    let coefficents = (await getFiles('./coefficents','png')).map(path => {return './coefficents/' + path});
    let imagesPaths = [].concat(backgroundPath,logosPath + iconPath[matchObj.firstTeam],logosPath + iconPath[matchObj.secondTeam],coefficents);
    let promises = [];
    for(let i = 0; i < imagesPaths.length; i++){
        console.log(`create sharp object for ${imagesPaths[i]}`);
        images.push({sharp: sharp(imagesPaths[i]), path: imagesPaths[i]}); 
        promises.push(images[i].sharp.metadata());
    }
    await Promise.all(promises).then(arr => {
        for(let i = 0; i < arr.length; i++){
            images[i].width = arr[i].width;
            images[i].height = arr[i].height;
        }
    })

    return await createComposition(); 
}

async function createComposition(){
    console.log(`Generate composition...`);
    let background_halfWidth = images[0].width / 2; 
    let background_halfHeight = images[0].height / 2;
    let composition =  [{input: images[1].path, left: Math.floor((background_halfWidth - images[1].width / 2) - spaceBetweenLogos), top: Math.floor(background_halfHeight - images[1].height / 2 + marginImageY)},
                        {input: images[2].path, left: Math.floor((background_halfWidth - images[2].width / 2) + spaceBetweenLogos), top: Math.floor(background_halfHeight - images[2].height / 2 + marginImageY)},
                        {input: images[3].path, left: Math.floor((background_halfWidth - images[3].width / 2) - spaceBetweenLogos), top: Math.floor(background_halfHeight + images[3].height / 2 + marginCoeffY)},
                        {input: images[4].path, left: Math.floor((background_halfWidth - images[4].width / 2)), top: Math.floor(background_halfHeight + images[4].height / 2 + marginCoeffY)},
                        {input: images[5].path, left: Math.floor((background_halfWidth - images[5].width / 2) + spaceBetweenLogos), top: Math.floor(background_halfHeight + images[5].height / 2 + marginCoeffY)}]            
    await images[0].sharp.composite(composition).toFile(exportPath);
    return exportPath;  
}

// let createImage = function(teams,coefficents,callback) {

//     //для редактирования картинок, необходимо создать объект sharp, который принимает в себя ссылку до картинки
//     //в получившемся объекте запускаем нужные методы редоктирования исходной картинки, а затем через метод экспорта получаем нужную картинку
//     //для простоты генерации этих объектов, все пути до картинок складываются в массив и в соотв. порядке генерируется массив объектов sharp
    
//     //проходим по объектам и методом metadata получаем размеры картинки;
//     new Promise ((resolve,reject) => {
//         console.log('Generating objects for images...');
//         console.log(`Create sharp objects...`);romises = [];
//         for (let i in images){
//            let promise = new Promise ((resolve,reject) => {
//                images[i].sharp.metadata().then(function(meta){
//                     images[i].width = meta.width;
//                     images[i].height = meta.height;
//                     console.log(images[i]);
//                     resolve();
//                })
//            })
//            promises.push(promise);
//         }
//         Promise.all(promises).then((asdasd) => {resolve(images)});
//     })
//     .then(function(images){
             
//         })
//     })
  
// }

module.exports = expFunc;