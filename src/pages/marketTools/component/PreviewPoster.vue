<template>
  <el-dialog :visible.sync="dialogVisible" :close-on-click-modal='false'  class="poster__preview" width="400px">
    <div class="por">
      <i class="el-icon-close poa poster_close" @click="close()"></i>
    </div>
    <img class="poster_img" :src="src">
  </el-dialog>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data(){
    return{
      dialogVisible: true
    }
  },
  methods: {
    close(){
      this.$emit("close", false)
    }
  }
}
</script>

<style lang="scss" scoped>
.poster__preview{
  .poster_close {
    top: -18px;
    right: -60px;
    font-size: 20px;
    border-radius: 50%;
    background: #fff;
    padding: 5px;
    cursor: pointer;
  }
  .poster_img{
    width: 100%;
    height: auto;
    -o-object-fit: cover;
    object-fit: cover;
    -o-object-position: center;
    object-position: center
  }
}

.poster__preview /deep/ .el-dialog__header {
  display: none;
}

.poster__preview /deep/ .el-dialog__body {
  padding: 20px;
}
</style>
