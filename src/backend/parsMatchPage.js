const puppeteer = require('puppeteer');
//тут мы открываем страницу с матчем и парсим страницу, доставая названия и коэфиценты.

let exportFunc = async function(url,callback){
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
    await page.goto(url); 
    let matchData = await page.evaluate(() => {
            let teams = document.querySelector('span.info__text').textContent;
            let firstTeam = teams.substring(0,teams.indexOf(' -'));
            let secondTeam = teams.substring(teams.lastIndexOf('- ') + 2);
            let coeff = [];
            let spans = Array.from(document.querySelectorAll('button > .container > span'));
                for(let i = 0; i < 3; i++){
                    coeff.push(spans[i].textContent); 
                }
            return {'firstTeam': firstTeam,'secondTeam': secondTeam,'coeff':coeff}
        })
    console.log(`close browser...`);
    await browser.close();
    callback(null,matchData);
};

module.exports = exportFunc;
