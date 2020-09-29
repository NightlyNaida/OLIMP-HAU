//модуль предоставляет методы для проверки наличия логотипа в базе (iconsPath.json)

const pathsToIcons = require('./iconsPath.json');

module.exports = {
    checkArrayOfTeams: async function(teamsArr){
        console.log('check avaliable logos for teams...')
        if (teamsArr instanceof Array){
            let resultArr = [];
            for(let i = 0; i < teamsArr.length; i++){
                console.log(`check ${teamsArr[i]}`);
                resultArr.push(pathsToIcons.hasOwnProperty(teamsArr[i]))
            }
            console.log(`Result:`,resultArr);
            return resultArr;
        }
        else{
            throw new Error('The variable teamsArr is not Array');
        }
    },
    checkOneTeam: async function(team){
        return pathsToIcons.hasOwnProperty(team);
    }
}