<template>
  <div class="constructor-container">
    <div v-if="backgroundImageURL.length > 1" class="image-container">
      <div
        ref="background"
        class="image-container-scale"
        :style="imageContainerScaleStyle"
      >
        <div class="image-container-line image-container-line-top"></div>
        <div class="image-container-line image-container-line-bottom"></div>
        <img ref="logo" @load="positonLogo" :src="activeTeamLogoParameters.url" :style="logoStyle" class="image-container-scale__logo" alt="">
        <img
          :src="backgroundImageURL"
          alt="Не удалось загрузить изображение шапки"
        />
      </div>
      <div class="imageScaleController">
        <button
          data-value="-10"
          @click="buttonScaleControllerClick"
          class="imageScaleController__button-minus imageScaleController__button"
        >
          <img
            class="imageScaleController__button-image"
            src="../../../../assets/minusInCircle.svg"
            alt="-"
          />
        </button>
        <button
          data-value="10"
          @click="buttonScaleControllerClick"
          class="imageScaleController__button-plus imageScaleController__button"
        >
          <img
            class="imageScaleController__button-image"
            src="../../../../assets/PlusInCircle.svg"
            alt="+"
          />
        </button>
      </div>
    </div>
    <div v-else-if="isLoadingImage" class="image-loading">
      <img src="../../../../assets/loading-arrows.svg" alt="" />
      <p>Загрузка</p>
    </div>
    <div v-else class="image-not-loaded">
      <p>Ошибка загрузки изображения.</p>
    </div>
  </div>
</template>

<script>
const width = 3180;
const height = 800;
import workWithServer from "../../../workWithServer.js";
export default {
  emits: ['logo-size'],
  props: ["scale", "activeTeamLogoParameters"],
  data() {
    return {
      scaleOfComposition: 20,
      backgroundImageURL: "",
      isLoadingImage: false,
      logoParameters: {
        logoDistanceFromCenterX: 0,
        logoDistanceFromCenterY: 0,
      },
    };
  },
  methods: {
    changeScaleOfComposition(value) {
      if (value > 0) {
        if (this.scaleOfComposition < 100) {
          this.scaleOfComposition += value;
        }
      } else if (this.scaleOfComposition > 10) {
        this.scaleOfComposition += value;
      }
    },
    buttonScaleControllerClick(e) {
      this.changeScaleOfComposition(parseInt(e.currentTarget.dataset.value));
    },
    positonLogo() {  
      if (this.backgroundImageURL.length > 1) {
        let style = getComputedStyle(this.$refs.logo);
        let left = width / 2 + this.logoParameters.logoDistanceFromCenterX - parseInt(style.width) / 2;
        let top = height / 2 + this.logoParameters.logoDistanceFromCenterY - parseInt(style.height) / 2;
        this.$refs.logo.style.left = `${left}px`;
        this.$refs.logo.style.top = `${top}px`;
        this.notifyAboutLogoSizeChange();
      }
    },
    notifyAboutLogoSizeChange(){
      if(this.$refs['logo']){
        let logoStyle = getComputedStyle(this.$refs['logo']);
        let size = {width: parseInt(logoStyle.width), height: parseInt(logoStyle.height)};
        this.$emit('logo-size',size);
      }
    }
  },
  computed: {
    imageContainerScaleStyle() {
      return {
        transform: `scale(${this.scaleOfComposition / 100})`,
        width: `${width}px`,
        height: `${height}px`,
      };
    },
    logoStyle() {
      return { transform: `scale(${this.activeTeamLogoParameters.scale / 100})` };
    },
  },
  mounted() {
    this.isLoadingImage = true;
    let proxy = this;
    workWithServer
      .getBackgroundImage()
      .then((url) => {
        proxy.backgroundImageURL = url;
        proxy.isLoadingImage = false;
      })
      .catch((err) => {
        //error message
        console.error(err);
        proxy.isLoadingImage = false;
      });

    workWithServer.getCompositionParametes().then((param) => {
      proxy.logoParameters.logoDistanceFromCenterX = param.logoDistanceFromCenterX;
      proxy.logoParameters.logoDistanceFromCenterY = param.logoDistanceFromCenterY;
    });
  },
};
</script>

<style lang="stylus" scoped>
.constructor-container
    grid-area preview
    overflow hidden
    position: relative
    border-radius 30px
    background-color rgba(157,157,157,0.3)
    box-shadow 0px 4px 17px 10px rgba(0, 0, 0, 0.25)
    display flex
    justify-content center
    align-items center


.image-container, .image-not-loaded, .image-loading
    display flex
    flex-direction column
    justify-content center
    align-items center

    position relative
    max-width 100%
    max-height 100%

  .image-container-scale
    width 3180px
    height 800px
    background-color white
    transform-origin 50%
    position: relative

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
    max-width 300px
    max-height 300px
    height: 300px;
    position: absolute;

  @keyframes rotate
      0%
        transform rotate(0deg)

      100%
        transform rotate(360deg)
</style>
