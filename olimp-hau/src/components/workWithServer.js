let obj = {
    getDataFromServerInObject: getDataFromServerInObjectFunction,
    getCompositionParametes: getCompositionParametesFunction,
    getBackgroundImage: getBackgroundImageFunction
}

async function getDataFromServerInObjectFunction(url){
    let responseFromServer = await fetch(url);
    let contentType = responseFromServer.headers.get('Content-Type');
    let shortContentType = convertContentTypeToSortVersion(contentType);

    let finalyObject = {'response': responseFromServer, 'contentType': contentType, 'shortContentType': shortContentType};

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

export default obj