<template>
  <div class="logo-lodaer-container">
      <div class="switcher">
        <button class="button-switch" :ref="'button-' + index" @click="buttonClick" v-for="(team,index) in teams" :data-pkey="index" :key="index">{{index}}</button>
        <div ref="marker" class="indicator"></div>
      </div>
      <div class="logo-controller">
        <input id="file" class="logo-controller-input" @change="inputFileChange" type="file" name="logo-file">
        <label for="file" class="logo-controller-input-label">
          <p>Файл</p>
          <img src="../../assets/document.svg" alt="">
        </label>
        <range @value-change="changeLogoScaleValue" :max="200" :min="20" :default-value="100"></range>
        <button class="button-logo-ready">
          <p>Загрузить</p>
          <img src="../../assets/Ok.svg" alt="">
        </button>
      </div>
      <div v-if="backgroundImageUrl.length > 1" class="image-container">
        <div ref="background" class="image-container-scale" :style="scaleOfCompositionStyle">
          <!-- <img class="image-container-scale__logo" :src='activeTeam.file.name' alt=""> -->
          <div :style="logoPositionStyle" class="image-container-scale__logo"></div>
          <img :src="backgroundImageUrl" alt="Не удалось загрузить изображение шапки">
        </div>
        <div class="imageScaleController">
          <button data-value="-10" @click="buttonScaleControllerClick" class="imageScaleController__button-minus imageScaleController__button">
            <img  class="imageScaleController__button-image" src="../../assets/minusInCircle.svg" alt="-">
          </button>
          <button data-value="10" @click="buttonScaleControllerClick"  class="imageScaleController__button-plus imageScaleController__button">
            <img class="imageScaleController__button-image" src="../../assets/PlusInCircle.svg" alt="+">
          </button>
        </div>
      </div>
      <div v-else-if="isLoadingIamge" class="image-loading">
        <img src="../../assets/loading-arrows.svg" alt="">
        <p>Загрузка</p>
      </div>
      <div v-else class="image-not-loaded">
        <p>Ошибка загрузки изображения.</p>
      </div>
  </div>
</template>

<script>
import workWithServer from '../workWithServer.js';
import userInterface from '../UI components/userInterfaceComponents.js';
export default {
  components:{range: userInterface.range},
  data(){
    return {
      scaleOfComposition: 20,
      markerPositionId: '',
      backgroundImageUrl: '',
      isLoadingIamge: false,
      logoParameters:{
        loaded: false
      }
    }
  },
  props: ['teams'],
  events: ['logo-load'],
  methods:{
    changeLogoScaleValue(value){
    },
    buttonClick(e){
      this.changeMarkerPosition(e.target.dataset.pkey);
    },
    changeMarkerPosition(buttonId){
      this.$refs['button-' + this.markerPositionId].classList.remove('button-selected');
      this.markerPositionId = buttonId;
      this.$refs['button-' + buttonId].classList.add('button-selected');
      this.$refs[`marker`].style.left = (this.$refs['button-' + buttonId].getBoundingClientRect().left - 70) + 'px';
    },
    getBackgroundImageAndWriteIt(){
      let thisData = this;
      thisData.isLoadingIamge = true;
      workWithServer.getDataFromServerInObject('http://127.0.0.1:3030/testhead?secondTeam=Пусто')
        .then(data => {
          return data.response.blob();
        })
        .then(blob =>{
          thisData.backgroundImageUrl = URL.createObjectURL(blob);
          thisData.isLoadingIamge = true;
        })
    },

    getHeaderParemeters(){
      let thisData = this;
      workWithServer.getDataFromServerInObject('http://127.0.0.1:3030/headParam')
        .then(data => {
          if (data.shortContentType == 'json'){
            return data.response.text();
          }
        })
        .then(textJSON => {
          thisData.logoParameters.parameters = JSON.parse(textJSON);
          thisData.logoParameters.loaded = true;
        })
        .catch(err => {
          //errorMessage
          console.log(err);
        })
    },

    buttonScaleControllerClick(e){
      this.changeScaleOfComposition(parseInt(e.currentTarget.dataset.value));
    },

    changeScaleOfComposition(value){
      if(value > 0){
        if(this.scaleOfComposition < 100){
          this.scaleOfComposition += value;
        }
      }
      else if (this.scaleOfComposition > 10){     
        this.scaleOfComposition += value;
      }
    },

    inputFileChange(e){
      console.log(this.markerPositionId);
      if(e.target.files[0]){
        this.$emit('logo-load',{file: e.target.files[0], name: this.markerPositionId});
      }
    },
  },
  computed:{
    scaleOfCompositionStyle(){
      return {transform: `scale(${this.scaleOfComposition / 100})`}; 
    },
    logoPositionStyle(){
      console.log(this.$refs.background);
      // let parentImageStyle = getComputedStyle();

      // let left = parentImageStyle.width / 2 - this.logoParameters.parameters.distanceFromCenter;
      // let top = parentImageStyle.height / 2 - this.logoParameters.parameters.marginLogoY; 
      // if(this.logoParameters.loaded){
      //   return {left: `${left}px`, top: `${top}px`}
      // }
      // else return ``;
      return '';
    }
  },
  mounted(){
    this.changeMarkerPosition(this.markerPositionId);
  },
  created(){
    this.markerPositionId = Object.keys(this.teams)[0];
    this.getBackgroundImageAndWriteIt();
    this.getHeaderParemeters();
  }
}
</script>

