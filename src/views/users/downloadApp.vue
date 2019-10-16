<template>
  <div style="width:100%;height:100%;background:#222">
    <el-row class="content">
      <span v-show="showInfo" style="width:100%;height:100%;background:#999;color:#fff;font-size:16px;background:#999">
        <time style="padding-left:10px;">
          点击右上角按钮，然后在弹框的菜单中，点击Safari中打开，即可安装。
        </time>
        <img style="margin-right:35px;" src="@/assets/images/top_point.png" alt >
      </span>
    </el-row>
    <el-row class="container">
      <el-col :span="7" />
      <el-col :span="9">
        <div class="leftMain">
          <h1>
            <div class="logoBox">
              <img :src="'/static/skins/' +sysinfo.organizationTemplate+'/images/logo.png'" alt >
            </div>智能展厅
          </h1>
          <div class="downloadBox">
            <div v-if="showWindows" class="iphone">
              <dl style="width:230px" @click="downWindow">
                <dt>
                  <img style="display:block;width:40px;height:40px" src="@/assets/images/windows.png" >
                </dt>
                <dd>
                  <p>
                    <a>点击安装Windows版</a>
                  <!-- <a :href="downloadIos">iOS版</a> -->
                  </p>
                <!-- <a href="https://www.pgyer.com/PQij">点击安装iOS版</a> -->
                <!-- <a href="itms-services://?action=download-manifest&url=https://xxx/taigan_ios.plist">iOS版下载</a> -->
                </dd>
              </dl>
              <div class="erweiama" style="margin-left:18.5%">
                <!-- <img :src="ios" class="android" alt> -->
                <p class="img">
                  <img :src="Window" class="iPhone" alt >
                </p>
                <p style="color:#fff;text-align:center">
                  扫描二维码下载Windows版
                  <br >

                </p>
              </div>
            </div>
            <div v-if="showIOS" class="iphone">
              <dl @click="downIos">
                <dt>
                  <img style="display:block;width:40px;height:40px" src="@/assets/images/iphones.png" >
                </dt>
                <dd>
                  <p>
                    <a>点击安装iOS版</a>
                  <!-- <a :href="downloadIos">iOS版</a> -->
                  </p>
                <!-- <a href="https://www.pgyer.com/PQij">点击安装iOS版</a> -->
                <!-- <a href="itms-services://?action=download-manifest&url=https://xxx/taigan_ios.plist">iOS版下载</a> -->
                </dd>
              </dl>
              <div class="erweiama">
                <!-- <img :src="ios" class="android" alt> -->
                <p class="img">
                  <img :src="ios" class="iPhone" alt >
                </p>
                <p style="color:#fff;text-align:center">
                  扫描二维码下载苹果版
                  <br >
                  <a
                    style="padding-bottom:2px; border-bottom:1px solid #fff"
                    @click="appTest"
                  >app添加信任？</a>
                </p>
              </div>
            </div>
            <div v-if="showAndriods" class="andriod">
              <dl style="width:190px;" @click="downAndroid">
                <dt style="margin-left:10px;">
                  <img src="@/assets/images/andrions.png" >
                </dt>
                <dd>
                  <p style="margin-left:15px;">
                    <a>点击安装android版</a>
                  <!-- <a :href="downloadAndroid">android版</a> -->
                  </p>
                </dd>
              </dl>
              <div class="androids">
                <img :src="android" style="display:block;width:120px;height:120px" class="android" alt >
                <p style="color:#fff;text-align:center;width:100px">
                  扫描二维码下载安卓版
                  <br >（非微信扫描）
                </p>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="2" />
      <div class="rightMain">
        <img :src="'/static/skins/' +sysinfo.organizationTemplate+'/images/img.png'" style="display:block;width:260px;height:450px;" alt >
      </div>
      <el-col :span="8" />
    </el-row>
  </div>
