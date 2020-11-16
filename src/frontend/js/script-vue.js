
const options = {
    data(){
        return{
            link: "",
            teamsForNeedLogo: [],
            whatModuleAfter: 'none',
            isShowLoadGif: false,
            readyHeaders:[]
        }
    },
    methods:{
        printURL(){
            console.log(this.link);
        },
        sendURL(){
            if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(this.link)){
                this.isShowLoadGif = true;
                if (this.link.length > 0){
                    data = this;
                    fetch(`/createImage?link=${this.link}`,{
                        method: 'GET',
                    }).then(res => {
                        let contentType = res.headers.get('Content-Type'); 
                        if(/application\/json/gm.test(contentType)) res.text().then(txtJSON => processJSON(txtJSON));
                        if(/image\/png/gm.test(contentType)) res.blob().then(blob => processBlobImage(blob));
                    })

                    function processJSON(txtJSON){
                        let obj = JSON.parse(txtJSON);
                        for(key in obj){
                            if (!obj[key]) data.teamsForNeedLogo.push(key);
                        }
                        data.isShowLoadGif = false;
                    }

                    function processBlobImage(blob){
                        data.readyHeaders.push(URL.createObjectURL(blob));
                        console.log(data);
                        data.isShowLoadGif = false;
                    }
                }
            }
        }
    },
    computed:{
        isShowForm: function(){
            return (!this.isShowLoadGif && this.teamsForNeedLogo.length < 1);
        }
    }
}

let app = Vue.createApp(options);

app.component('logo-loader', {
    props: ['teamname'],
    data(){
        return{
            url: '',
            blob: '',
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
                            <input type="file" class="logo-loader-input" @change="inputHandle"> 
                        </form>
                        <head-constructor v-if="url.length" :logo_url="url" :logo_width="logoWidth" :logo_height="logoHeight"></head-constructor>
                    </div>
                    <div class="logo-loader-ok" v-else>
                        <p class="logo-loader-ok-caption">Логотип загружен</p>
                    </div>
               </div>`,
    methods: {
        inputHandle(event){
            let data = this;
            if(event.target.files[0]){
                let fr = new FileReader();
                let image = new Image();
                data.blob = event.target.files[0];

                fr.addEventListener('loadend', handleReader);
                fr.readAsDataURL(event.target.files[0]);

                image.addEventListener('load',handleImage);
                image.src = URL.createObjectURL(event.target.files[0]);
    
                function handleReader(e){
                    data.url = e.target.result;
                }
                function handleImage(e){
                    data.logoWidth = this.width;
                    data.logoHeight = this.height;
                }
            }
        }
    }
})

app.component('head-constructor',{
    props: ['logo_url','logo_width','logo_height'],
    data(){
        return{
            scaleProcent: 100,
            urlBackground: '',
            distanceFromCenter: 400,
            backgroundWidth: 3180,
            backgroundHeight: 800,
            marginLogoY: 0,
            isLogoLoaded: false
        }
    },
    template: ` <p class="head-constructor-title"> Подгоните логотип по размеру. Он должен примыкать к линиям.</p> 
                <div v-if="this.$parent.url.length > 1 && !isLogoLoaded" class="constructor-container">
                <div class="constructor-cell-view">
                    <div class="constructor-view-container">
                        <div calss="constructor-view-grid">
                            <div class="constructor-view-grid-line constructor-view-grid-line-hr-top"></div>
                            <div class="constructor-view-grid-line constructor-view-grid-line-hr-bottom"></div>
                        </div>
                        <img class="constructor-view-background" :src="urlBackground">    
                        <img class="constructor-view-logo" ref="logo-image" :src="this.$parent.url" :style="{width: actualWidth +'px', height: actualHeight + 'px', top: (backgroundHeight / 2 - actualHeight / 2 + marginLogoY ) + 'px', left: (backgroundWidth / 2 - distanceFromCenter - actualWidth / 2) + 'px'}">
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

        //запрашиваем тестовую шапку без логотипа слева
        fetch('/testhead?secondTeam=Пусто')
        .then(res => {
            let contentType = res.headers.get('Content-Type');
            if (contentType == 'image/png') return res.blob();
        })
        .then(blob => {
            data.urlBackground = URL.createObjectURL(blob);
        });

        //запрашиваем параметры позиционирования объектов
        fetch('/headParam')
        .then(data => {return data.text()})
        .then(jsonString => {
            let json = JSON.parse(jsonString);
            data.distanceFromCenter = json.distanceFromCenter;
            data.marginLogoY = json.marginLogoY;
        })
        .catch(err => {
            console.log(err);
        })
    },
    methods:{
        sendLogoParameters: function(){
            dataObject = this;
            let formData = new FormData();
            formData.append('nameOfTeam', this.$parent.teamname);
            formData.append('width', this.actualWidth);
            formData.append('height',this.actualHeight);
            formData.append('imageFile', this.$parent.blob)
            fetch('/sendLogo', {
                method: 'POST',
                body: formData
            }).then(res => {
                return res.text();
            })
            .then(txt => {
                dataObject.isLogoLoaded = true;
                console.log(txt);
                dataObject.$parent.isLoaded = true;
            })
        }
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
    template: `<img class class="ready-head" :src="head_url">`
})


 
let appExemplar = app.mount('#app-container');


