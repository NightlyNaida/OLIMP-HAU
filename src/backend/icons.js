let fs = require('fs');
let pathsToImages;
let teams = ['РБ Лейпциг','Интер М'];
console.log('Opening JSON...');
fs.readFile('./iconsPath.json', 'utf-8', (err, fd) => {
    let images = [];
    if (err) throw new Error ('Error of read JSON');
    console.log(fd);
    let isChanged = false;
    console.log('Convert JSON to Object...');
    pathsToImages = JSON.parse(fd);
    console.log(pathsToImages);
    for(i in teams){
      console.log('Search ' + teams[i] + ' in JSON...');
      if(Object.keys(pathsToImages).includes(teams[i])){
        console.log('Team is finded! Take the path of picture...');
        images[i] = pathsToImages[teams[i]];
      }
      else{
        console.log('Team is not finded! create path...');
      }
  }
  
console.log(images);
})

