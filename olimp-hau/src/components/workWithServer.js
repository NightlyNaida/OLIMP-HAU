let obj = {
    getDataFromServerInObject: getDataFromServerInObjectFunction,
}

async function getDataFromServerInObjectFunction(url){
    let responseFromServer = await fetch(url);
    let contentType = responseFromServer.headers.get('Content-Type');
    let shortContentType = convertContentTypeToSortVersion(contentType);

    return {'response': responseFromServer, 'contentType': contentType, 'shortContentType': shortContentType}

}

function convertContentTypeToSortVersion(contentType){
    if (/image\/png/gm.test(contentType)) return 'png';
    if (/application\/json/gm.test(contentType)) return 'json';
    return null;
}

export default obj