let form = document.querySelector('#headerResponser__form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    let res = await fetch('/createImage',{
        method: 'POST',
        body: new FormData(form)
    })
    let contentType = res.headers.get('Content-Type'); 
    if(/text\/html/gm.test(contentType)) {getFormAndInsertIt(res).then(ok => setListenerToDownloadedForm())};
    if(/image\/png/gm.test(contentType)) getImageThenInsertIt(res);
    // .then(html => document.querySelector('body').innerHTML += html)
});


//идентификатор формы определен в коде бэкэнда
function setListenerToDownloadedForm(){
    let inputs = Array.from(document.querySelectorAll('.needLogoForm__input'));
    console.log(inputs);
    inputs.forEach(input => input.addEventListener('change', (event) => {
        handleInput(event.target);
    }));

    function handleInput(input){
        if (input.files[0]) {
            let fr = new FileReader(); 
            fr.addEventListener('loadend', () => {
                let img = document.createElement('img');
                img.src = fr.result;
                img.setAttribute('style',"max-width: 200px; max-height: 200px;");
                let inputContainer = input.closest('.needLogoForm__inputContainer');
                inputContainer.appendChild(img);
            })
            fr.readAsDataURL(input.files[0]);
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
    body.innerHTML = body.innerHTML + ' <img src="" id="image-place" style="max-width: 200px; max-height: 200px;">';
    let imagePlace = document.querySelector('#image-place');
    imagePlace.src = URL.createObjectURL(blob);
}


async function getFormAndInsertIt (res){
    let code = await res.text();
    insertFormIntoPage(code);
    return 'OK';
}

function insertFormIntoPage(code){
    let body = document.querySelector('body');
    body.innerHTML = body.innerHTML + code;
}


