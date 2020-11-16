//модуль предоставляет методы для проверки наличия логотипа в базе (iconsPath.json)

const pathsToIcons = require('./iconsPath.json');

module.exports = {
    checkArrayOfTeams: async function(teamsArr){
        console.log('check avaliable logos for teams...')
        if (teamsArr instanceof Array){//сначала берем название команды и ищем аналогичный ключ в файле параметров логотипов
            let result = {
                details: {},
                //здесь хранится пара ключ(название команды) - значение(загружен ли логотип)
                globalResult: true, //с этим значеним постоянно складываем результат проверки, который выше. При отсутствии логотипа, эта переменная выпадет в fаlse и сервер сразу узнает о том, что нужно запросить лого 
            };
            for(let i = 0; i < teamsArr.length; i++){
                console.log(`check ${teamsArr[i]}`);
                result.details[teamsArr[i]] = pathsToIcons.hasOwnProperty(teamsArr[i]);
                result.globalResult = result.globalResult && result.details[teamsArr[i]];
            }
            return result;
        }
        else{
            throw new Error('The variable teamsArr is not Array');
        }
    },
    checkOneTeam: async function(team){
        return pathsToIcons.hasOwnProperty(team);
    }
}