let text2png = require('text2png');
let fs = require('fs');
const FONT_PATH = './fonts/Intro-Black.otf';

let expFunc = async function (coefficents , callback){
    if (coefficents instanceof Array){
        let promises = [];
        for(let i = 0; i < 3; i++){
            ы
        }
    }
    else throw new Error(`Varible 'coeffcents' is not an Array`);
}

async function createCoeffImg (coeff,index){
    let file = text2png(coefficents[i],{color: 'black', font: '75px Intro-Black', localFontPath:FONT_PATH, localFontName:'Intro-Black'});
    fs.writeFile(`./coefficents/coeff${index}.png`,file,(err) => {
        if (err) throw new Error(err);
        progressOfWork.push('0');
        if (progressOfWork.length == coefficents.length) callback();

}

async function clearPath(path){
    fs
}

module.exports = expFunc;