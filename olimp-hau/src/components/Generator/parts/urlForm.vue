<template>
  <div>
    <form
      :class="{ 'non-border': isLoading }"
      :style="{ borderWidth: `${borderWidthVariable}px` }"
      @submit="responseHeadImage"
    >
      <input v-model="eventLineUrl" type="url" placeholder="ссылка на линию" />
      <button @click="responseHeadImageAndChooseProcessMethod">
        <img src="../../../assets/play.svg" alt="Го" />
      </button>
      <transition name="loadbar">
        <div v-if="isLoading" class="load-bar">
          <p>Взламываем olimp.bet</p>
          <img
            class="loading-image"
            src="../../../assets/loading-arrows.svg"
            alt="loading"
          />
        </div>
      </transition>
    </form>
  </div>
</template>

<script>
import workWithServer from "../../workWithServer";
export default {
  data() {
    return {
      isLoading: false,
      borderWidthVariable: 1,
      eventLineUrl: "",
    };
  },
  methods: {
    responseHeadImageAndChooseProcessMethod(e) {
      this.isLoading = true;
      e.preventDefault();
      let proxy = this;
      workWithServer
        .getDataFromServerInObject(
          `http://127.0.0.1:3030/createImage?eventLineURL=${this.eventLineUrl}`
        )
        .then((responseObject) => {
          this.isLoading = false;
          switch (responseObject.shortContentType) {
            case "json": proxy.addTeamsNeedForLogo(responseObject.data); break;
            //case "png": proxy.encodeImage(); break;
          }
        });
    },
    addTeamsNeedForLogo(textJSON){
      let object = JSON.parse(textJSON);
      for (let key in object) {
        if (!object[key]) this.$emit("team-without-logo", key);
      }
    },
  },
  emmits: ["team-without-logo", `new-image`],
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
