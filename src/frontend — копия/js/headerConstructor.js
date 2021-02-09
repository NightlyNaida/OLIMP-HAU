//let secondTeam = 'Ливерпуль' //логотип, который будет в качестве второй команды на шапке-примере

let logoObj = {};

export async function initLogo(imgSrc){//сюда передаем картинку, которая загружена в форму и подготавливаем всё необходимое
    let img = document.createElement('img');
    img.src = imgSrc;
    img.classList.add('headerConstructor__edit');

    let constructor = document.querySelector('.headerConstructor_readyForInsertLogo');
    constructor.classList.remove('headerConstructor_readyForInsertLogo');
    constructor.append(img);

    await positionTheLogo(img);
    initObjectOfLogo(img);
    updateValueInInterface(img);
    setLogicToImgTag();

    function setLogicToImgTag(){
        window.addEventListener('keydown', (e) => {
            switch(e.code){
                case 'ArrowUp' : moveLogo(0,-10); break;
                case 'ArrowDown' : moveLogo(0,10); break;
                case 'ArrowLeft' : moveLogo(-10,0); break;
                case 'ArrowRight' : moveLogo(10,0); break;
            }
        })
    }
}

//генерируем конструктор шапки
export async function generateConstructor(){
    let constructorFrame = document.createElement('div');
    constructorFrame.classList.add('headerConstructorFrame');
    let testHeadBlob = await getTestHead('Арсенал');
    let constructorDiv = document.createElement('div');
    constructorDiv.classList.add('headerConstructor');
    constructorDiv.classList.add(`headerConstructor_readyForInsertLogo`);
    constructorDiv.style.backgroundImage = `url('${URL.createObjectURL(testHeadBlob)}')`; 
    constructorFrame.append(constructorDiv);
    return constructorFrame;


    
    async function getTestHead(secondTeam){
        let data = await fetch(`/testhead?secondTeam=${secondTeam}`);
        if (data.headers.get('Content-Type') == 'image/png') 
            return await data.blob();
    }

}

export function generateInputsForConstructor(idForm){
    const parentPrefix = 'headerConstructor__';
    let container = document.createElement('div');
    container.classList.add(`${parentPrefix}inputs`);

    let positionAndSizeGroup = document.createElement('div');
    positionAndSizeGroup.classList.add(`${parentPrefix}positionGroup`);
    positionAndSizeGroup.append(generateInput('number','distanceFromCenter',[`${parentPrefix}inputPosition`],'',idForm));
    positionAndSizeGroup.append(generateInput('number','y',[`${parentPrefix}inputPosition`],'',idForm));


    let sizeGroup = document.createElement('div');
    sizeGroup.classList.add(`${parentPrefix}sizeGroup`);
    sizeGroup.append(generateInput('number','width',[`${parentPrefix}inputSize`],'',idForm));
    sizeGroup.append(generateInput('number','height',[`${parentPrefix}inputSize`],'',idForm));

    let controlGroup = document.createElement('div');
    controlGroup.classList.add(`${parentPrefix}controlGroup`);
    controlGroup.append(generateInput('button','buttonLeft',[`${parentPrefix}button`,`${parentPrefix}buttonLeft`],'←'));
    controlGroup.append(generateInput('button','buttonRight',[`${parentPrefix}button`,`${parentPrefix}buttonRight`],'→'));
    controlGroup.append(generateInput('button','buttonUp',[`${parentPrefix}button`,`${parentPrefix}buttonUp`],'↑'));
    controlGroup.append(generateInput('button','buttonDown',[`${parentPrefix}button`,`${parentPrefix}buttonRight`], '↓'));

    let okButton = generateInput('submit','submit',[`${parentPrefix}submitButton`],'',idForm);

    container.append(positionAndSizeGroup);
    container.append(sizeGroup);
    container.append(controlGroup);
    container.append(okButton);

    container.addEventListener('change', handleInputChange);
    return container;

    function generateInput(type,name,classList,text,id){
        let input = document.createElement('input');
        input.setAttribute('type',type);
        input.setAttribute('name',name);
        for(let i in classList){
            input.classList.add(classList[i]);
        }
        if (text) input.setAttribute('value',text);
        if(id) input.setAttribute('form',id);
        return input;
    }
}


function initObjectOfLogo(img){
    let css = getComputedStyle(img);
    logoObj.x = css.left;
    logoObj.y = css.top;
    logoObj.width = css.width;
    logoObj.height = css.height;
}

function updateValueInInterface(img){
    let css = getComputedStyle(img);
    let backgroundCss= getComputedStyle(document.querySelector('.headerConstructor'));
    document.querySelector('.headerConstructor__inputPosition[name="distanceFromCenter"]').value = parseInt(backgroundCss.width) / 2 - parseInt(css.left);
    document.querySelector('.headerConstructor__inputPosition[name="y"]').value = parseInt(css.top);
    document.querySelector('.headerConstructor__inputSize[name="width"]').value = parseInt(css.width);
    document.querySelector('.headerConstructor__inputSize[name="height"]').value = parseInt(css.height);
}

async function positionTheLogo(img){
    let stringJSON = await getParametersOfLogoPosition().catch(err => {throw new Error(err)});
    let param = JSON.parse(stringJSON);
    
    let cssOfParent = getComputedStyle(img.parentElement);
    let cssOfLogo = getComputedStyle(img);

    let halfOfParentWidht = parseInt(cssOfParent.width) / 2;
    let halfOfParentHeight = parseInt(cssOfParent.height) / 2;

    let halfOfLogoWidth = parseInt(cssOfLogo.width) / 2;
    let halfOfLogoHeight = parseInt(cssOfLogo.height) / 2;
    
    img.style.left = `${halfOfParentWidht - halfOfLogoWidth - param.spaceBetweenLogos}px`;
    img.style.top = `${halfOfParentHeight - halfOfLogoHeight + param.marginImageY}px`; 

    async function getParametersOfLogoPosition(){
        let data = await fetch('/headParam');
        console.log(data.headers.get('Content-Type'));
        if (data.headers.get('Content-Type') == 'application/json; charset=utf-8')
            return await data.text();
        else throw new Error('Data from server is not JSON');
    }
}




function moveLogo (x,y){
    let img = document.querySelector('.headerConstructor__edit');
    let css = getComputedStyle(img);
    let left = parseInt(css.left);
    let top = parseInt(css.top);
    
    img.style.left = `${left + x}px`;
    img.style.top = `${top + y}px`;

    initObjectOfLogo(img);
}



function handleInputChange (e){
    let form = e.target.closest('.needLogoFormContainer');
    let logo = form.querySelector('.headerConstructor__edit');
    logo.style.left = `${form.querySelector('.headerConstructor__inputPosition[name="x"]').value}px`;
    logo.style.top = `${form.querySelector('.headerConstructor__inputPosition[name="y"]').value}px`;
    logo.style.width = `${form.querySelector('.headerConstructor__inputSize[name="width"]').value}px`;
    logo.style.height = `${form.querySelector('.headerConstructor__inputSize[name="height"]').value}px`;

    initObjectOfLogo(logo);
}



