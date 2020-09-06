let http = require('http');
let fs = require('fs');

let server = http.createServer((req,res) => {
      switch(req.method){
        case 'POST': handlePOST(req,res); break;
        case 'GET': handleGET(req,res); break;
      }
    }
).listen(3000, () => console.log('Server strat listening port 3000'));

function handleGET(req,res){
  switch(req.url){
    case'/': giveIndexPage(res); break;
    default : give404Page(res);
  }
}

function handlePOST(req,res){
  
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