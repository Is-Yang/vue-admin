<template>
  <el-dialog class="cropper__dialog" :title="title" width="725px" visible @close="closeDialog()">
    
    <el-row class="cropper_row">
      <el-col :span="12">
        <h4>裁剪封面</h4>
        <div class="cropper_item cropper_left">
          <p class="text-center tip">可选择一个尺寸的封面单独裁剪</p>
          <div class="text-center">
            <el-button style="width: 70px;" :type="r==0?'primary':''" size="medium" @click="selectRatio(0)">2.35 : 1</el-button>
            <el-button style="width: 70px;" :type="r==1?'primary':''" size="medium"  @click="selectRatio(1)">1 : 1</el-button>
          </div>

          <div class="cropper_area por">
            <img id="image"  crossorigin="anonymous"  class="cropper_img">
            <img id="image1" crossorigin="anonymous"  class="cropper_img">
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <h4  class="ml20">预览封面</h4>
        <div class="cropper_item ml20 text-center">
          <p class='tip-item mt60'>封面图文(2.35:1)</p>
          <div class="mt20 cover1 cover-item" @click="selectRatio(0)">
            <div class="preview preview0"></div>
          </div>

          <p class="tip-item mt30">封面图文(1:1)</p>
          <div class="mt20 cover2 cover-item" @click="selectRatio(1)">
            <div class="preview preview1"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    
    <div slot="footer" class="dialog-footer text-center mb10">
      <el-button style="width: 90px;" type="primary" size="medium" :loading="isLoading" round @click="save()">确定</el-button>
      <el-button style="width: 90px;" @click="closeDialog()" size="medium" round>取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>

