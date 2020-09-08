let http = require('http');
let fs = require('fs');
const formidable = require('formidable');


let server = http.createServer((req,res) => {
      switch(req.method){
        case 'POST': handlePOST(req,res); break;
        case 'GET': handleGET(req,res); break;
      }
    }
).listen(3030, () => console.log('Server strat listening port 3000'));

function handleGET(req,res){
  switch(req.url){
    case'/': giveIndexPage(res); break;
    case'/script.js': giveScript(res); break;
    default : give404Page(res); break;
  }
}

function handlePOST(req,res){
  const form = formidable({ multiples: true });
  form.parse(req, (err,fields,files) => {
    oldPath = files.image.path;
    newPath = './logos';
    fs.rename(oldPath,newPath,(err) => {
      if (err) {
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end('err'); 
      }

      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('OK');
    })
  })
}


function giveIndexPage(res){
  let page = fs.readFileSync('../../build/index.html','utf-8');
  res.writeHead(200,{'Content-Type' : 'text/html'});
  res.end(page);
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