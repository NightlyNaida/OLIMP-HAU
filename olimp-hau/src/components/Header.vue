<template>
  <header>
        <nav>
            <button :ref="'button'+index" :data-page="page[1]" @click="buttonClick" :key="index" :data-key="index" class="nav-link" v-for="(page,index) in pages">{{page[0]}}</button>
            <div ref="marker" class="marker"></div>
        </nav>
  </header>
</template>

<script>
export default {
    data(){
        return{
            selctedButtonId: 0,
            pages:[['Генератор','generator'],['События','events'],['Логотипы','logos']]
        }
    },
    emits:['change-page'],
    methods:{
        notifyAboutChangePage(page){
            this.$emit('change-page',page);
        },
        changeMarkerPosition(buttonId){
            this.$refs[`button${this.selctedButtonId}`].classList.remove('nav-link-selected');
            this.$refs[`button` + buttonId].classList.add('nav-link-selected');
            this.$refs['marker'].style.left = (this.$refs[`button` + buttonId].getBoundingClientRect().left -70) + 'px';
            this.selctedButtonId = buttonId;
        },
        buttonClick(e){
            this.changeMarkerPosition(e.target.dataset.key);
            this.notifyAboutChangePage(e.target.dataset.page);
        }
    },
    mounted(){
        this.changeMarkerPosition(this.selctedButtonId);
    }
}

let buttonComponent = {
    props: ['caption', 'dataPage'],
    template: '<button class="nav-link" :data-page="dataPage">{{caption}}</button>',
}
</script>

<style lang="stylus" scope>
    big-shadow = 0px 4px 17px 10px rgba(0, 0, 0, 0.25)
    color-white = #FAFAFA
    color-red-gradient = linear-gradient(90.11deg, #6C1010 0%, #841111 100%);
     

    nav-button-height = 30px
    nav-button-width = 150px

    header
        background color-red-gradient
        height 70px
        padding 0 70px
        border-radius 0 0 20px 20px
        box-shadow big-shadow
        position relative
        display flex
        align-items center

    nav
        grid-column 1/3
        display grid
        grid-template-columns repeat(3,nav-button-width)
        grid-gap 30px
        align-items center
        z-index 2
        position relative

    .nav-link
        background-color rgba(255,255,255,0)
        border 1px solid rgba(255,255,255,0)
        color color-white
        font-size 16px
        font-weight normal
        height nav-button-height
        border-radius 50px
        transition all .2s ease-in
        padding-bottom 3px

    .nav-link-selected
        color #6C1010

    .nav-link:hover
        border 1px solid rgba(255,255,255,0.3)

    .marker
        position absolute
        z-index -1
        height nav-button-height
        width nav-button-width
        background-color color-white
        border-radius 50px
        top: 50%
        margin-top -(nav-button-height / 2)
        transition all .5s ease-in-out
        opacity 0.9
        box-shadow 3px 2px 9px rgba(0, 0, 0, 0.25)
        left 0px
        
</style>