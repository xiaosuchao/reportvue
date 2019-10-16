<template>
  <div class="mainheader">
    <div v-if="avatar" class="logBox">
      <img
        :src="avatar+'?imageView2/1/w/80/h/80'"
        style="display:block;width:40px;height:40px"
        class="user-avatar"
      >
    </div>
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      class="el-menu"
      mode="horizontal"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item
        v-for="route in topRouters"
        :key="route.name"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <div class="userBox">
          <p>
            <img src="@/assets/images/userPic.png" >
          </p>
          <p class="username">{{ userRealName }}</p>
        </div>
        <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown" style="background:#c1c1c1;">
        <router-link target="_blank" class="inlineBlock" to="/downloadApp">
          <el-dropdown-item style="float:right">app下载</el-dropdown-item>
        </router-link>
        <router-link class="inlineBlock" to="/editInfo" >
          <el-dropdown-item>修改资料</el-dropdown-item>
        </router-link>
        <el-dropdown-item>
          <span style="display:block;" @click="logout">退出登录</span>
        </el-dropdown-item>
        <!-- <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            管理中心
          </el-dropdown-item>
        </router-link>-->
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import SidebarItem from './SidebarItem'
import { mapGetters } from 'vuex'
import store from '@/store'

export default {
  components: { SidebarItem },
  // name: 'MainHeader',
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'topRouters',
      'activeTopMenu',
      'avatar',
      'name',
      'userRealName'
    ])

  },
  created() {
  },
  methods: {
    actTop(actcode) {
      store.dispatch('SET_TOPACTIVE', actcode)
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.mainheader {
  height: 56px;
  background: rgb(48, 65, 86);
  position: fixed;
  left: 0;
  right: 0;
  z-index: 9;
  position: relative;
  .logBox {
    position: absolute;
    top: 9px;
    left: 8px;
    width: 40px;
    height: 40px;
    img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  ul {
    display: flex;
    line-height: 48px;
    color: #c5c5c5;
    margin-left: 180px;
    position: relative;
    z-index: 9998;
    li {
      margin-right: 16px;
      padding: 0 10px;
      cursor: pointer;
    }
    .active {
      background: #d64635;
      color: #fff;
    }
  }
  .userBox {
    height: 48px;
    display: flex;
    align-items: center;
    p {
      img {
        display: block;
        width: 36px;
        height: 36px;
        margin-right: 6px;
      }
    }
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    z-index: 9999;
    top: 0;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .username {
        line-height: 50px;
        font-size: 16px;
        color: #fff;
      }
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 18px;
        font-size: 12px;
      }
    }
  }
}
</style>

