<template>
  <div class="image_text m20">
    <bread-crumb :dataIsArr="false" isBack :breadName="operateType"></bread-crumb>

    <div class="common-inner minh750 image_text_box">
      <h4 class="mb10">图文列表</h4>
      <el-container class="poster_box">
        <el-aside width="230px" class="img_aside">
          <div class="img_show por" @mouseover="imgShow.left=true" @mouseout="imgShow.left=false">
            <img v-show="form.photo_url" class="img_photo" :src="form.photo_url">
            <a class="poa img_common img_dele" v-show="form.photo_url && imgShow.left" @click="deleTemp()"><i class="el-icon-delete"></i></a>
            <div class="poa img_temp text-center" :class="{'img_temp_url': form.photo_url}">
              <i class="el-icon-plus add_plus_style" @click="showTemplate()"></i>
              <P v-show="!form.photo_url" style="color: #1494EB; margin-top: 5px; cursor:pointer" @click="showTemplate()">请选择模板</P>
            </div>
          </div>
        </el-aside>
        <el-container class="img_contain">
          <div class="img_right_box">
            <div class="text_edit clearfix por">
              <div class="text_edit_title poa">
                <el-input class="text_edit_input" 
                  style="font-size: 20px;font-weight: 900;" 
                  v-model="form.title" maxlength="60" size="medium" placeholder="请输入标题"></el-input>
                <span class="poa text_length">{{form.title?form.title.length:0}}/60</span>
              </div>
              <div class="text_edit_title poa" style="top: 128px;">
                <el-input class="text_edit_input" v-model="form.author" maxlength="20" size="small" placeholder="请输入作者"></el-input>
                <span class="poa text_length">{{form.author?form.author.length:0}}/20</span>
              </div>

              <ueditor-scrm :height="370" @ready="editorReady" ref="ue"></ueditor-scrm>
            </div>
            
            <div v-loading="uploadLoading">
              <h5 class="mt30 mb20">封面 <span style="margin-left: 3px;color:#f56c6c">*</span></h5>
              <div>
                <el-upload
                  class="upload-demo"
                  :action="imgUploadUrl"
                  :before-upload="beforeAvatarUpload"
                  :headers="uploadHeader"
                  name="imageFile"
                  :on-success="uploadSucc"
                  :limit="10000">
                  <el-button type="primary" size='medium' round  @click="uploadClick('img')">选择图片</el-button>
                </el-upload>
                <el-checkbox v-model="form.is_show" class="tip_color tip_style">封面图片显示在正文中</el-checkbox>
                <div v-show="form.photo_url" class="mt20 por">
                  <div class="post_img">
                    <img class="img_photo" :src="form.photo_url"/>
                  </div>
                  <div class="poa img_common img_dele img_photo_opearte">
                    <a class="mr40" @click="showCropperDialog"><i class="el-icon-edit-outline"></i></a>
                    <a @click="delePhoto"><i class="el-icon-delete"></i></a>
                  </div>
                </div> 
              </div>
              <h5 class="mt30 mb15">摘要</h5>
              <el-input type="textarea" v-model="form.abstract"  :rows="7" placeholder="选项"></el-input>

              <el-checkbox v-model="form.from_url_show" class="mt30">原文链接</el-checkbox>
              <el-input v-show="form.from_url_show" class="mt15" size="small" v-model="form.from_url"  placeholder="200个字符以内"></el-input>

              <div class="por mt30">
                <label class="poa img_left">使用场景</label>
                <div style="margin-left: 90px">
                  <el-input  size="small" v-model="form.scene" maxlength="20" placeholder="20个字符以内"></el-input>
                </div>
              </div>

              <div class="por mt30">
                <label class="poa img_left">上传附件</label>
                <!-- <el-input class="att_name" size="small" v-model="form.att_name" maxlength="20" placeholder="20个字符以内"></el-input> -->
                <div style="margin-left: 90px;">
                  <el-upload
                    class="upload-demo"
                    :action="fileUploadUrl"
                    :before-upload="beforeAvatarUpload"
                    :headers="uploadHeader"
                    name="file"
                    :on-success="uploadSucc"
                    :limit="10000">
                    <!-- <a class="poa att_upload"  @click="uploadClick('file')">上传附件</a> -->
                    <el-button type="primary" size="medium" @click="uploadClick('file')" round>选择文件</el-button>
                  </el-upload>
                  <div v-show="form.att_url" class="mt20 att_style por ellipsis" :title="form.att_name">
                     {{form.att_name}} <a class="poa att_dele" @click="deleAttr()">删除</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="por mt30">
              <label class="poa img_left">图文分类 <span style="margin-left: 3px;color:#f56c6c">*</span></label>
              <div style="margin-left: 90px">
                <tag-classify :tag-type="1" :config="{'name': 'tag_name', 'btnName': '图文分类'}" size="medium" type="primary" round :seleTags="seleTags"></tag-classify>
              </div>
            </div>
            <div class="mt30">
              <el-button style="width: 85px;" size='medium' round @click="previewAritcle">预览</el-button>
              <el-button type="primary" style="width: 85px;" size='medium' :loading="isLoading" round @click="submit">提交</el-button>
            </div>
          </div>
        </el-container>
      </el-container>

      <!-- 选择模板 -->
      <select-template v-if="selectTemplate" :form="form" @close="closeTemplate"></select-template>

      <!-- 裁剪 -->
      <cropper v-if="showCropper" :url='form.photo_url' @close="closeCropper"></cropper>

      <!-- 预览 -->
      <preview-article v-if="showPreview" :item="form"  :configs="previewConfigs" @close="closePreview"></preview-article>
    </div>

  </div>
