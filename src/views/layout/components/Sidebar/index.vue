<template>

  <!-- <div class="sliderout">
    <div class="platname bgblue" style="height:8%;">
      <img src="" alt="">
      <div class="txt">
        U客智能数字展厅<br>

      </div>
    </div> -->
  <el-scrollbar wrap-class="scrollbar-wrapper ">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :default-openeds="openeds"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <!-- <sidebar-item v-for="route in sideRouters" v-show="route.meta.home===activeTopMenu" :key="route.name" :item="route" :base-path="route.path"/> -->
      <sidebar-item v-for="route in sideRouters" :key="route.name" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
  <!-- </div> -->

</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  data() {
    return {
      openeds: ['0', '1', '2', '3']
    }
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar',
      'activeTopMenu',
      'sideRouters'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    // console.log(this.sideRouters)
  }
}
</script>
