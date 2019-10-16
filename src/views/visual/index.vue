<template>
  <div class="visualwrap">
    <div class="aside">
      <Sidebar @postnode="setConfURL" />
    </div>
    <div class="article">

      <drawcharts :refresh ="chartRefresh" :confurl="confurl" :orgtreedepth="orgtreedepth" @donefresh="chartRefresh=false" />
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar'
import drawcharts from './components/drawcharts'

export default {
  components: {
    Sidebar,
    drawcharts
  },
  data() {
    return {
      confurl: '',
      orgtreedepth: 0,
      showDraw: false,
      chartRefresh: false
    }
  },
  created() {

  },
  mounted() {
    const vm = this
    window.onresize = function temp() {
      vm.chartRefresh = true
    }
  },
  beforeDestroy() {
    console.log('before destoryed')
    window.onresize = () => {}
  },
  methods: {

    setConfURL(node) {
      console.log('setConfURL==================', node)
      this.confurl = node.configFileUrl
      this.orgtreedepth = parseInt(node.organizationHierarchy || 0)
      // this.confurl = 'http://localhost:9529/chart_table.js'
    }

  }
}
</script>
<style lang="scss" scoped>
.visualwrap {
    display:flex;
    .aside{
        width:200px; padding-bottom: 1200px; margin-bottom: -1200px; border-right: 1px solid #e6e6e6;

    }
    .article{ flex-grow: 1;}
}
</style>
