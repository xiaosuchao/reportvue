<template>
  <div :class="classObj" class="app-wrapper" @click="submitOrder">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <Mainheader />

    <sidebar class="sidebar-container" />
    <div class="main-container">
      <navbar />
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, Mainheader } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Mainheader
  },
  mixins: [ResizeMixin],
  data() {
    return {
      overTimer: null, // 超时定时器
      isOvertime: false// 是否超时
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  created() {
    // 开启定时器
    this.overTimer = setTimeout(() => {
      this.isOvertime = true
    }, 7200000)
  },
  destroyed() {
    // 销毁定时器
    clearTimeout(this.overTimer)
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    },
    submitOrder() {
      // 判定是否超时
      if (this.isOvertime) {
        this.$message.error('登陆超时，请重新登陆')
        localStorage.removeItem('carStoreName')
        localStorage.removeItem('carStoreid')
        this.$store.commit('SET_TOKEN', '')
        this.$store.commit('SET_ROLES', [])
        setTimeout(() => {
          this.$store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          }, 5000)
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
