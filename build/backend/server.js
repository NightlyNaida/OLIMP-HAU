let express = require('express');
let app = express();
let headConst = require('./headConst.js');
let processIncomingImage = require('./processIncomingImage.js');
let parsMatchPage = require('./parsMatchPage.js');
const logosAvailableChecker = require('./logosAvailableChecker');
const createImage = require('./createImage');

const formidable = require('formidable');
const PORT = 3000;
PATH_TO_FRONT = '../frontend/static';


app.listen(PORT, () => console.log(`Server strat listening port ${PORT}`));

app.use(express.static(PATH_TO_FRONT));
app.get('/',(res,req) => {
  res.status(300);
  res.redirect('static/index.html');
});

app.get('/createImage', async (req,res) => { //запрос клиента на создание шапки
    console.log('client request head');
    let mathcObj = await parsMatchPage(req.query.eventLineURL); //парсим страницу матча
    let checkIcons = await logosAvailableChecker.checkArrayOfTeams([mathcObj.firstTeam, mathcObj.secondTeam]); //проверяем наличие иконок
    if(checkIcons.globalResult){
      let image = await createImage(mathcObj); //если иконки есть, делаем шапку и отправляем её
      sendResponse(res,image,'image/png');
    }
    else{
      console.log('server have not some logos, send request about need for logo'); //в противном случае отправляем JSON, клиент это интерпретирует как необходиомсть загрузить иконку для команды
      let data = JSON.stringify(checkIcons.details);
      sendResponse(res,data,'application/json'); 
    }
});

app.post('/sendLogo', async (req,res) => { //клиент присылает новый логотип
  console.log('client send new logo');
  let form = await parseForm(req);
  await processIncomingImage(form)
  .then(status => {
    if (status) sendResponse(res,'New logo saved', 'text/plain');
    else sendResponse(res,`Module "processIncomingImage" dosen't work correct`, 'text/plain');
  })
  .catch(err => {
    sendResponseError(res,err.toString());
  });
})

app.get('/testhead', async (req,res) => {
  console.log('test head entry');

  let secondTeam = req.query.secondTeam;
  let matchObj = {
      firstTeam: 'Пусто',
      secondTeam: secondTeam,
      coefficents: ['2.22','3.33','4.44']
  }
  let image = await createImage(matchObj);
  sendResponse(res,image,'image/png');
})

app.get('/headParam', (req, res) => { //запрос на параметры размещения объектов на шапке
  console.log('response for head parameters');
  let param = JSON.stringify(headConst);
  sendResponse(res,param,'application/json');
})


async function parseForm (req){ //метод для парсинга POST запросов
  let formParser = await formidable.IncomingForm(); 
  let form = await new Promise ((resolve, reject) => {
    formParser.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({
        fields: fields,
        files: files
      });
    })
  })
  console.log(form);
  return form;
}

async function sendResponse(res, data, contentType){ //универсальный метод отправки ответа клиенту
  console.log(`Send to user ${contentType}`);
  res.status(200);
  res.set({'Content-Type' : contentType});
  res.send(data);
  res.end();
}

async function sendResponseError(res, data){ //универсальный метод отправки некорректного запроса или ошибки
  console.log(`Send to user error${data}`);
  res.status(500);
  res.set({'Content-Type' : 'text/plain'});
  res.send(data);
  res.end();
}




