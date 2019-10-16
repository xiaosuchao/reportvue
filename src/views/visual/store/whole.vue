<template>
  <section class="main"><div class="drag-box-left"><div class="drag-title">shit~拖动排序</div>
    <div
      v-for="(list,index) in data1"
      :key="list.id"
      class="drag-list"
      draggable="true"
      @dragenter="ondragenter($event,index,list)"
      @dragleave="ondragleave($event,index,list)"
      @drop="ondrop($event,index,list)"
      @dragover="ondragover"
      @dragstart="ondragstart($event,index,list)"
      @dragend="ondragend($event,index,list)">{{ list.title }}</div>
  </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      dragElement: null,
      index: null,
      list: null,
      lock: true,
      data1: [
        { id: 1, title: '1', type: 'bg' },
        { id: 2, title: '2', type: 'bg' },
        { id: 3, title: '3', type: 'bg' },
        { id: 4, title: '4', type: 'fe' },
        { id: 5, title: '5', type: 'fe' },
        { id: 6, title: '6', type: 'fe' }
      ]
    }
  },
  methods: {
    // ondragstart - 用户开始拖动元素时触发
    // ondrag - 元素正在拖动时触发
    // ondragend - 用户完成元素拖动后触发
    // ondragenter - 当被鼠标拖动的对象进入其容器范围内时触发此事件
    // ondragover - 当某被拖动的对象在另一对象容器范围内拖动时触发此事件
    // ondragleave - 当被鼠标拖动的对象离开其容器范围内时触发此事件
    // ondrop - 在一个拖动过程中，释放鼠标键时触发此事件
    ondragstart(ev, index, list) {
      const self = this
      self.dragElement = ev.target
      self.oldIndex = index
      self.oldList = list
    },
    ondragend(ev, index, list) {
      ev.preventDefault()
    },
    ondragenter(ev, index, list) {
      const self = this
      if (self.oldIndex !== index) {
        ev.target.style.backgroundColor = '#999'
      }
    },
    ondragover(ev) {
      ev.preventDefault()
    },
    ondragleave(ev, index, list) {
      ev.target.style.backgroundColor = '#fff'
    },
    ondrop(ev, index, list) {
      const self = this
      if (self.oldIndex !== index && self.oldList.type === list.type) {
        // 当前拖动不等于拖动目标位置
        this.data1.splice(self.oldIndex, 1)
        this.data1.splice(index, 0, self.oldList)
        self.oldIndex = null
        self.oldList = null
      } else if (self.oldList.type !== list.type) {
        ev.preventDefault()
        alert('我是泳池排队最帅的，不能插队')
      }
      ev.target.style.backgroundColor = '#fff'
    }
  }
}
</script>

<style scoped>
  .drag-box-left {
    float: left;
    width: 45%;
  }
  .drag-box-right {
    float: right;
    width: 45%;
  }
  .drag-list {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 20px;
    transition: border 0.3s;
  }
  .drag-list:hover {
    border: 1px solid #20a0ff;
  }
  .drag-title {
    font-weight: 400;
    line-height: 25px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
  }
</style>
