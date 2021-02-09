export function processLogoUnavailability (object){
    insertForms(object);
}

function insertForms(object){
    for(let key in object){
        if(!object[key]){
            document.body.append(generateForm(key)); 
        }
    }
}

function generateForm(nameOfTeam){


    let BEMParentPrefix = 'needLogoForm__';

    let container = document.createElement('div');
    container.classList.add('needLogoFormContainer');

    let form = document.createElement('form');
    let id = new Date().getTime();
    form.id = id;
    form.classList.add('needLogoForm');
    
    let caption = document.createElement('h2');
    caption.classList.add(`${BEMParentPrefix}caption`);
    caption.innerHTML = `Отсутствует логотип для команды <span class="${BEMParentPrefix}nameOfTeam">${nameOfTeam}</span>`;

    let input = document.createElement('input');
    input.classList.add(`${BEMParentPrefix}label`);
    input.classList.add(`${BEMParentPrefix}input`);
    input.type = 'file';
    input.name = "imageFile";
    input.setAttribute('form',id);

    form.append(caption);
    form.append(input);
    container.append(form);

    form.addEventListener('submit',formHandler);

    return container;
}

async function formHandler(e){
    e.preventDefault();
    let container = e.target.closest('.needLogoFormContainer');
    let nameOfTeam = container.querySelector('.needLogoForm__nameOfTeam').innerText;
    let form = e.target.closest('form');
    let inputForName = document.createElement('input');
    inputForName.value = nameOfTeam;
    inputForName.name = 'nameOfTeam';
    inputForName.style.display = 'none';
    form.append(inputForName);

    let res = await fetch('/sendLogo',{
        method: 'POST',
        body: new FormData(form)
    })

    console.log(res.status);
    
}