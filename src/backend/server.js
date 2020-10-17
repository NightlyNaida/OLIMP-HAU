let http = require('http');
let fs = require('fs');
let express = require('express');
let app = express();
let headerMaker = require('./headerMaker');

const formidable = require('formidable');
const PORT = 3000;
CONST_PATH_TO_FRONT = '../frontend';


app.listen(PORT, () => console.log(`Server strat listening port ${PORT}`));

app.get('/',(req,res) => giveIndexPage(res));
app.get('/script.js', (req,res) => giveScript(res));
//app.get('/style.css', (req,res) => giveStyle(res));
app.post('/createImage', (req,res) => lauchHeaderMaker(req ,res));

async function lauchHeaderMaker(req,res){
  let form = await parseForm(req);
  await headerMaker(req, res, form.url);
}

async function parseForm (req){
  let formParser = formidable(); 
  let form = await new Promise ((resolve, reject) => {
    formParser.parse(req, (err, fields) => {
      if (err) reject(err);
      resolve(fields);
    })
  })
  return form;
}


function handleGET(req,res){
  switch(true){
    case /\//.test(req.url): giveIndexPage(res); break;
    case/\/script.js/.test(req.url): giveScript(res); break;
    case /\/createHead/.test(req.url): creatingHead(req,res); break;
    default: give404Page(res); break;
  }
}

function handlePOST(req,res){
  switch(res.url){
    default: {give404Page(res)}break;
  }
 
}

function giveIndexPage(res){
  let page = fs.readFileSync(`${CONST_PATH_TO_FRONT}/index.html`,'utf-8');
  res.status(200);
  res.set({'Content-Type' : 'text/html'});
  res.send(page);
  res.end();
}

async function giveStyle(res){
  let css = await 
  res.status(200);
  
}

function give404Page(res){
  res.writeHead(404,{'Content-Type': 'text/plain'});
  res.end('404 Not Found');
}

async function giveScript(res){
  let script =  await new Promise((resolve,reject) => {fs.readFile(`${CONST_PATH_TO_FRONT}/script.js`,'utf-8', (err, data) => resolve(data))});
  res.writeHead(200,{'Content-Type' : 'application/javascript'});
  res.end(script);
}

async function giveFile(path){
  let file = await new Promise ((resolve,reject) => {
    fs.readFile(path,(err,data) => {
      if(err){reject(err)}
      resolve(err);
    })
  }).catch(err => {throw new Error(err)});
  return file;
}

// const form = formidable({ multiples: true });
//   form.parse(req, (err,fields,files) => {
//     console.log(files.image.path);
//     oldPath = `${files.image.path}`;
//     newPath = './logos/newLogo.png';
//     fs.copyFile(oldPath,newPath,(err) => {
//       if (err) {
//         console.log(err);
//         res.writeHead(400, {'Content-Type': 'text/plain'});
//         res.end('err');
//         return; 
//       }

//       res.writeHead(200, {'Content-Type': 'text/plain'});
//       res.end('OK');
//     })
//   })