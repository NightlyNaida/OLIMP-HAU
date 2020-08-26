let http = require('http');
let fs = require('fs');

let server = http.createServer((req,res) => {
    switch(req.url){
      case'/': giveIndexPage(res); break;
      default : notFound(res);
    }
  }
).listen(3000, () => console.log('Server strat listening port 3000'));


function giveIndexPage(res){
  let page = fs.readFileSync('../../build/index.html','utf-8');
  res.writeHead(200,{'Content-Type' : 'text/html'});
  res.end(page);
}

function notFound(res){
  res.writeHead(404,{'Content-Type': 'text/plain'});
  res.end('404 Not Found');
}