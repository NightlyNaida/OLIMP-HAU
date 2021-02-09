<template>
  <div>
    <header-module @change-page="changePage"></header-module>
    <keep-alive>
      <component :is="getActivePage"></component>
    </keep-alive>
  </div>
</template>

<script>
import HeaderModule from './components/Header.vue';
import GeneratorPage from './components/Generator/Generator.vue';
import EventsPage from './components/Events.vue';
import LogosPage from './components/Logos.vue';

export default {
  data(){
    return{
      activePage:'generator'
    }
  },
  computed:{
    getActivePage(){
      return `${this.activePage.toLowerCase()}-page`;
    }
  },
  methods:{
    changePage(name){
      this.activePage = name;
    }
  },
  components:{HeaderModule,GeneratorPage,EventsPage,LogosPage}
}
</script>

<style lang="stylus">
  dark-gradient = linear-gradient(110.27deg, #1A1A1A 0%, #393939 100%)
  big-shadow = 0px 4px 17px 10px rgba(0, 0, 0, 0.25)

  html, body
    padding 0
    margin 0
    font-family: 'Roboto', sans-serif;

  body
    background  dark-gradient
    height 100vh

</style>
