let parsMatchPage = require('./parsMatchPage.js');
let icons = require('./icons.js');

let matchData;
parsMatchPage('https://www.olimp.bet/line/1/2430428/59915483').then(data => {matchData = data; console.log(matchData); return icons([matchData.firstTeam,matchData.secondTeam])})
                                                              .then(checkResult => {console.log(checkResult)}); 



