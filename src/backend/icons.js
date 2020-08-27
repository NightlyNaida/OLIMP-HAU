let fs = require('fs'); //модуль принимает в себя название команд, если логотип для команды имеется, возвращается true, в противном случае возвращается false

let expFunc = async function(teamArr){
  let promiseArr = [];
  for(let i = 0; i < 2; i++){
    promiseArr.push(checkTeam(teamArr[i]));
  }
  return Promise.all(promiseArr);
}

let checkTeam = async function(team){
  console.log('Opening JSON...');
  let iconsObj = await new Promise((resolve,reject) => {
    fs.readFile('./iconsPath.json', 'utf-8', (err, fd) => {
      if (err) reject(err);
      resolve(JSON.parse(fd));
    });
  })
  if (iconsObj.hasOwnProperty(team)) return true;
  else return false;
  ;
}

module.exports = expFunc;


