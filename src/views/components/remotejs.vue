<template>
  <remote-js :src="jsUrl" @load-js-finish="jsLoadCallBack"/>
</template>

<script>
export default {
  components: {
    'remote-js': {
      render(createElement) {
        var self = this
        return createElement('script', {
          attrs: { type: 'text/javascript', src: this.src },
          on: {
            load: function() {
              console.log('load js')
              self.$emit('load-js-finish')
            }
          }
        })
      },
      props: {
        src: { type: String, required: true }
      }
    }
  },
  props: {
    jsUrl: { type: String, required: true }, // 需要加载的外部url
    jsLoadCallBack: {
      type: Function,
      default: () => { console.log('default fn') }
    }
  }

}
</script>
