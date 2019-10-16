<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="普通版" name="benz">
        <benZappInfo :f-org-sign="fOrgSign"/>
      </el-tab-pane>
      <el-tab-pane label="日产版" name="gqns">
        <benZappInfo :f-org-sign="fOrgSign"/>
      </el-tab-pane>
      <el-tab-pane label="投屏接收端" name="screen">
        <benZappInfo :f-org-sign="fOrgSign"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import benZappInfo from './components/appInfo'
export default {
  components: {
    benZappInfo
  },
  data() {
    return {
      activeName: 'benz',
      fOrgSign: 'benz'
    }
  },
  methods: {
    handleClick(tab, event) {
      this.fOrgSign = tab.name
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-tabs{
    width:96%;
    margin:0 auto;
  }
</style>
