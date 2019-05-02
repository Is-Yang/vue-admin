<template>
  <div id="app">
    <router-view v-if="isView"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isView: true
    }
  },
  methods: {
    reload () {
      this.isView = false;
      this.$nextTick(() => {
        this.isView = true;
      })
    }
  }
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  min-width: 1300px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.transfer-class .el-transfer-panel{
  width: 300px;
}
.transfer-class input.el-input__inner {
  width: 100%!important;
}
</style>
