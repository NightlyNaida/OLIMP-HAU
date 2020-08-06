let sharp = require('sharp');

const backgroundPath = './background.png';  //путь до бэкграунда

let createImage = async function(teams,coefficents,callback) {
    let paths = Array.prototype.concat(backgroundPath, teams);
    let images = [];
    console.log(`Create sharp objects...`)
    for(let i in paths){
        images.push({image: sharp(paths[i]), path: paths[i]}); 
    }
    
    console.log(`Get size of background? logos and coefficents...`);
    let backCenter = await images[0].image.metadata().then(function(meta){return meta.width / 2});
    let firstLogoWidth = await images[1].image.metadata().then(function(meta){return meta.width});
    let secondLogoWidth = await images[2].image.metadata().then(function(meta){return meta.width});

    console.log(`Generate composition...`);
    let composition = [{input: images[1].path, left: Math.floor((backCenter - firstLogoWidth / 2) - 300), top: 100},
                       {input: images[2].path, left: Math.floor((backCenter - secondLogoWidth / 2) + 300), top: 100},
                       {input: images[3].path, left: Math.floor()}]
    await images[0].image.composite()
                   .toFile('back.jpg');
}

createImage(['./logos/ars.png','./logos/che.png']);


// background = sharp('./background.png');
// background.metadata().then(function(meta){
//     console.log(meta.height);
//     imageHeight = meta.height;
//     imageWidth = meta.width;
//     console.log(`Height: ${imageHeight}`);
//     console.log(`Width: ${imageWidth}`);
// });


// background
//     .composite([{ input: 'logo.png', left: 300, top: 200}])
//     .toFile('back.jpg', (err,info) => {
//         if(err) throw new Error (err);
//     })