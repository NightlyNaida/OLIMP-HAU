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
          <img src="../../../../assets/document.svg" alt="">
        </label>
        <range @value-change="changeRangeValue" :max="200" :min="20" :default-value="100"></range>
        <button class="button-logo-ready">
          <p>Загрузить</p>
          <img src="../../../../assets/Ok.svg" alt="">
        </button>
      </div>
      <image-constructor :logo="logo" :scale="logoScaleValue"></image-constructor>
  </div>
</template>

<script>
import imageConstructor from './constructor.vue';
import userInterface from '../../../UI components/userInterfaceComponents.js';
let range = userInterface.range;
export default {
  components:{imageConstructor, range},
  data(){
    return {
      markerPositionId: '',
      logoScaleValue: 100,
    }
  },
  props: ['teams','logo'],
  events: ['logo-load','change-active-team'],
  methods:{
    buttonClick(e){
      this.changeMarkerPosition(e.target.dataset.pkey);
    },
    changeMarkerPosition(buttonId){
      this.$emit('change-active-team',buttonId);
      this.$refs['button-' + this.markerPositionId].classList.remove('button-selected');
      this.markerPositionId = buttonId;
      this.$refs['button-' + buttonId].classList.add('button-selected');
      this.$refs[`marker`].style.left = (this.$refs['button-' + buttonId].getBoundingClientRect().left - 70) + 'px';
    },
    inputFileChange(e){
      if(e.target.files[0]){
        this.$emit('logo-load', e.target.files[0]);
      }
    },
    changeRangeValue(value){
      this.logoScaleValue = value;
    }
  },
  mounted(){
    this.changeMarkerPosition(this.markerPositionId);
  },
  created(){
    this.markerPositionId = Object.keys(this.teams)[0];
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

  

</style>
