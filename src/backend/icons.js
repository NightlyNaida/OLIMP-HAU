let fs = require('fs');
let pathsToImages = [];
(async function(teams){
  await fs.open('iconsPath.json', 'r', (err, fd) => {
    let images = [];
    if (err) throw new Error ('Ошибка чтения json файла');
    let isChanged = false;
    pathsToImages = JSON.parse(fd);
    for(i in teams){
      if(pathsToImages.keys().includes(teams[i])){
        images[i] = pathsToImages[teams[i]].pathToImage;
      }
      else{
        
      }
    }
  })

}()) 
