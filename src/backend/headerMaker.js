let parsMatchPage = require('./parsMatchPage.js');
const icons = require('./icons.js');
const createImage = require('./createImage');
const makeCoeffImg = require('./makeCoeffImg');
const logosAvailableChecker = require('./logosAvailableChecker');
let fs = require('fs');

let matchData;
let expFunc = async function (req,res,linkToLine){
    await parsMatchPage(linkToLine)
    .then(data => {matchData = data; return logosAvailableChecker.checkArrayOfTeams([matchData.firstTeam, matchData.secondTeam])})
    .then(resultArr => {
        if (checkResultOfLogosAvailable(resultArr)) return makeCoeffImg(matchData.coefficents);
        else sendRequestAboutNeedForLogo(res,resultArr);
    })
    .then(result => {if (result) creatingImageAndSendImage(res)})
    .catch(err => console.log(err)); 
}

async function creatingImageAndSendImage(res){
    let path = await createImage(matchData);
    console.log(`Head suucesful writed by path ${path}`);
    sendImage(res);
}

function checkResultOfLogosAvailable(resultArr){
    if (resultArr.includes(false)){
        return false;
    }
    return true
}

function sendRequestAboutNeedForLogo(response,resultArr){
    console.log('send form for new logo to client');
    let formHTMLCode = creatingCodeOfForm(resultArr);
    response.status(200);
    response.set({'Content-Type' : 'text/html'});
    response.send(formHTMLCode);
    response.end();
    return false;
}

function creatingCodeOfForm (resultArr){
    console.log('Start generating code of form...');
    let captionText = "Загрузите логотипы для команд ";
    let inputsCode = '';

    if(!resultArr[0]){
        captionText = `${captionText} <span class="needLogoForm__teamName">${matchData.firstTeam}</span>`;
        inputsCode = inputsCode + addInputCode(matchData.firstTeam);
    }

    if(!resultArr[1]){
        captionText = `${captionText} <span class="needLogoForm__teamName">${matchData.secondTeam}</span>`;
        inputsCode = inputsCode + addInputCode(matchData.secondTeam);
    }

    let cpationCode = closeToTag(captionText, 'h2', 'class="needLogoForm__caption"');

    return finalConstructOfCode(cpationCode,inputsCode);
}

function finalConstructOfCode(captionCode, inputsCode){
    console.log('Final constructing code of form');
    let innerCode = `${captionCode} <div class="needLogoForm__inputsStack">${inputsCode}</div>`;
    return closeToTag(innerCode, 'form', 'class="needLogoForm" id="form-need-logo" method="POST" action="/sendLogo"');
} 

function closeToTag(innerCode, tag, properties){
    console.log(`Close code to tag ${tag}...`)
    let code = `<${tag} ${properties}>${innerCode}</${tag}>`;
    return code;
}

function addInputCode(nameOfteam) {
    console.log(`Generate input for ${nameOfteam}...`);
    let code = `<label class="needLogoForm__label">${nameOfteam}<input type="file" class="needLogoForm__input" name="${nameOfteam}"></label>`;
    code = closeToTag(code, 'div', 'class="needLogoForm__inputContainer"');
    return code;
}

async function sendImage(response){
    console.log('sending image to client...');
    let image = await new Promise((resolve, reject) => {
        fs.readFile('./final/head.png', (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    });
    response.status(200);
    response.set({'Content-Type' : 'image/png'});
    response.send(image);
    console.log('image succesful sent');
    response.end();
}

module.exports = expFunc;
                                                       

