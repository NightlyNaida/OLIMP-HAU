let parsMatchPage = require('./parsMatchPage.js');
let icons = require('./icons.js');
let createImage = require('./createImage');
let makeCoeffImg = require('./makeCoeffImg');

let matchData;
parsMatchPage('https://www.olimp.bet/line/1/88250/60037790').then(data => {matchData = data; console.log(matchData); return makeCoeffImg(matchData.coeff)})
                                                              .then(status => {console.log(status); return createImage({firstTeam:"Ливерпуль",secondTeam:'Арсенал'})})
                                                              .then(path => console.log(path))
                                                              .catch(err => console.log(err)); 

                                                              

