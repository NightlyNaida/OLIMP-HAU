let parsMatchPage = require('./parsMatchPage.js');
new Promise (function(resolve,reject){
    let matchData = parsMatchPage('https://www.olimp.bet/line/1/5927518/59104041',(err,data) => {if (err) new Error(err); else resolve(data)}); 
}).then((matchData) => {console.log(matchData);})


