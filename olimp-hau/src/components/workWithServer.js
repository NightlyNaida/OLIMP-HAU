let obj = {
    getDataFromServerInObject: getDataFromServerInObjectFunction,
    getCompositionParametes: getCompositionParametesFunction,
    getBackgroundImage: getBackgroundImageFunction,
    sendLogo: sendLogoFunction,
}

async function getDataFromServerInObjectFunction(url){
    let responseFromServer = await fetch(url);
    let contentType = responseFromServer.headers.get('Content-Type');
    let shortContentType = convertContentTypeToSortVersion(contentType);
    let data; 
    switch(shortContentType){
        case 'png': data = await responseFromServer.blob(); break;
        case 'json': data = await responseFromServer.text(); break;
        case 'text': data = await responseFromServer.text(); break;
    }

    let finalyObject = {'response': responseFromServer, 'contentType': contentType, 'shortContentType': shortContentType, 'data': data};

    return finalyObject;

}

function convertContentTypeToSortVersion(contentType){
    if (/image\/png/gm.test(contentType)) return 'png';
    if (/application\/json/gm.test(contentType)) return 'json';
    if (/text\/pain/gm.test(contentType)) return 'text';
    return null;
}

async function getCompositionParametesFunction(){
    let data = await getDataFromServerInObjectFunction('http://127.0.0.1:3030/headParam');
    if (data.shortContentType == 'json'){
        let textJSON = await data.response.text();
        let json = JSON.parse(textJSON);
        return json;
    }

} 

async function getBackgroundImageFunction(){
    let data = await getDataFromServerInObjectFunction('http://127.0.0.1:3030/testhead?secondTeam=Пусто');
    if(data.shortContentType == 'png'){
        let imageBlob = await data.response.blob();
        let src = URL.createObjectURL(imageBlob);
        return src;  
    }
}

async function sendLogoFunction(formData){
    let response = await fetch('http://127.0.0.1:3030/sendLogo',{method: 'POST',body: formData});
    return response;
}

export default obj