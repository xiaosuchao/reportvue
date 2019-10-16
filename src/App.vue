<template>

  <div id="app">
    <notFound v-show="invalidRoute"/>
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import notFound from './views/404.vue'
import { getOrgInfo } from '@/api/login'

export default {
  name: 'App',
  components: {
    'notFound': notFound
  },
  data() {
    return {
      invalidRoute: false
    }
  },
  computed: {
    ...mapGetters([
      'sysinfo'
    ])
    // invalidRoute() {
    //   return !this.$route.matched || this.$route.matched.length === 0
    // }
  },
  watch: {
    // $route: {
    //   deep: true,
    //   immediate: true,
    //   handler: function(val, oldVal) {
    //     var currentPath = window.location.hash.slice(1) // 获取输入的路由
    //     if (val.fullPath !== currentPath) {
    //       this.invalidRoute = true
    //     }
    //     console.log(val)
    //   }
    // }
  },
  mounted() {
    // window.addEventListener('hashchange', () => {
    //   var currentPath = window.location.hash.slice(1) // 获取输入的路由
    //   if (this.$router.path !== currentPath) {
    //     // this.$router.push('/404')
    //     this.invalidRoute = true
    //   }
    // }, false)
    // window.addEventListener('popstate', () => {
    //   var currentPath = window.location.hash.slice(1) // 获取输入的路由
    //   console.log(currentPath, 'currentPath')
    //   this.invalidRoute = false
    //   console.log(this.$router.path, 'this.$router.path')
    //   if (this.$router.path !== currentPath) {
    //     // this.$router.push('/404')
    //     // alert(1)
    //   } else {
    //     this.$router.push('this.$router.path')
    //   }
    // }, false)
  },
  created() {
    console.log(this.sysinfo)
    console.log('./assets/skins/' + this.sysinfo.organizationTemplate + '/index.scss')

    getOrgInfo().then(res => {
      console.log('api getOrgInfo res', res)
      if (res.data === '0') {
        console.log('')
        // document.querySelector("[name='skinstyle']").setAttribute('href', '/static/skins/' + (res.data.organizationTemplate || 'dongfeng-nissan') + '/index.css')
      } else {
        this.$store.commit('SETSYSINFO', res.data)
        document.querySelector("[name='skinstyle']").setAttribute('href', '/static/skins/' + (res.data.organizationTemplate || 'benz') + '/index.css')
      }
    }).catch(e => {
    })
    // if (this.sysinfo.organizationTemplate) {
    //   // require('./assets/skins/benz/index.scss')
    //   // require('./assets/skins/' + this.sysinfo.organizationTemplate + '/index.scss')
    //   document.querySelector("[name='skinstyle']").setAttribute('href', '/static/skins/' + this.sysinfo.organizationTemplate + '/index.css')
    // }
  }
}
</script>
<style lang="scss">
  .my-el-custom-spinner .circular .path {
  background: red!important;
  background-size: 40px 40px;
  width: 40px;
  height: 40px;
  display: inline-block;
  }
</style>
