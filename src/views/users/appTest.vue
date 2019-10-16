<template>
  <el-row class="appTest">
    <el-col :span="2" class="imagesContent" />
    <el-col :span="18">
      <div class="contents">
        <dl class="content">
          <dt>
            <h1>步骤一：</h1>
            <p>首先打开手机【设置】</p>
          </dt>
          <dd>
            <img src="@/assets/images/iphones/iphone1.png" alt >
          </dd>
        </dl>
        <dl class="content contentImg">
          <dt>
            <h1>步骤二：</h1>
            <p>找到【通用】</p>
          </dt>
          <dd>
            <img src="@/assets/images/iphones/iphone2.png" alt >
          </dd>
        </dl>
      </div>
      <dl class="content">
        <dt>
          <h1>步骤三：</h1>
          <p>然后找到【设备管理】，然后选择信任刚下载的软件即可</p>
        </dt>
        <dd class="imgcon">
          <img src="@/assets/images/iphones/iphone3.png" alt >
          <img src="@/assets/images/iphones/iphone4.png" alt >
          <img src="@/assets/images/iphones/iphone5.png" alt >
        </dd>
      </dl>
    </el-col>
    <el-col :span="2" />
  </el-row>
</template>
<style lang='scss' scoped>
// @media screen and (max-width: 600px) {// }
@media screen and (max-width: 1280px) {
  .appTest {
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: scroll;
    background: #222;
  }
  img {
    width: 280px;
    height: 500px;
    border-radius: 4px;
    margin-left: 60px;
  }
  .imagesContent {
    margin-left: 0px;
    margin-top: 20px;
  }
  .content {
    display: flex;
    .imgcon {
      display: flex;
      img {
        margin-left: -10px;
      }
    }
    h1 {
      color: #fff;
    }
    p {
      color: #fff;
      font-size: 18px;
    }
    dd {
      margin-top: 10px;
    }
  }
}
.appTest {
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
  background: #222;
}
.contents {
  display: flex;
  .contentImg {
    margin-left: 120px;
  }
}
img {
  width: 154px;
  height: 335px;
  border-radius: 4px;
  margin-left: 50px;
}
.imagesContent {
  margin-left: 0px;
  margin-top: 20px;
}
.content {
  display: flex;
  h1 {
    color: #fff;
  }
  p {
    color: #fff;
    font-size: 18px;
  }
  dd {
    margin-top: 10px;
  }
}
@media screen and (max-width: 1920px) {
  .appTest {
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: scroll;
    background: #222;
  }
  .contents {
    display: flex;
  }
  img {
    width: 154px;
    height: 335px;
    border-radius: 4px;
    margin-left: 50px;
  }
  .imagesContent {
    margin-left: 0px;
    margin-top: 20px;
  }
  .content {
    display: flex;
    h1 {
      color: #fff;
    }
    p {
      color: #fff;
      font-size: 18px;
    }
    dd {
      margin-top: 10px;
    }
  }
}
</style>