<style lang="stylus" scoped>
  .logo-lodaer-container
    display grid
    grid-template-columns 1fr 1fr
    grid-template-rows 30px 300px
    grid-gap 30px 
    grid-template-areas  "switcher controller"\
                         "preview preview"

  .switcher
    display grid
    grid-template-columns repeat(2, 200px)
    grid-gap 30px
    grid-template-rows 30px
    position relative
    grid-area switcher

  .button-switch
    background-color rgba(0,0,0,0)
    border 1px solid rgba(255,255,255,0)
    color white
    font-size 18px
    box-sizing border-box
    padding 0
    transition color .4s ease-in-out
    border-radius 30px
    overflow hidden
    text-overflow ellipsis

  .button-switch:hover
    border-color rgba(255,255,255,0.3)
    cursor pointer

  .button-selected
    color #6C1010
    font-weight 600

  .indicator
    position absolute
    width 200px
    height 30px
    background-color white
    border-radius 30px
    transition all .5s ease-in-out
    z-index -1
    left 0p

  .logo-controller
    grid-area controller
    display flex
    justify-content right
    align-items center

  .logo-controller > *
    margin-left 50px

  .logo-controller-input
    display none
    position absolute

  .logo-controller-input-label
    display flex
    box-sizing border-box
    justify-content center
    align-items center
    width 120px
    height 100%
    border 1px solid white
    border-radius 50px

  .logo-controller-input-label > p
    color white
    margin 0 10px 0 0

  .button-logo-ready
    height 100%
    width 150px
    background linear-gradient(111.34deg, #3A8C13 0%, #2D6C10 100%);
    box-shadow 3px 2px 9px rgba(0, 0, 0, 0.25)
    border-radius 20px
    border none
    display flex
    justify-content center
    align-items center

  .button-logo-ready > p
    color white
    font-size 16px
    margin 0 10px 0 0

  .button-logo-ready > img 
    height 23px

  .image-container, .image-not-loaded, .image-loading
    background-color rgba(157,157,157,0.3)
    border-radius 30px
    overflow hidden
    display flex
    flex-direction column
    justify-content center
    align-items center
    box-shadow 0px 4px 17px 10px rgba(0, 0, 0, 0.25)
    position relative
    grid-area preview

  .image-container-scale
    width 3180px
    height 800px
    background-color white
    transform-origin 50%

  .imageScaleController
    height 50px
    width 100px
    background-color #1a1a1a
    border-radius 30px 0 30px 0
    position absolute
    right 0px
    bottom 0px
    display flex
    justify-content space-evenly
    align-items center

  .imageScaleController__button
    width 25px
    height 25px
    border-radius 50px
    border none
    background-color rgba(0,0,0,0)
    color white
    font-size 20px
    padding 0
    position relative

  .imageScaleController__button:hover
    transform scale(1.1)

  .imageScaleController__button:active
    transform scale(0.9)

  .imageScaleController__button-image
    height 100%

  .image-not-loaded > p, .image-loading > p
    color grey
    font-size 20px

  .image-loading > img
    width 70px
    opacity .3

  .image-loading > img
    animation-name rotate
    animation-duration 2s
    animation-iteration-count infinite 
    animation-timing-function linear

  .image-container-scale__logo
    width 300px
    height 300px
    position: absolute;
    background-color black

  @keyframes rotate 
      0%
        transform rotate(0deg)
        
      100%
        transform rotate(360deg)

</style>