import Cropper from 'cropper'; // 裁剪js
import * as userInfo from '../../../utils/commonService/getUserInfo';
import HttpRequest from '../../../utils/request';
export default {
  props:{
    title: {
      type: String,
      default: '图片管理'
    },
    url: String
  },
  data(){
    return{
      isLoading: false,
      r: 0, // 比例
      showImg: false, // 显示图片
      croppers: [], // 设置多个
    }
  },
  mounted(){
    this.$nextTick(()=>{
      this.init(0)
    },100)
    
  },
  methods: {
    init(r){
      var images = [];
      images.push(document.querySelector('#image'));
      images.push(document.querySelector('#image1'));

      for (let i = 0; i < images.length; i++) {
        images[i].setAttribute("src", this.url);
      }
      
      var preview0 = document.querySelectorAll('.preview0');
      var preview1 = document.querySelectorAll('.preview1');
      var previews = this.r == 0 ? preview0 : preview1;
      var minAspectRatio = 0.5;
      var maxAspectRatio = 2.5;
      let self = this;

      // 设置多个cropper
      var length = images.length;
      this.croppers = [];
      var i;
      for (i = 0; i < length; i++) {
        let j = i;
        let crop = (new Cropper(images[i], {
          
          aspectRatio: j == 0 ? 2.35 : 1,
          mouseWheelZoom: false,
          guides: false,
          viewMode: 2, // 2为不超出边框
          crop(event) {
          var data = event.detail;
          let cropper = this.cropper;
          var imageData = cropper.getImageData();
          var previewAspectRatio = data.width / data.height;
         
          previews = self.r == 0 ? preview0 : preview1

          self.each(previews, function (elem) {
            var previewImage = elem.getElementsByTagName('img').item(0);
            var previewWidth = elem.offsetWidth;
            var previewHeight = previewWidth / previewAspectRatio;
            var imageScaledRatio = data.width / previewWidth;
            elem.style.height = previewHeight + 'px';
            if (previewImage) {
              previewImage.style.width = imageData.naturalWidth / imageScaledRatio + 'px';
              previewImage.style.height = imageData.naturalHeight / imageScaledRatio + 'px';
              previewImage.style.marginLeft = -data.x / imageScaledRatio + 'px';
              previewImage.style.marginTop = -data.y / imageScaledRatio + 'px';
            }

          });
          },
          ready: function () {
          previews = self.r == 0 ? preview0 : preview1
          // previews = preview0
          let cropper = this.cropper;
          var containerData = cropper.getContainerData();
          var cropBoxData = cropper.getCropBoxData();
          var aspectRatio = cropBoxData.width / cropBoxData.height;
          var newCropBoxWidth;
          if (aspectRatio < minAspectRatio || aspectRatio > maxAspectRatio) {
            newCropBoxWidth = cropBoxData.height * ((minAspectRatio + maxAspectRatio) / 2);

            cropper.setCropBoxData({
              left: (containerData.width - newCropBoxWidth) / 2,
              width: newCropBoxWidth
            });
          }

          var clone = this.cloneNode();

          clone.className = '';
          clone.style['cssText'] = (
            'display: block;' +
            'width: 100%;' +
            'min-width: 0;' +
            'min-height: 0;' +
            'max-width: none;' +
            'max-height: none;'
          );

          var previewsAll = document.querySelectorAll('.preview');
          self.each(previewsAll, function (elem) {
            elem.appendChild(clone.cloneNode());
          });
          },

          cropmove: function () {
          var cropper = this.cropper;
          var cropBoxData = cropper.getCropBoxData();
          var aspectRatio = cropBoxData.width / cropBoxData.height;

          if (aspectRatio < minAspectRatio) {
            cropper.setCropBoxData({
              width: cropBoxData.height * minAspectRatio
            });
          } else if (aspectRatio > maxAspectRatio) {
            cropper.setCropBoxData({
              width: cropBoxData.height * maxAspectRatio
            });
          }
          },
        }))
        this.croppers.push(crop);
      }

      setTimeout(() => {
        this.selectRatio(1);
        this.selectRatio(0);
      }, 100)
    },
    each(arr, callback) {
      var length = arr.length;
      var i;
      for (i = 0; i < length; i++) {
        callback.call(arr, arr[i], i, arr);
      }
      return arr;
    },
    selectRatio(r) {
      if (r == 0) {
        this.aspectRatio = 2.35 / 1
        this.showImg = true;
        let cont = document.querySelectorAll('.cropper-container')
        if (cont && cont.length) {
          cont[length - 1].style.display = 'none'
          cont[length - 2].style.display = 'block'
        }
      } else if (r == 1) {
        this.aspectRatio = 1 / 1
        this.showImg = false;
        let cont = document.querySelectorAll('.cropper-container')
        console.log("cont")
        console.log(cont)
        if (cont && cont.length) {
          cont[length - 2].style.display = 'none'
          cont[length - 1].style.display = 'block'
        }
      }
      this.r = r;
    },
    save(){
      let canvas = []
      if(!this.croppers || (this.croppers && this.croppers.length ==0)){
        return;
      }
      this.croppers.forEach(cropper => {
        canvas.push(cropper.getCroppedCanvas({
          width: cropper.getData().width, // 获取裁剪后的图片的宽，自动包含伸缩的计算
          height: cropper.getData().height, // 获取裁剪后的图片的宽，自动包含伸缩的计算
        }));
      });
      if(canvas && canvas.length && canvas[0]){
        let the_blob = this.convertBase64UrlToBlob(canvas[0].toDataURL()); // 转换为blob对象
        // let dataUrl = canvas[0].toDataURL(); // 获取url
        let arr = this.url.split('/'); // 文件名
        // let file = this.dataURLtoFile(dataUrl,arr[arr.length-1]); // 第一个参数dateUrl, 第二个文件名 转为file 文件  IE不支持file对象
        this.uploadFile(the_blob, arr[arr.length-1]);
      }else {
        this.$message.error('裁剪失败，请稍后重试')
      }
    },
    dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    uploadFile(file, filename){
      var _formData = new FormData();
      _formData.append("imageFile",file, filename);
    
      let url =  window.scrmApi + 'upload/image';
      HttpRequest.uploadPhoto(url, _formData).then((res)=>{
        this.$handleResponse(res, res =>{
          this.$emit("close", 'success', res); // 把成功的url返回去
        });
      })
      // 以下为原生写法，不需要给 setRequestheader("Content-type": 'multipart/form-data')
      // var xhr = new XMLHttpRequest();
      // xhr.open("post", window.scrmApi + 'upload/image', true);
      // xhr.setRequestHeader("Authorization",userInfo.getAuthorization());
      // xhr.send(_formData);
      // xhr.onreadystatechange = function() {
      //   if (xhr.status == 200 && xhr.readyState == 4) {
      //     let res = JSON.parse(xhr.responseText)
      //   }
      // }
    },
    closeDialog(){
      this.$emit("close", 'cancel', {});
    },
    convertBase64UrlToBlob(urlData) {
      let bytes = window.atob(urlData.split(',')[1]);
      let ab = new ArrayBuffer(bytes.length);
      let ia = new Uint8Array(ab);
      let i = 0;
      for (i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }

      return new Blob([ab], {
        type: 'image/png'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.cropper__dialog{
  .cropper_item{
    width: 315px;
    height: 400px;
    border: 1px solid #eee;
    margin-top: 20px;
  }
  .tip{
    color: #b0bac6;
    height: 50px;
    line-height: 50px;
  }
  .tip-item{
    color: #454545;
  }
  .cover-item{
    cursor:pointer;
    width: 130px;
    background: #d3d8db;
    margin-left: 93px;
    overflow: hidden;
  }
  .cover1{
    height: 55px;
  }
  .cover2{
    height: 130px;
  }
  .cropper_area{
    width: 245px;
    height: 245px;
    margin-top: 20px;
    margin-left: 35px;
    overflow: hidden;
  }
  .cropper_img{
    border: none; 
    visibility: visible; 
    margin: 0px; 
    padding: 0px; 
    position: absolute; 
    top: 0px; 
    left: 0px; 
    width: 244px; 
    height: 183px;
  }
  .preview{
    overflow: hidden;
  }        
}

.cropper__dialog /deep/ .el-dialog__header{
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}
.cropper__dialog /deep/ .el-dialog__body{
  padding: 30px;
}
.cropper__dialog .cropper_left /deep/.el-button--medium {
  padding: 10px;
}
</style>
