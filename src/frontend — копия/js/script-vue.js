
const options = {
    data(){
        return{
            eventLineURL: "",
            teamsNeedForLogo: [], 
            isLoadingHead: false,
            finishedImages:[],
        }
    },
    methods:{
        responseHeadImage(){
            if( isValidURL(this.eventLineURL) ) {
                let app = this;
                app.isLoadingHead = true;
                requsetsHeadAndProcessIncomingData();
                
                async function requsetsHeadAndProcessIncomingData(){
                    let dataFromServer = await getDataFromServerInObject(`/createImage?eventLineURL=${app.eventLineURL}`);
                    switch(dataFromServer.shortContentType){
                        case `json`: {
                            let textJSON = await dataFromServer.response.text();
                            processAndWriteJSON(textJSON);
                        } break;

                        case `png`: {
                            let blobImage = await dataFromServer.response.blob();
                            processAndWriteBlobImage(blobImage)
                        } break;
                    }
                    app.isLoadingHead = false;
                }

                function processAndWriteJSON(txtJSON) {
                    let obj = JSON.parse(txtJSON);
                    for (key in obj) {
                        if (!obj[key]) app.teamsNeedForLogo.push({ name: key, loaded: false });
                    }
                }

                function processAndWriteBlobImage(blob) {
                    app.finishedImages.push(URL.createObjectURL(blob));
                }
            }
        },
        setFlagToFormAndCheckAllForms(key){
            let appThis = this;
            appThis.teamsNeedForLogo[key].loaded = true;
            let allTeamsHaveLogo = checkFormsToAvailability();
            if (allTeamsHaveLogo){
                deleteFormsForLogoAndRequestImage();
            }

            function checkFormsToAvailability(){
                let result = true;
                for (let i in appThis.teamsNeedForLogo){
                    result = result && appThis.teamsNeedForLogo[i].loaded;
                }
                return result;
            }

            function deleteFormsForLogoAndRequestImage(){
                appThis.teamsNeedForLogo = [];
                appThis.responseHeadImage();
            }
        }
    },
    computed:{
        isShowForm: function(){  
            return (!this.isLoadingHead && this.teamsNeedForLogo.length < 1);
        },
    }
}

let app = Vue.createApp(options);

app.component('logo-loader', {
    emits:['loaded'],
    props: ['teamname', 'pkey'],
    data(){
        return{
            urlToIamgeFile: '',
            blobOfImage: '',
            logoWidth: 0,
            logoHeight: 0,
            isLoaded: false,
        }
    },
    template: `<div class="logo-loader-container">
                    <div v-if="!isLoaded" class="logo-loader-container">
                        <h3 class="logo-loader-caption">Нет логотипа для команды <span class="logo-loader-team_name">{{teamname}}</span></h3>
                        <form class="logo-loader-form">
                            <p class="logo-loader-title">Загрузите изображение</p>
                            <input type="file" class="logo-loader-input" @change="inputForLogoImageHandle"> 
                        </form>
                        <head-constructor @constructor-logo-not-loaded="logoNotLoaded" @constructor-logo-loaded="logoLoaded" v-if="urlToIamgeFile.length" :logo_url="urlToIamgeFile" :logo_width="logoWidth" :logo_height="logoHeight"></head-constructor>
                    </div>
                    <div class="logo-loader-ok" v-else>
                        <p class="logo-loader-ok-caption">Логотип загружен</p>
                    </div>
               </div>`,
    methods: {
        inputForLogoImageHandle(event){
            let data = this;
            if(event.target.files[0]){
                let fr = new FileReader();
                let image = new Image();
                data.blobOfImage = event.target.files[0];

                fr.addEventListener('loadend', handleReader);
                fr.readAsDataURL(event.target.files[0]);

                image.addEventListener('load',handleImage);
                image.src = URL.createObjectURL(event.target.files[0]);
    
                function handleReader(e){
                    data.urlToIamgeFile = e.target.result;
                }
                function handleImage(e){
                    data.logoWidth = this.width;
                    data.logoHeight = this.height;
                }
            }
        },
        logoLoaded(){
            this.$emit('loaded',this.pkey);
            this.isLoaded = true;
            
        },
        logoNotLoaded(err){
            console.warn(`Some trouble with loading logo. Error: ${err}`);
        }
    },
})

