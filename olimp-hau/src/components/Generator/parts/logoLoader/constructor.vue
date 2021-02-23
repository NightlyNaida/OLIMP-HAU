<template>
  <div class="constructor-container">
    <div v-if="backgroundImageURL.length > 1" class="image-container">
      <div
        ref="background"
        class="image-container-scale"
        :style="imageContainerScaleStyle"
      >
        <!-- <img class="image-container-scale__logo" :src='activeTeam.file.name' alt=""> -->
        <div
          ref="logo"
          :style="logoStyle"
          class="image-container-scale__logo"
        ></div>
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
          @click="psoitonLogo"
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
  props: ["scale"],
  data() {
    return {
      scaleOfComposition: 20,
      backgroundImageURL: "",
      isLoadingImage: false,
      logoParameters: {
        distanceFromCenterX: 0,
        distanceFromCenterY: 0,
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
    psoitonLogo() {
      let style = getComputedStyle(this.$refs.logo);
      let left =
        width / 2 -
        this.logoParameters.distanceFromCenterX -
        parseInt(style.width);
      let top =
        height / 2 -
        this.logoParameters.distanceFromCenterY -
        parseInt(style.height);
      this.$refs.logo.style.left = `${left}px`;
      this.$refs.logo.style.top = `${top}px`;
    },
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
      return { transform: `scale(${this.scale / 100})` };
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
      proxy.logoParameters.distanceFromCenterX = param.distanceFromCenterX;
      proxy.logoParameters.distanceFromCenterY = param.distanceFromCenterY;
      //proxy.psoitonLogo();
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


.image-container, .image-not-loaded, .image-loading
    background-color rgba(157,157,157,0.3)
    display flex
    flex-direction column
    justify-content center
    align-items center
    box-shadow 0px 4px 17px 10px rgba(0, 0, 0, 0.25)
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
