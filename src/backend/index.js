let parsMatchPage = require('./parsMatchPage.js');
new Promise (function(resolve,reject){
    //получаем данные с сайта
    parsMatchPage('https://www.olimp.bet/live/1/6537877/59897726',(err,data) => {if (err) new Error(err); else resolve(data)}); 
}).then((matchData) => {
    
})


