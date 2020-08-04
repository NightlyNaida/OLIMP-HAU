let sharp = require('sharp');

sharp('./background.png')
    .composite([{ input: 'logo.png', gravity: 'southeast' }])
    .toFile('back.jpg', (err,info) => {
        if(err) throw new Error (err);
        
    })