</template>

<script>
import * as userInfo from '@/utils/commonService/getUserInfo';
import * as Http from '@/api/marketTool';
import TagClassify from '../component/tag/TagClassify';
import SelectTemplate from '../component/SelectTemplate';
import Cropper from '../component/Cropper';
import PreviewArticle from '../component/PreviewArticle';
export default {
  components: {
    TagClassify,
    SelectTemplate,
    Cropper,
    PreviewArticle
  },
  data(){
    return{
      editId: '', // 编辑id
      operateType: 'imgTextAdd', // 面包屑类型 
      imgShow: {
        left: false,
        right: false,
      },
      url: true,
      isLoading: false, // 重复提交
      seleTags: [], // 选择的标签
      form: {
        title: '', // 标题
        author: '', // 作者
        content: '', // 正文
        is_show: false, // 是否显示封面图片(0: 不显示， 1显示);
        photo_url: '', // 封面路径
        abstract: '', // 摘要
        from_url: '', // 原文链接
        from_url_show: false, //显示原文链接
        scene: '', // 场景描述
        att_name: '', // 附件名称
        att_url: '', // 附件路径
        tag_ids: [], // 分类标签id数组
      },
      imgUploadUrl: '',
      fileUploadUrl: '',
      uploadHeader: {'Authorization': userInfo.getAuthorization()},
      uploadType: '', // 上传的是图片还是文件,
      att_file_name: '', // 临时存储文件名
      UeditorInstance: '', // ueidtor 实例化
      uploadLoading: false, // 上传时候加载
      selectTemplate: false, // 显示弹窗模板
      showCropper: false, // 显示裁剪页面
      showPreview: false, // 预览页面
      previewConfigs: {
        isShow: 'is_show',
        src: 'photo_url',
        content: 'content',
        create_time: 'create_at', // 创建时间
        author: 'author',
        title: 'title'
      },
    }
  },
  created(){
    this.imgUploadUrl = window.scrmApi + 'upload/image';
    this.fileUploadUrl = window.scrmApi + "upload/file";
    if(this.$route && this.$route.params && this.$route.params.id){ // 编辑
      this.operateType = 'imgTextEdit';
      this.editId = this.$route.params.id;
      this.queryData(this.editId);
    };

    if(this.$route && this.$route.query && this.$route.query.useTemp){ // 图文库中点击使用模板创建
      const {useTemp } = this.$route.query
      this.form = Object.assign(this.form,useTemp);
      const {isShow,cover,full_upload_files} = useTemp;      
      this.form['is_show']=isShow? true:false; // isSHow 0 和 1
      this.form['photo_url']=cover;  // 封面
      this.form['from_url_show']=source_url?true: false; //显示原文链接
      this.form['from_url']=source_url?true: false; //原文链接
      this.form['att_url'] = full_upload_files;
      // this.seleTags = JSON.parse(JSON.stringify(tags)); 图文库好像没有标签
    }
  },
  methods:{
    queryData(id){
      Http.getImgText(this.editId).then((res)=>{
        this.$handleResponse(res, res=>{
          this.form = Object.assign(this.form, res);
          const {is_show,from_url,tags} = res;
          this.form['is_show'] = is_show? true:false;
          this.form['from_url_show'] = from_url?true: false;
          this.seleTags = tags?tags:[];
          setTimeout(()=>{
            this.UeditorInstance.setContent(this.form.content); // 置空编辑框
          },1000)
        })
      })
    },
    uploadClick(type){
      this.uploadType = type;
    },
    beforeAvatarUpload(file){
      // const fileFormat = fileName[fileName.length-1] === 'xls'
      // const extension2 =  fileName[fileName.length-1]=== 'xlsx'
      // const isLt2M = file.size / 1024 / 1024 < 10
      var fileName=new Array()
      fileName =file.name.split('.');
      let fileFormat = false;
      this.uploadLoading = false;
      if(this.uploadType == 'img'){
        if(fileName[fileName.length-1] && '|jpg|jpeg|gif|png|bmp|'.indexOf(fileName[fileName.length-1]) > -1){
          fileFormat = true;
          // this.uploadLoading = true
        }else {
          this.$message.error('仅支持图片的格式jpg/jpeg/gif/png/bmp');
        }
      }else {
        if(fileName[fileName.length-1] && '|zip|rar|'.indexOf(fileName[fileName.length-1]) > -1){
          // if(fileName[0] && fileName[0].length > 20){  先注释掉长度校验
          //   this.$message.error('源文件命名长度20');
          // }else {
          //   fileFormat = true;
          //   this.att_file_name = file.name;
          // }
          fileFormat = true;
          // this.uploadLoading = true
          this.att_file_name = file.name;
        }else{
          this.$message.error('仅支持源文件的格式zip/rar');
        }
      }
      return fileFormat;
    },
    uploadSucc(res){
      this.uploadLoading = false;
      if(res.code == 200){
        if(this.uploadType == 'img'){
          this.form.photo_url = res.data;
        }else if(this.uploadType == 'file'){
          this.form.att_url = res.data;
          this.form.att_name = this.att_file_name;
        }
      }else {
        this.$message.error(res.msg);
      }
    },
    editorReady(instance){
      instance.setContent(this.form.content); // 初始化赋值 Uedit
      instance.addListener('contentChange', () => {
        this.form.content = instance.getContent();
      });
      this.UeditorInstance = instance;
    },
    deleTemp(){ // 删除整个模板
      this.$confirm('请确认删除该模板?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for(let key in this.form){  // 初始化对象
          if(key == 'is_show' || key == 'from_url_show'){
            this.form[key] = false;
          }else if(key == 'tag_ids'){
            this.form[key] = [];
          }else {
            this.form[key] = '';
          }
        }
        if(this.seleTags){
          this.seleTags.splice(0, this.seleTags.length); // 为了还在一个区域，动态变化数据
        }else {
          this.seleTags = [];
        }
        this.UeditorInstance.setContent(this.form.content); // 置空编辑框
        
      }).catch(() => {

      });
    },
    delePhoto(){ // 删除封面图
      this.form.photo_url = '';
    },
    submit(){
      if(this.isLoading){ // 防止重复提交
        return;
      }
      const {title, author,content,is_show,photo_url,abstract,from_url,scene,att_name,att_url} = this.form;
      if(!title){
        this.$message.error('标题不能为空');
        return;
      } 
      if(!author){
        this.$message.error('作者不能为空');
        return;
      }
      if(!content){
        this.$message.error('正文内容不能为空');
        return;
      }
      if(!photo_url){
        this.$message.error('封面图片不能为空');
        return;
      }
      if(!this.seleTags || (this.seleTags && this.seleTags.length == 0)){
        this.$message.error('分类标签不能为空');
        return;
      }
      let TagIds = [];
      if(this.seleTags && this.seleTags.length){
        this.seleTags.forEach((item)=>{
          TagIds.push(item.org_template_tag_id)
        })
      }

      
      let params = {
        title,
        author,
        content,
        is_show: is_show?1:0,
        photo_url,
        abstract,
        from_url,
        scene,
        att_name,
        att_url,
        tag_ids: TagIds
      }
      this.isLoading = true;
      if(this.editId){
        Http.updataImgText(this.editId,params).then((res)=>{
          this.isLoading = false;
          this.$handleResponse(res, res=>{
            this.$router.push("/marketTool/template/imageText");
          })
        }).catch(()=>{this.isLoading = false;})
      }else {
        Http.addImgText(params).then((res)=>{
          this.isLoading = false;
          this.$handleResponse(res, res=>{
            this.$router.push("/marketTool/template/imageText");
          })
        }).catch(()=>{this.isLoading = false;})
      }
    },
    previewAritcle(){ // 预览
      this.showPreview = true;
    },
    closePreview(){
      this.showPreview = false;
    },
    showTemplate(){
      this.selectTemplate = true;
    },
    closeTemplate(type, data, tab){
      if(type == 'success'){
        this.form = Object.assign(this.form, data);
        this.seleTags=[]; // 选择的标签
        if(tab == 1){ // 图文库的字段 {'time':'created_at','photo_url':'cover','des':'scene','hot': 'temp_hot'}
          const {isShow,cover,full_upload_files} = data;
          this.form['is_show'] = isShow?true:false;
          this.form['photo_url'] = cover;
          this.form['att_url'] = full_upload_files?full_upload_files:'';
        }else { // 我的图文字段  // {'time':'created_date','photo_url':'photo_url','des':'scene','hot': 'temp_num'}
          const {is_show,tags} = data;
          this.form['is_show'] = is_show?true:false;
          this.seleTags= tags?tags: [];
        }
        this.UeditorInstance.setContent(this.form.content); // 重置编辑框
      }

      this.selectTemplate = false;
    },
    showCropperDialog(){
      this.showCropper = true;
    },
    closeCropper(type, data){
      if(type == 'success'){
        this.form.photo_url = data;
      }
      this.showCropper = false;
    },
    deleAttr(){
      this.form.att_url = '';
      this.form.att_name = '';
    }
  }
}
</script>

