const { all } = require('async');
const puppeteer = require('puppeteer');
const user_agents = require('user-agents');
//тут мы открываем страницу с матчем и парсим страницу, доставая названия и коэфиценты.

let exportFunc = async function(url){
    console.log('start browser...');
    const browser = await puppeteer.launch();
    console.log('open page...');
    const page = await browser.newPage();
    //метод evaulate позволяет взаимодействовать с объектом страницы посредством jquery селекторов
    //на момент написания кода, названия команд отдавалось единой строчкой, отделяясь тире
    //эта строчка звернута в уникальный класс, соответсвенно, достаем эту строчку и разбиваем по командам, ориентеруясь на тире

    //на сайте отдается множество коэфицентов, у всех них одинаковая сигнатура вложенности, так что здесь ориентир на порядок.
    //первые три коэффицента - П1 Х П2 
    console.log('go to ' + url);
    await page.goto(url,{waitUntil: 'load', timeout: 7000}).catch(err => console.log(err)); 
    let allMatchData = await page.evaluate(() => {
            let teamsNames = Array.from(document.querySelectorAll('.name'));
            let coefficientsContainers = Array.from(document.querySelectorAll('button > .container'));
            let coefficents = {};
            for (let i = 0; i < coefficientsContainers.length; i++){
                let typeOfBetAndCoefficient = coefficientsContainers[i].innerText.split('\n');
                coefficents[typeOfBetAndCoefficient[0]] = typeOfBetAndCoefficient[1];
            }
            let finalObject = {'firstTeam': teamsNames[0].textContent,'secondTeam': teamsNames[1].textContent,'coefficents':coefficents};
            return finalObject;
        });
    await browser.close();
    return allMatchData;
};
module.exports = exportFunc;
