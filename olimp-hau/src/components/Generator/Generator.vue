<template>
 <div class="container">
    <url-form @team-without-logo="addNewTeam" class="url-form"></url-form>
    <logo-loader @logo-load="addNewLogoToTeam" v-if="Object.keys(teamsNeedForLogo).length > 1" :teams="teamsNeedForLogo"></logo-loader>
 </div>
</template>

<script>
import urlForm from './urlForm.vue'
import logoLoader from './logoLoader.vue'
export default {
  data(){
    return {
      teamsNeedForLogo: {}
    }
  },
  components: { urlForm, logoLoader },
  methods:{
    addNewTeam(team){
      this.teamsNeedForLogo[team] = {isLoaded: false};
    },
    addNewLogoToTeam(dataObject){
      this.teamsNeedForLogo[dataObject.name].file = dataObject.file;
      console.log(this.teamsNeedForLogo);
    },
    deleteTeam(key){
      this.teamsNeedForLogo.splice(key,1)
    }
  }
}
</script>

<style lang="stylus" scoped>
    .container 
        padding 70px

    .url-form
      margin-bottom 50px
</style>