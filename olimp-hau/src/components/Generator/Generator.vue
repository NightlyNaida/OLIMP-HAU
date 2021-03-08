<template>
 <div class="container">
    <url-form @team-without-logo="addNewTeam" class="url-form"></url-form>
    <logo-loader :logo-file="takeImageFromTeam" @change-active-team="changeActiveTeam" @logo-load="addNewLogoToTeam" v-if="Object.keys(teamsNeedForLogo).length > 1" :teams="teamsNeedForLogo"></logo-loader>
 </div>
</template>

<script>
import urlForm from './parts/urlForm.vue'
import logoLoader from './parts/logoLoader/logoLoader.vue'
export default {
  data(){
    return {
      teamsNeedForLogo: {},
      activeTeam: '',
    }
  },
  components: { urlForm, logoLoader },
  methods:{
    addNewTeam(team){
      this.teamsNeedForLogo[team] = {};
      this.teamsNeedForLogo[team]['file'] = '';  
    },
    addNewLogoToTeam(file){
      this.teamsNeedForLogo[this.activeTeam].file = file;
      console.log(this.teamsNeedForLogo);
    },
    deleteTeam(key){
      this.teamsNeedForLogo.splice(key,1)
    },
    changeActiveTeam(team){
      this.activeTeam = team;
      console.log(this.activeTeam);
    },
    takeImageFromTeam(){
      if (this.teamsNeedForLogo[this.activeTeam].file){
        return this.teamsNeedForLogo[this.activeTeam].file;
      }
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