</template>
<script>
import { getqrcode } from '@/api/users'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      ios: '',
      android: '',
      downloadAndroid: '',
      showIOS: false,
      showInfo: false,
      downloadIos: '',
      showAndriod: false,
      OrgSign: 'benz',
      iosType: 'iOS',
      showWindows: false,
      Window: '',
      downloadWindows: '',
      showAndriods: false
    }
  },
  computed: {
    ...mapGetters([
      'sysinfo'
    ])
  },
  created() {
    this.deviceInfo()
    this.getqrcode()
    console.log(this.sysinfo)
  },
  methods: {
    appTest() {
      this.$router.push({ path: '/appTest' })
    },
    getqrcode() {
      var data = { width: 200, height: 200, domainName: window.location.hostname }
      if (window.location.host.indexOf('dongfeng') > -1) {
        // data.OrgSign = 'gqns'
        // delete data.OrgSign
        // data.domainName = window.location.hostname
      }
      if (window.location.hash.indexOf('type=screen') > -1) {
        delete data.domainName
        data.OrgSign = 'screen'
      } else if (window.location.hash.indexOf('type=gqns') > -1) {
        data.OrgSign = 'gqns'
        delete data.domainName
      }
      console.log(data)
      getqrcode(data).then(res => {
        this.ios = res.data.ios.qrCode
        this.downloadIos = res.data.ios.dowloadUrl
        if (this.showIOS && this.$route.query.ios == 1) {//eslint-disable-line
          window.location.href = this.downloadIos
        }
        if (res.data.ios) {
          this.showIOS = true
        }
        if (res.data.windows) {
          this.showWindows = true
        }
        // if (res.data.android) {
        //   this.showAndriod = true
        // }
        console.log(this.showIOS)
        this.Window = res.data.windows.qrCode
        this.downloadWindows = res.data.windows.dowloadUrl
        this.android = res.data.android.qrCode
        this.downloadAndroid = res.data.android.dowloadUrl
      })
    },
    deviceInfo() {
      var ua = navigator.userAgent.toLowerCase()
      const isWeiXin = () => { return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1 }
      if (isWeiXin()) {
        this.showInfo = true
        this.showAndriods = false
        this.showIOS = true
        // alert('点击右上角按钮，然后在弹框的菜单中，点击Safari中打开，即可安装。')
      } else {
        if (/iphone|ipad|ipod/.test(ua)) {
          this.showAndriod = false
          this.showAndriods = false
          this.showIOS = true
        } else {
          this.showIOS = false
          this.showAndriods = true
          this.showAndriod = true
        }
      }
    },
    // getAndroids() {
    //   if (window.location.host.indexOf('dongfeng') > -1) {
    //     this.OrgSign = 'gqns'
    //   }
    //   if (window.location.hash.indexOf('type=screen') > -1) {
    //     this.OrgSign = 'screen'
    //   } else if (window.location.hash.indexOf('type=gqns') > -1) {
    //     this.OrgSign = 'gqns'
    //   }
    //   getAndroid({ width: 200, height: 200, OrgSign: this.OrgSign }).then(res => {
    //     this.android = res.data.qrCode
    //     this.downloadAndroid = res.data.androidUrl
    //   })
    // },

    downAndroid() {
      window.location.href = this.downloadAndroid
    },
    downWindow() {
      window.location.href = this.downloadWindows
    },
    downIos() {
      console.log(111)
      console.log(this.downloadIos)
      window.location.href = this.downloadIos
    }
  }
}
</script>
<style lang="scss" scoped>
@media screen and (max-width: 750px) {
  .container {
    overflow: hidden;
    .leftMain {
      margin-left: -5px;
      h1 {
        width: 230px;
        margin-left: -20px;
      }
      .iphone {
      }
    }
  }
  .rightMain {
    display: none !important;
  }
}
.content{
  height:20%;
  display:flex;
  justify-content: center;
  align-items:center;
  span{
    display:flex;
    justify-content: center;
    align-items:center;
    img{
      display:block;
      width:20px;
      height:30px;
      margin-top:-20px;
    }
  }
}
.container {
  background: #222;
  display: flex;
  align-items: center;
  justify-content: center;

  .leftMain {
    .erweiama,
    .androids {
      width: 110px;
      float: left;
      p {
        font-size: 14px;
      }
    }
    .erweiamas {
      width: 110px;
      display: block;
    }
    .androids {
      margin-left: 110px;
    }
    h1 {
      color: #fff;
      display: flex;
      align-items: center;
      .logoBox {
        margin-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          display: block;
          width: 50px;
          height: 50px;
        }
      }
    }
    .downloadBox {
      display: flex;
      .iphone {
        dl {
          dd {
            width: 60%;
          }
        }
        .erweiama {
          margin-left: 12.5%;
          margin-top: -14px;
          .img {
            width: 120px;
            height: 120px;
            background: #fff;
            position: relative;
            img {
              width: 100%;
              height: 100%;
              position: absolute;
              top: 50%;
              left: 50%;
              margin-left: -60px;
              margin-top: -60px;
            }
          }
        }
      }
      .andriod {
        .androids {
          margin-left: 16%;
        }
      }
      dl:nth-child(1) {
        dt {
          img {
            display: block;
            width: 40px;
            height: 40px;
            margin-left: -23px;
          }
        }
        dd {
          margin-left: -44px;
          margin-right: -15px;
        }
      }
      dl {
        display: flex;
        justify-content: space-around;
        margin-right: 20px;
        border: 1px solid #ccc;
        width: 170px;
        height: 60px;
        border-radius: 10px;
        &:nth-child(2) {
          dt {
            margin-left: 10px;
          }
          dd {
            p {
              margin-left: 10px;
            }
          }
        }
        dt {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 25%;
        }
        dd {
          width: 80%;
          display: flex;
          // justify-content: center;
          align-items: center;
          color: #fff;
          font-size: 14px;
          margin-left: 0px;
          flex-direction: row;
          flex-wrap: wrap;
          a {
            display: block;
          }
        }
      }
    }
  }
}
</style>
