let http = require('http');
let fs = require('fs');
let express = require('express');
let app = express();
let headerMaker = require('./headerMaker');

const formidable = require('formidable');


app.listen(3030, () => console.log('Server strat listening port 3030'));

app.get('/',(req,res) => giveIndexPage(res));
app.get('/script.js', (req,res) => giveScript(res));
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
  let page = fs.readFileSync('../../build/index.html','utf-8');
  res.status(200);
  res.set({'Content-Type' : 'text/html'});
  res.send(page);
  res.end();
}

function give404Page(res){
  res.writeHead(404,{'Content-Type': 'text/plain'});
  res.end('404 Not Found');
}

async function giveScript(res){
  let script =  await new Promise((resolve,reject) => {fs.readFile('../../build/script.js','utf-8', (err, data) => resolve(data))});
  res.writeHead(200,{'Content-Type' : 'application/javascript'});
  res.end(script);
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