<style lang="scss" scoped>
.image_text{
  .image_text_box{
    padding: 25px 20px 30px;
    .img_aside{
      border: 1px solid #1494EB;
      height: 113px;
      padding: 10px;
    }
  }
  .img_show{
    background: #fff;
    width: 210px;
    height: 90px;
    overflow: hidden;
  }
  .img_photo_show{
    width: 100%;
    height: 100%;
  }
  .img_photo{
    width: 100%;
    height: auto;
    -o-object-fit: cover;
    object-fit: cover;
    -o-object-position: center;
    object-position: center;
  }
  .img_common {
    text-align: center;
    background: rgba(0,0,0, .7);
    cursor: pointer;
  }
  .img_dele{
    bottom: 0;
    left: 0;
    right: 0;
    height: 26px;
    line-height: 26px;
    font-size: 15px;
    color: #fff;
    cursor:pointer;
  }
  .img_photo_opearte{
    height: 36px;
    line-height: 36px;
    cursor: default;
    right: 370px;
  }
  .img_temp{
    left: 47px;
    top: 17px;
    width: 110px;
    height: 50px;
    color: #1494EB;
    font-size: 12px;
  }
  .img_temp_add{
    text-align: center;
    color: #1494EB;
    width: 100%;
    height: 100%;
    padding-top: 25px;
    cursor: pointer;
  }
  .img_temp_url{
    top: 26px;
    height: 30px;
  }
  .add_plus_style{
    font-size: 25px;
    background: #1494EB;
    border-radius: 50%;
    color: #fff;
    padding: 5px;
    cursor: pointer;
  }
  .img_right_box{
    margin-left: 100px;
    width: 700px;
  }
  .text_edit{
    width: 680px;
  }
  .text_edit_title{
    top: 75px;
    left: 20px;
    z-index: 1002;
  }
  .text_edit_input{
    width: 640px;
  }
  .text_length{
    right: 10px;
    top: 10px;
  }
  .upload_demo{
    display: inline-block;
    margin-right: 30px;
  }
  .img_left{
    top: 5px;
    left: 0;
  }
  .att_name{
    margin-left: 90px;
    width: 530px;
  }
  .att_upload{
    color:#1494EB;
    text-decoration: underline;
    right: 0;
    top: 5px;
  }
  .upload-demo{
    display: inline-block;
    margin-right: 25px;
  }
  .post_img{
    width: 330px;
    height: 141px;
    overflow: hidden;
  }
  .att_style{
    border: 1px solid #eee;
    height: 34px;
    line-height: 34px;
    width: 100%;
    padding: 0 55px 0 15px;
    color: #1494EB
  }
  .att_dele{
    top: 0;
    right: 18px;
  }
}

.image_text /deep/ .edui-default .edui-editor-iframeholder{
  margin-top: 110px!important;
}

.image_text .text_edit_title /deep/.el-input__inner {
  border-width: 0;
  border-bottom-width: 1px;
  border-radius: 0;
  padding-left: 0;
}
.image_text .text_edit_title /deep/.el-input__inner:focus,
.image_text .text_edit_title /deep/.el-input__inner:hover{
  border-bottom-color: #dcdfe6;
}

.image_text .upload-demo /deep/.el-upload-list,
.image_text /deep/.edui-editor-bottomContainer{
  display:none;
}

</style>
