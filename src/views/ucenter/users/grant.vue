<template>
  <div class="app-container">
    1
  </div>
</template>

<script>
// import { getList as fetchList, addRowUser, updateRowUser, delRowUser } from '@/api/users'

const userStatusMap = {
  0: '正常',
  1: '停用'
}
export default {
  filters: {
    showstr(v, prop) {
      if (prop === 'status') { return userStatusMap[v] }
      return v
    }
  },
  data() {
    return {

    }
  },
  created() {

  },
  methods: {

  }
}
</script>
