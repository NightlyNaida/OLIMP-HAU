<template>
 <div class="container">
    <url-form @new-image="newImage" @team-without-logo="addNewTeam" class="url-form"></url-form>
    <logo-loader :active-team-logo-parameters="activeTeamLogoParameters" @send-logo="sendLogo" @logo-size="logoSize" @change-scale="changeScaleToActiveTeamLogo" @change-active-team="changeActiveTeam" @logo-load="addNewLogoToTeam" v-if="Object.keys(teamsNeedForLogo).length > 0" :teams="teamsNeedForLogo"></logo-loader>
    <div class="images">
      <img v-for="(url,i) in readyImages" :key="i" :src="url" alt="">
    </div>
 </div>
</template>

<script>
import urlForm from './parts/urlForm.vue';
import logoLoader from './parts/logoLoader/logoLoader.vue';
import workWithServer from '../workWithServer.js';
export default {
  data(){
    return {
      teamsNeedForLogo: {},
      activeTeam: '',
      readyImages:[],
    }
  },
  components: {urlForm, logoLoader },
  methods:{
    addNewTeam(team){
      this.teamsNeedForLogo[team] = {};
      this.teamsNeedForLogo[team]['logoFileURL'] = '';
      this.teamsNeedForLogo[team]['logoScale'] = 100;  
    },
    addNewLogoToTeam(file){
      this.teamsNeedForLogo[this.activeTeam].file = file;
      this.teamsNeedForLogo[this.activeTeam].logoFileURL = URL.createObjectURL(file);
      console.log(`new logo loaded for team ${this.activeTeam}`,file);
    },
    deleteTeam(key){
      this.teamsNeedForLogo.splice(key,1)
    },
    changeActiveTeam(team){
      this.activeTeam = team;
    },
    changeScaleToActiveTeamLogo(value){
      this.teamsNeedForLogo[this.activeTeam].logoScale = parseInt(value);
    },
    logoSize(size){
      this.teamsNeedForLogo[this.activeTeam].size = size;
    },
    sendLogo(){
      let form = new FormData();
      form.append('nameOfTeam',this.activeTeam);
      form.append('imageFile', this.teamsNeedForLogo[this.activeTeam].file);

      let logoWidth = this.teamsNeedForLogo[this.activeTeam].size.width * (this.teamsNeedForLogo[this.activeTeam].logoScale / 100);

      let logoHeight = this.teamsNeedForLogo[this.activeTeam].size.height * 
                      (this.teamsNeedForLogo[this.activeTeam].logoScale / 100);

      form.append('width', logoWidth);
      form.append('height',logoHeight);

      workWithServer.sendLogo(form)
        .then(request => console.log(request));
    },
    newImage(url){
      this.readyImages.push(url);
    }
  },
  computed:{
    activeTeamLogoParameters(){
      if (this.teamsNeedForLogo[this.activeTeam]){
        return {
          url: this.teamsNeedForLogo[this.activeTeam].logoFileURL,
          scale: this.teamsNeedForLogo[this.activeTeam].logoScale
        }
      }
      else return ' ';
    }
  }
}
</script>

<style lang="stylus" scoped>
    .container 
        padding 70px

    .url-form
      margin-bottom 50px

    .images
      display flex
</style>