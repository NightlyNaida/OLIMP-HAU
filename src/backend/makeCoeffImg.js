let text2png = require('text2png');
let fs = require('fs');
const IMG_PATH = './coefficents/';
const FONT_PATH = './fonts/Intro-Black.otf';

let expFunc = async function (coefficents){
    if (coefficents instanceof Array){
        let promises = [];
        for(let i = 0; i < 3; i++){
            console.log(`delete coefficent image ${i}...`);
            await deleteFile(`${IMG_PATH}coeff${i}.png`).catch(err => console.log(err));
            console.log(`CREATE coefficent image ${i}...`);
            promises.push(createCoeffImg(coefficents[i], i));
        }
        await Promise.all(promises);
        return 'Coefficents successful created!';
    }
    else throw new Error(`Varible 'coeffcents' is not an Array`);
}

async function createCoeffImg (coeff,index){
    console.log(`Converting coefficent ${coeff} into png...`);
    let file = text2png(coeff,{color: 'black', font: '75px Intro-Black', localFontPath:FONT_PATH, localFontName:'Intro-Black'});
    console.log(`writing file...`);
    await writeFile(`${IMG_PATH}coeff${index}.png`,file);
    return true;
}

async function deleteFile(path){
    return new Promise ((resolve,reject) => {
        fs.unlink(path, (err) => {
            if (err) reject(err);
            resolve();
        })
    })
}

async function writeFile(path, file){
    fs.writeFile(path,file,(err) => {
        if (err) throw new Error(err);
        else console.log('file succesful writed!');
    });
}

module.exports = expFunc;