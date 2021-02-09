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
    await page.goto(url).catch(err => console.log(err)); 
    await page.waitFor('.outcome-item');
    let matchData = await page.evaluate(() => {
            let teamsNames = Array.from(document.querySelectorAll('.name'));
            let spans = Array.from(document.querySelectorAll('button > .container > span'));
            let coefficients = [];
            let finalObject = {'firstTeam': teamsNames[0].textContent,'secondTeam': teamsNames[1].textContent,'coefficents':coefficients,'images':undefined};
            return finalObject;
        })
        .catch(err => {
            console.error(err);
        });
    console.log(matchData);
    console.log(`close browser...`);
    await browser.close();
    return matchData;

    function parseCoefficents(array){
        let coefficients = [];
        for(let i = 0; i < 3; i++){
            array.push(spans[i].textContent); 
        }
        
        return coefficients;
    }
};



module.exports = exportFunc;
