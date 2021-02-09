'use strict';
let form = document.querySelector('#headerResponser__form');

import {initLogo, generateConstructor, generateInputsForConstructor} from '/headerConstructor.js';
import {processLogoUnavailability} from '/processLogoUnavailability.js';

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log(new FormData(form));
    let res = await fetch('/createImage',{
        method: 'GET',
        body: new FormData(form)
    });
    let contentType = res.headers.get('Content-Type'); 
    if(/application\/json/gm.test(contentType)) {proscessResponseAboutNeedForLogo(res).then(ok => setListenerToForm())};
    if(/image\/png/gm.test(contentType)) getImageThenInsertIt(res);
});


//идентификатор формы определен в коде бэкэнда
function setListenerToForm(){
    let inputs = Array.from(document.querySelectorAll('.needLogoForm__input'));
    inputs.forEach(input => input.addEventListener('change', (event) => {
        handleInput(event.target);
    }));

    async function handleInput(input){
        if (input.files[0]) {
            let constructor = await generateConstructor();
            let inputs = generateInputsForConstructor(input.closest('form').id); //передаём id формы, чтобы привязать инпуты
            let container = input.closest('.needLogoFormContainer');
            container.append(constructor);
            container.append(inputs);

            let fr = new FileReader();
            fr.addEventListener('loadend', handleReader);
            fr.readAsDataURL(input.files[0]);
        }

        async function handleReader(e){
            await initLogo(e.target.result);
        } 
    }
}

async function getImageThenInsertIt(res){
    let blob = await res.blob();
    insertImageIntoPage(blob);
    return 'OK';
}

function insertImageIntoPage(blob){
    let body = document.querySelector('body');
    body.innerHTML = body.innerHTML + ' <img src="" id="image-place" style="max-width: 900px; max-height: 200px;">';
    let imagePlace = document.querySelector('#image-place');
    imagePlace.src = URL.createObjectURL(blob);
}


async function proscessResponseAboutNeedForLogo (res){
    let jsonText = await res.text();
    let json = JSON.parse(jsonText);
    console.log(json);
    processLogoUnavailability(json);
    return 'OK';
}




