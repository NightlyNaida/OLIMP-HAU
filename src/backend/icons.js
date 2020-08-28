let fs = require('fs'); //модуль принимает в себя название команд, если логотип для команды имеется, возвращается true, в противном случае возвращается false

let expFunc = async function(teamArr){
  let promiseArr = [];
  promiseArr.push(checkTeam('firstTeam',teamArr[0]),checkTeam('firstTeam',teamArr[1]));
  return Promise.all(promiseArr);
}

let checkTeam = async function(nameField,team){
  console.log('Opening JSON...'); //открываем JSON, где хранятся настройки и путь до картинок
  let iconsObj = await new Promise((resolve,reject) => {
    fs.readFile('./iconsPath.json', 'utf-8', (err, fd) => {
      if (err) reject(err);
      resolve(JSON.parse(fd));
    });
  })
  let objForReturn = {};
  if (iconsObj.hasOwnProperty(team)) objForReturn[nameField] = true; //проверяем наличие логотипа
  else objForReturn[nameField] = false; 
  
  return objForReturn
}

module.exports = expFunc;


