//модуль отвечает за непосредственное создание картинки, возвращает путь до сгенерированного файла

let sharp = require('sharp'); //для обработки картинок
let iconPath = require('./iconsPath.json'); //список, хранящий пути до логотипов команд
let headConst = require('./headConst.js'); //параметры размещения объектов в шапке
let text2png = require('text2png');
const { head } = require('needle');



const BACKGROUND_PATH = './background/background.png';  //путь до бэкграунда//умножить на 2, тк применяется к позиционированнию каждого логотипа
const EXPORT_PATH = './finalHead/head.png';
const LOGO_PATH = './logos/';
const FONT_PATH = './fonts/Intro-Black.otf';


let expFunc = async function(matchObj){
    console.log('create image file');
    console.log('match object',matchObj);

    let firstTeamParam = iconPath[matchObj.firstTeam]; //получаем параметры логотипов команд
    let secondTeamParam = iconPath[matchObj.secondTeam];
    
    //далле создаем sharp объекты c каждой составной частью изображения.
    //в пару sharp'у создаем результат функции sharp, чтобы иметь быстрый и удобный доступ к раpмерам составных частей
    //размеры логотипов заранее прописаны файле параметров, поэтому для логотипа, мы не вызываем метод metadata, а просто дергаем параметры из JSON файла
    
    let background = {
        sharp: sharp(BACKGROUND_PATH),
    }
    background.meta = await background.sharp.metadata();

    let firstTeamImage = sharp(LOGO_PATH + firstTeamParam.name);
    let secondTeamImage = sharp(LOGO_PATH + secondTeamParam.name);

    let winOfFirst = {sharp: sharp(generateImageOfCoefficent(matchObj.coefficents['Победа первой']))};
    winOfFirst.meta = await winOfFirst.sharp.metadata();

    let draw = {sharp: sharp(generateImageOfCoefficent(matchObj.coefficents[`Ничья`]))};
    draw.meta = await draw.sharp.metadata();

    let winOfSecond= {sharp: sharp(generateImageOfCoefficent(matchObj.coefficents['Победа второй']))};
    winOfSecond.meta = await winOfSecond.sharp.metadata();
       console.log(`Generate composition...`);

    //тут составляем массив из объектов, чтобы скормить его методу composite
    let composition =  [{   input: await firstTeamImage.resize({width: firstTeamParam.width, height: firstTeamParam.height}).toBuffer(), 
                            left: Math.floor(background.meta.width / 2 - headConst.logoDistanceFromCenterX - firstTeamParam.width / 2),
                            top: Math.floor(background.meta.height / 2 - firstTeamParam.height / 2 + headConst.logoDistanceFromCenterY)},
                        {   input: await secondTeamImage.resize({width: secondTeamParam.width, height: secondTeamParam.height}).toBuffer(), 
                            left: Math.floor(background.meta.width / 2 + headConst.logoDistanceFromCenterX - secondTeamParam.width / 2),
                            top: Math.floor(background.meta.height / 2 - secondTeamParam.height / 2 + headConst.logoDistanceFromCenterY)},
                        {   input: await winOfFirst.sharp.toBuffer(), 
                            left: Math.floor(background.meta.width / 2 - winOfFirst.meta.width / 2) - headConst.logoDistanceFromCenterX, 
                            top: Math.floor(background.meta.height / 2 +  winOfFirst.meta.height / 2) + headConst.coefficientDistanceFromCenterY},
                        {   input: await draw.sharp.toBuffer(), 
                            left: Math.floor(background.meta.width / 2 - draw.meta.width / 2), 
                            top: Math.floor(background.meta.height / 2 + draw.meta.height / 2) + headConst.coefficientDistanceFromCenterY},
                        {   input: await winOfSecond.sharp.toBuffer(), 
                            left: Math.floor(background.meta.width / 2 - winOfSecond.meta.width / 2) + headConst.logoDistanceFromCenterX, 
                            top: Math.floor(background.meta.height / 2 + winOfSecond.meta.height / 2) + headConst.coefficientDistanceFromCenterY}];

    console.log(composition);
    return await background.sharp.composite(composition).png().toBuffer(); //вызываем метод у картинки бэкграунда, т.к. метод накладывает составные части поверх картинки, на которой он вызывается
}


//конвертируем текст в картинку
function generateImageOfCoefficent(coeff){
    return text2png(coeff.toString(),{color: 'black', font: '75px Intro-Black', localFontPath:FONT_PATH, localFontName:'Intro-Black'});
}

module.exports = expFunc;