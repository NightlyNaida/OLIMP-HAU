let workWithFiles = require('./workWithFiles.js');
let logos = require('./iconsPath.json');

const PATH_TO_WRITE_ICON = './logos/';
const PATH_TO_WRITE_JSON = './iconsPath.json';

module.exports = async (form) => {
    console.log('copy file from temp path...');
    await workWithFiles.copyFile(form.files.imageFile.path, `${PATH_TO_WRITE_ICON + form.files.imageFile.name}`).catch(err => {throw new Error(err)});
    console.log('create write in Object...');
    logos[form.fields.nameOfTeam] = {
        name: `${form.files.imageFile.name}`,
        width: parseInt(form.fields.width),
        height: parseInt(form.fields.height)
    }
    console.log('write JSON File...');
    await workWithFiles.writeFile(PATH_TO_WRITE_JSON,JSON.stringify(logos)).catch(err => {throw new Error(err)});
    return true;
}   