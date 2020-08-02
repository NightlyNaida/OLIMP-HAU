const puppeteer = require('puppeteer');
 

(async () => {
    console.log('start browser...');
    const browser = await puppeteer.launch();
    console.log('open page...');
    const page = await browser.newPage();
    let url = 'https://www.olimp.bet/line/1/5927518/59104041';

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
                    // switch(containers[key].textContent){
                    //     case 'Победа первой':{coeff[0] = containers[key].querySelector('span').textContent};
                    //     case 'Ничья':{coeff[1] = containers[key].querySelector('span').textContent};
                    //     case 'Победа второй':{coeff[2] = containers[key].querySelector('span').textContent};
                    // }
            }
            return {'firstTeam': firstTeam,'secondTeam': secondTeam,'coeff':coeff}
        })

    await console.log(matchData);

    await browser.close();
})();
