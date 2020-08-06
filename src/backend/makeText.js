let text2png = require('text2png');
let fs = require('fs');

let expFunc = async function (coefficents , callback){
    if (coefficents instanceof Array){
        let progressOfWork = [];
        for (let i in coefficents){
            let file = text2png(coefficents[i],{color: 'black', font: '75px Intro-Black', localFontPath:'./Intro-Black.otf', localFontName:'Intro-Black'});
            fs.writeFile(`./coefficents/coeff${i}.png`,file,(err) => {
                if (err) throw new Error(err);
                progressOfWork.push('0');
                if (progressOfWork.length == coefficents.length) callback();
            });
        }
    }
}

module.exports = expFunc;