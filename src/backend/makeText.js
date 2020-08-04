let text2png = require('text2png');
let fs = require('fs');


fs.writeFileSync('coeff.png',text2png('3.53',{color: 'black', font: '75px Intro-Black', localFontPath:'./Intro-Black.otf', localFontName:'Intro-Black'}));