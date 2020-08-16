let sharp = require('sharp'); //для обработки картинок



const backgroundPath = './background/background.png';  //путь до бэкграунда
const spaceBetweenLogos = 400 //умножить на 2, тк применяется к позиционированнию каждого логотипа
const exportPath = './final/fead.png';
const jumpImage = 70 //расстояние на которое приподнимутся логотипы

let createImage = function(teams,coefficents,callback) {

    //для редактирования картинок, необходимо создать объект sharp, который принимает в себя ссылку до картинки
    //в получившемся объекте запускаем нужные методы и через метод экспорта получаем нужную картинку
    //для простоты генерации этих объектов, все пути до картинок складываются в массив и в соотв. порядке генерируется массив объектов sharp
    

    console.log(`Get size of images...`);
    //проходим по объектам и методом metadata получаем размеры картинки;
    new Promise ((resolve,reject) => {
        console.log('Generating objects for images...');
        let paths = Array.prototype.concat(backgroundPath, teams, coefficents);
        console.log(`Create sharp objects...`);
        let images = [];
        for(let i in paths){
            images.push({sharp: sharp(paths[i]), path: paths[i]}); 
        }
        let promises = [];
        for (let i in images){
           let promise = new Promise ((resolve,reject) => {
               images[i].sharp.metadata().then(function(meta){
                    images[i].width = meta.width;
                    images[i].height = meta.height;
                    console.log(images[i]);
                    resolve();
               })
           })
           promises.push(promise);
        }
        Promise.all(promises).then((asdasd) => {resolve(images)});
    })
    .then(function(images){
        return new Promise ((resolve,reject) => {
            console.log(`Generate composition...`);
            let background_halfWidth = images[0].width / 2;
            let background_halfHeight = images[0].height / 2;
            let composition =  [{input: images[1].path, left: Math.floor((background_halfWidth - images[1].width / 2) - spaceBetweenLogos), top: Math.floor(background_halfHeight - images[1].height / 2 - jumpImage)},
                                {input: images[2].path, left: Math.floor((background_halfWidth - images[2].width / 2) + spaceBetweenLogos), top: Math.floor(background_halfHeight - images[2].height / 2 - jumpImage)},
                                {input: images[3].path, letft}]
            
            images[0].sharp.composite(composition).toFile(exportPath,callback(null,`OK`));               
        })
    })
  
}
let cb = (err,data) => {
    console.log(data);
}
function

createImage(['./logos/3c5745b91649d6f7352f65c3b4f109af.png','./logos/e3f06b7ac1fdff71b83f59c2902d6610.png'],['./coefficents/coeff0.png','./coefficents/coeff1.png','./coefficents/coeff2.png'], cb);
