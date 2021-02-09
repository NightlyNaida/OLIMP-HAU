<template>
    <div>
        <form :class="{'non-border': isLoading}" :style="{borderWidth: `${borderWidthVariable}px`}" @submit="responseHeadImage">
            <input v-model="eventLineUrl" type="url" placeholder="ссылка на линию">
            <button @click="sendURL">
                <img src="../../assets/play.svg" alt="Го">
            </button>
            <transition name='loadbar'>
                <div v-if="isLoading" class="load-bar">
                    <p>Взлымываем olimp.bet</p>
                    <img class="loading-image" src="../../assets/loading-arrows.svg" alt="loading">
                </div>
            </transition>
        </form>
    </div>
</template>

<script>
export default {
    
    data(){
        return{
            isLoading: false,
            borderWidthVariable: 1,
            eventLineUrl: ''
        }
    },
    methods:{
        responseHeadImage(e){
            let thisData = this;
            e.preventDefault();
            this.isLoading = true;
            requsetsHeadAndProcessIncomingData();
            async function requsetsHeadAndProcessIncomingData(){
                let dataFromServer = await getDataFromServerInObject(`http://127.0.0.1:3030/createImage?eventLineURL=${thisData.eventLineUrl}`);
                switch(dataFromServer.shortContentType){
                    case `json`: {
                        let textJSON = await dataFromServer.response.text();
                        processAndWriteJSON(textJSON);
                    } break;
                    // case `png`: {
                    //     let blobImage = await dataFromServer.response.blob();
                    //     processAndWriteBlobImage(blobImage)
                    // } break;
                }
            thisData.isLoading = false;
            }

            function processAndWriteJSON(txtJSON) {
                let obj = JSON.parse(txtJSON);
                for (let key in obj) {
                    if (!obj[key]) thisData.$emit('team-without-logo', key);
                }
            }

            // function processAndWriteBlobImage(blob) {
            //     app.finishedImages.push(URL.createObjectURL(blob));
            // }
        }
    },
    emmits: ['team-without-logo']
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
</script>

<style lang="stylus" scoped>
    div 
        display flex
        justify-content center

    form
        display grid
        grid-template-columns 1fr 60px
        grid-template-rows 1fr
        padding 6px 6px 6px 20px
        box-sizing border-box
        border 0px solid rgba(250,250,250,1)
        border-radius 50px
        height 50px
        width 500px
        overflow hidden
        position relative
        transition border-color .4s ease-in-out

    .non-border
        border-color rgba(250,250,250,0)
        

    input
        background-color rgba(0,0,0,0)
        color #FAFAFA
        font-size 14px
        border none

    button
        display flex
        justify-content center
        align-items center
        padding 0
        background linear-gradient(111.34deg, #3A8C13 0%, #2D6C10 100%);
        border none
        border-radius 50px
        box-shadow 1px 1px 7px 10px rgba(0, 0, 0, 0.25)
    
    button:active   
        transform scale(0.95)

    .load-bar
        background linear-gradient(111.34deg, #3A8C13 0%, #2D6C10 100%);
        height 100%
        width 100%
        left 0
        top 0
        position absolute
        display flex
        justify-content center
        align-items center
        border-radius 30px
        animation-name dynamic
        animation-duration 1s
        animation-timing-function ease-in-out
        animation-iteration-count infinite
        animation-direction alternate

    .loadbar-enter-active, .loadbar-leave-active 
        transition all .8s ease-in-out
    
    .loadbar-enter-from, .loadbar-leave-to
        left -100%
        opacity 0

    p 
        color white
        font-weight 300
        font-size 14px
        margin-right 10px

    .loading-image
        height 17px
        animation-name rotate
        animation-duration 1s
        animation-iteration-count infinite 
        animation-timing-function linear

    @keyframes rotate 
        0%
          transform rotate(0deg)
        
        100%
          transform rotate(360deg)

 

</style>
