<template>
  <div id="app">
    <div
      class="main"
      @drop="drop($event)"
      @dragstart="dragstart($event)"
      @dragover.prevent
      @dragenter.prevent
    >

      <!--draggable设置为true才可以拖动-->
      <div
        v-for="(item,index) in list"
        v-if="list"
        :ref="`box${index}`"
        :index="index"
        :key="index"
        class="box"
        draggable="true">
        <div>{{ item.title }}</div>
        <div>{{ item.content }}</div>
        <img :src="item.imgUrl" alt="海报" width="130" height="100" draggable="false">
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      list: null
    }
  },
  created() {
    const timer = setTimeout(() => {
      this.list = [
        {
          title: '海贼王1',
          content: 'one-price',
          imgUrl: 'https://up.enterdesk.com/edpic/bd/8a/ca/bd8aca7a116c0df1840412b225b46e32.jpg'
        },
        {
          title: '火影忍者2',
          content: '全村的希望',
          imgUrl: 'https://images7.alphacoders.com/303/thumb-1920-303042.png'
        },
        {
          title: '死神3',
          content: 'Bleach',
          imgUrl: 'https://up.enterdesk.com/edpic/dc/33/a1/dc33a1ee8bb76fa36c208eda48d0db47.jpg'
        },
        {
          title: '柯南4',
          content: 'Conan',
          imgUrl: 'http://img.netbian.com/file/20110424/8fa978fe788dec3409e9fa621863120b.jpg'
        }
      ]
    }, 500)
  },
  methods: {
    // 数组指定的两个元素交换位置
    swapArray(arr, index1, index2) {
      arr[index2] = arr.splice(index1, 1, arr[index2])[0]
      return arr
    },

    // 检索本身或者祖先元素是否带有某个元素
    searchParents(ele, className) {
      if (ele.className === className) {
        return {
          qualified: true,
          ele
        }
      } else if (ele.tagName.toLocaleLowerCase() === 'body') {
        return {
          qualified: false,
          ele: undefined
        }
      } else {
        // return arguments.callee(ele.parentNode, className);严格模式会报错
        return this.searchParents(ele.parentNode, className)
      }
    },

    // 拖动到目标元素事件函数
    drop(e) {
      if (this.searchParents(e.target, 'box').qualified) {
        this.swapArray(this.list, this.searchParents(e.target, 'box').ele.getAttribute('index'), e.dataTransfer.getData('index'))
      }
    },

    // 拖动开始事件函数
    dragstart(e) {
      if (e.target.className === 'box') {
        e.dataTransfer.setData('index', e.target.getAttribute('index'))
      }
    }
  }
}
</script>

<style>

  .box {
    margin-right: 20px;
    margin-bottom: 20px;
    display: inline-block;
    border: 1px solid #000;
    width: 200px;
    height: 200px;
  }

</style>