app.component('head-constructor',{
    props: ['logo_url','logo_width','logo_height'],
    emits: ["constructor-logo-loaded","constructor-logo-not-loaded"],
    data(){
        return{
            scaleProcent: 100,
            urlBackground: '',
            distanceFromCenter: 400,
            backgroundWidth: 3180,
            backgroundHeight: 800,
            marginLogoY: 0
        }
    },
    template: ` <p class="head-constructor-title"> Подгоните логотип по размеру. Он должен примыкать к линиям.</p> 
                <div v-if="this.$parent.urlToIamgeFile.length > 1" class="constructor-container">
                <div class="constructor-cell-view">
                    <div class="constructor-view-container">
                        <div calss="constructor-view-grid">
                            <div class="constructor-view-grid-line constructor-view-grid-line-hr-top"></div>
                            <div class="constructor-view-grid-line constructor-view-grid-line-hr-bottom"></div>
                        </div>
                        <img class="constructor-view-background" :src="urlBackground">    
                        <img class="constructor-view-logo" ref="logo-image" :src="this.$parent.urlToIamgeFile" :style="{width: actualWidth +'px', height: actualHeight + 'px', top: (backgroundHeight / 2 - actualHeight / 2 + marginLogoY ) + 'px', left: (backgroundWidth / 2 - distanceFromCenter - actualWidth / 2) + 'px'}">
                    </div>
                </div>
                <div class="constructor-cell-controls">
                    <div class="constructor-controls">
                        <div class="constructor-cotrols-scale-container">
                            <label class="constructor-controls-label"><span>Размер: </span>{{scaleProcent}}</label>
                            <input type="range" class="constructor-controls-y" v-model="scaleProcent" min="60" max="160">
                        </div>
                    </div>
                </div>
                <div class="constructor-cell-submit">
                    <button class="constructor-submit" @click="sendLogoParameters">Сохранить настройку</button>
                </div>
               </div>`,
    created: function(){
        let data = this;

        getHeadWithoutOneLogoAndWriteIt();
        getActualParametersForLogoPosition();

        async function getHeadWithoutOneLogoAndWriteIt(){
            let dataFromServer = await getDataFromServerInObject('/testhead?secondTeam=Пусто');
            if (dataFromServer.shortContentType == 'png'){
                let imageBlob = await dataFromServer.response.blob();
                data.urlBackground = URL.createObjectURL(imageBlob);
            }
            else console.warn('Error of void head request');
        }

        async function getActualParametersForLogoPosition(){
            let dataFromServer = await getDataFromServerInObject('/headParam');
            if (dataFromServer.shortContentType == 'json'){
                let textJSON = await dataFromServer.response.text();
                let json = JSON.parse(textJSON);
                data.distanceFromCenter = json.distanceFromCenter;
                data.marginLogoY = json.marginLogoY;
            }
        }
    },
    methods:{
        sendLogoParameters(){
            let thisApp = this;
            let formData = createFormDataAndWriteDataDown();
            fetch('/sendLogo', {
                method: 'POST',
                body: formData
            }).then(res => {
                return res.text();
            })
            .then(txt => {
                checkOfSendLogoResult(txt);
            })

            function createFormDataAndWriteDataDown(){
                let formData = new FormData();
                formData.append('nameOfTeam', thisApp.$parent.teamname);
                formData.append('width', thisApp.actualWidth);
                formData.append('height',thisApp.actualHeight);
                formData.append('imageFile', thisApp.$parent.blobOfImage);
                return formData;
            }
            
            function checkOfSendLogoResult(text){
                if (text == 'New logo saved'){
                    thisApp.$emit('constructor-logo-loaded');
                }
                else{
                    thisApp.$emit('constructor-logo-not-loaded',text);
                }
            }
        },
    },
    computed: {
        actualWidth: function (){
            return this.logo_width * (this.scaleProcent / 100);
        },
        actualHeight: function (){
            return this.logo_height * (this.scaleProcent / 100);
        }
    }
})


app.component('ready-headers', {
    props:['head_url'],
    template: `<img class="ready-head" :src="head_url">`
})
 
let appExemplar = app.mount('#app-container');


function isValidURL (url) {
    return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(url)
}



async function getDataFromServerInObject(url){
    let responseFromServer = await fetch(url);
    let contentType = responseFromServer.headers.get('Content-Type');
    let shortContentType = convertContentTypeToSortVersion(contentType);

    return {'response': responseFromServer, 'contentType': contentType, 'shortContentType': shortContentType}

    function convertContentTypeToSortVersion(contentType){
        if (/image\/png/gm.test(contentType)) return 'png';
        if (/application\/json/gm.test(contentType)) return 'json';
        return null;
    }
}

