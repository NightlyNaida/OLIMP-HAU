<template>
  <div class="range-container">
      <p class="range-caption">Размер лого</p>
      <p class="range-value">{{valueView}}</p>
      <input @input="notifyAboytChangeValue" type="range" :min="min" :max="max" v-model="value">
  </div>
</template>

<script>
export default {
  props: ['min','max','defaultValue'],
  events: ['value-change'],
  data(){
    return {
      value: 0,
    }
  },
  computed:{
    valueView(){
      return this.value + '%';
    }
  },
  methods:{
    notifyAboytChangeValue(){
      this.$emit('value-change',this.value);
    }
  },
  mounted(){
    this.value = this.defaultValue; 
  }
}
</script>

<style lang="stylus" scoped>
  .range-container
    width 250px
    position relative
    height 100%
    display grid
    grid-grid-template-rows 1fr 1fr
    grid-grid-template-columns 1fr 1fr
    grid-template-areas "caption value"\
                        "input input"
    color white
  
  input[type="range"]
    width 100%
    margin 0
    grid-area input

  .range-caption, .range-value
    margin 0

  .range-caption
    grid-area caption
    display flex
    align-items flex-end
    font-size 14px
    color grey

  .range-value
    width 100%
    grid-area value
    text-align right
    font-weight 500
    font-size 20px
</style>