<template>
  <el-dialog :title="title" :visible.sync="dialogShow" 
     width="600px" :close-on-click-modal="false" :before-close="handleClose">
        
  </el-dialog>
</template>

<script>
import * as Http from '@/api/home'
export default {
    props: ['imgName'],
    inject: ['reload'],
    data() {
      return {
        title: "图片预览",
        dialogShow: true,
        loading: false,
        showImg: {},
      };
    },
    created() {
      this.viewImg(this.imgName)
    },
    methods: {
        viewImg(img){
          Http.getImg({img: img})
          .then(res => {
            this.$handleResponse(res, res => {
              console.log(res)
            });
          })
          .catch(err => {
            console.log(err);
          });
      },
      handleClose() {
        this.$emit("cancel");
      }
    }
  }
</script>

<style lang="scss">
  .taskForm {
    .el-form-item {
      width: 49%;
      display: inline-block;
    }
  }
</style>
