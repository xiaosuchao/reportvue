<template>

  <div class="visualmenu">
    <el-menu
      :default-openeds="openeds"
      default-active="0-0"
      background-color="#fff"
      @open="handleOpen"
      @close="handleClose">
      <el-submenu v-for="(menugroup,i) in menulist" :key="'mg'+i" :index="i+''">
        <template slot="title">
          <i :class="menugroup.menuIcon"/>
          <span>{{ menugroup.menuName }}</span>
        </template>

        <template v-for="(menuitem,mi) in menugroup.children">
          <el-menu-item :key="menuitem.menuId" :depth="menuitem.organizationHierarchy*1" :confurl="menuitem.configFileUrl" :index="i+'-'+mi" @click="selMenuItem">{{ menuitem.menuName }}</el-menu-item>
        </template>

      </el-submenu>
    </el-menu>
  </div>

</template>

<style lang="scss" scoped>
.el-menu{border-right: none;
  .el-scrollbar__bar{ display: none;}
  .is-horizontal{display: none;}
}

</style>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import { visualMenu } from '@/api/visual'

export default {
  components: { SidebarItem },
  data() {
    return {
      openeds: ['0'],
      menulist: []
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
    console.log('sildebar created')
    visualMenu().then(res => {
      this.menulist = res.data
      console.log('this.menulist', this.menulist)
      if (this.menulist.length && this.menulist[0].children && this.menulist[0].children.length) {
        const nodedefault = this.menulist[0].children[0]
        if (nodedefault.configFileUrl) {
          this.$emit('postnode', nodedefault)
          console.log('nodedefault', nodedefault)
        }
      }
    })
    // console.log(this.sideRouters)
  },
  methods: {
    handleOpen() {

    },
    handleClose() {

    },
    selMenuItem(node) {
      if (node.$vnode.data.attrs.confurl) {
        this.$emit('postnode', { configFileUrl: node.$vnode.data.attrs.confurl, organizationHierarchy: node.$vnode.data.attrs.depth })
      }
    }
  }
}
</script>
