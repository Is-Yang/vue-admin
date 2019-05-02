<template>
  <div class="poster__handle m20">
    <bread-crumb :dataIsArr="false" isBack :breadName="posterType"></bread-crumb>

    <div class="common-inner minh750">
      <el-container class="poster_box">
        <el-aside width="400px" class="poster_aside">
          <img v-show="form.photo_url" class="post_img" :src="form.photo_url">
          <div v-show="!form.photo_url">
            <p>海报展示区</p>
            <p>海报宽/高比为0.5613; 建议尺寸宽/高: 750px * 1336px </p>
          </div> 
        </el-aside>
        <el-container class="poster_contain">
           <div class="step-common step_first" v-loading="uploadLoading">
             <step :step="{'title': '第一步', 'content': '海报内容'}"></step>
             <el-form class="mt30" size="small" ref="form" :model="form" :rules="rules" label-width="110px">
              <el-form-item label="海报标题" prop="title" required>
                <el-input style="width:480px;" v-model="form.title" placeholder="30个字符以内"></el-input>
              </el-form-item>
              <el-form-item label="使用场景" prop="scene">
                <el-input style="width:480px;" v-model="form.scene" maxlength="20"  placeholder="20个字符以内"></el-input>
              </el-form-item>
              <el-form-item label="上传展示图" prop="photo_url" required>
                <el-upload
                  class="upload-demo"
                  :action="imgUploadUrl"
                  :before-upload="beforeAvatarUpload"
                  :headers="uploadHeader"
                  name="imageFile"
                  :on-success="fileSucc"
                  :limit="10000">
                  <el-button type="primary" round @click="uploadClick('img')">选择图片</el-button>
                 </el-upload>
                <span class="tip_color tip_style">支持jpg/jpeg/gif/png/bmp格式</span>
                <div v-show="form.photo_url" class="mt20 small_photo">
                  <img class="post_img" :src="form.photo_url"/>
                </div> 
              </el-form-item>
              <el-form-item class="mb30" prop="att_url" label="上传源文件" required>
                <el-upload
                  class="upload-demo"
                  :action="fileUploadUrl"
                  :before-upload="beforeAvatarUpload"
                  :on-success="fileSucc"
                  name="file"
                  :headers="uploadHeader"
                  :limit="10000">
                  <el-button type="primary"  @click="uploadClick('file')" round>选择文件</el-button>
                 </el-upload>
                <span class="tip_color tip_style">支持zip/rar格式</span>
                <div v-show="form.att_url" class="mt20 att_style por ellipsis" :title="form.att_name">
                   {{form.att_name}} <a class="poa att_dele a_style" @click="dele('att')">删除</a>
                </div>
              </el-form-item>
             
              <step :step="{'title': '第二步', 'content': '上架范围'}"></step>
              <el-form-item class="mt30 mb30" label="上架范围" required>
                 <!-- <el-radio v-model="form.sale_target" :label="1">全部4S店</el-radio>
                 <a class="a_style">高级配置</a>
                 <div class="mt15 sale_box" v-show="seleShops && seleShops.length">
                   <div class="sale_style">
                     <p v-for="item in seleShops" :key='item'>{{item.area_name}}</p>
                   </div>
                 </div> -->
                 <shelf-area :configs="shelfConfigs"></shelf-area>
              </el-form-item>

              <step :step="{'title': '第三步', 'content': '上架确认'}"></step>
              <el-form-item class="mt30" label="海报分类" required>
                <tag-classify :tag-type="2" :config="{'name': 'tag_name'}"  size="small" type="primary" round :seleTags="seleTags"></tag-classify>
              </el-form-item>
              <el-form-item class="mb30" label="上架设置">
                 <el-radio v-model="form.status" :label="2">立即上架</el-radio>
                 <el-radio v-model="form.status" :label="3">暂不上架</el-radio>
              </el-form-item>
              <el-form-item class="mb30" label="">
                 <el-button type="primary" style="width: 85px;" :loading="isLoading" round @click="submit('form')">提交</el-button>
              </el-form-item>
            </el-form>
           </div>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import * as userInfo from '@/utils/commonService/getUserInfo'
import Request from '@/utils/request';
import Step from '../component/Step';
import TagClassify from '../component/tag/TagClassify';
import * as Http from '@/api/marketTool';
import ShelfArea from '../component/ShelfArea';
import * as HttpSetting from '@/api/setting';
// 海报的增删改查
export default {
  components:{
    Step,
    TagClassify,
    ShelfArea
  },
  data(){
    return{
      editId: '', // 编辑的id
      posterType: 'posterAdd',
      rules: {
        'title': [{required: true, message: '请输入海报名称', trigger: ['blur', 'change']},{max: 30, message: '30个字符以内', trigger: ['blur', 'change']}],
        'scene': [{max: 20, message: '20个字符以内', trigger: ['blur', 'change']}],
        'photo_url': [{required: true, message: '上传展示图必填', trigger: ['blur', 'change']}],
        'att_url': [{required: true, message: '上传源文件必填', trigger: ['blur', 'change']}],
      },
      form: {
        title: '',
        scene: '',
        photo_url:'',// 图片url http://img20.16888.com/common/20190301/6336c493fd49c4cf491255c517f49d6c.jpg
        att_url:'', // 源文件url
        att_name:'', // 上传源文件名字
        // sale_target: 1, // 1 为全体4S店  2 为自定义  移动configs 对象中取
        tag_ids: [], // 分类标签id 数组
        area_ids: [], // 上架门店Id 数组
        status: 2, //  2 立即上架 3暂不上架 
      },
      seleTags: [], // 选择的标签分类
      seleShops: [], // 选中的门店
      isLoading: false, // 防止重复提交
      imgUploadUrl: '',
      fileUploadUrl: '',
      uploadType: '', // 上传的是图片还是文件,
      uploadHeader: {'Authorization': userInfo.getAuthorization()},
      att_file_name: '', // 临时存储文件名
      uploadLoading: false, // 上传时候加载
      shelfConfigs: {
        sale_target: 1,
        relationAreasOptions:[], // 已选择
        pRelationAreasOptions:[], // 未选中
      },
    }
  },
  created(){
    this.getAreaByOrg();
    this.imgUploadUrl = window.scrmApi + 'upload/image';
    this.fileUploadUrl = window.scrmApi + "upload/file";
    if(this.$route && this.$route.params && this.$route.params.postId){
      this.posterType = "posterEdit";
      this.editId = this.$route.params.postId;
      this.queryPoster(this.editId);
    }
  },
  methods: {
    dele(type){
      if(type == 'att'){ // 删除源文件
        this.form.att_name = '';
        this.form.att_url = '';
      }
    },
    closeTag(tag, index){

    },
    submit(form){      
      if(this.isLoading){
        return;
      }
      this.$refs[form].validate((valid)=>{
        if(valid){
          const {title,scene,photo_url,att_url,att_name,status} = this.form;
          const {relationAreasOptions, sale_target} = this.shelfConfigs;

          if(this.seleTags && this.seleTags.length == 0){
             this.$message.error('标签不为空');
             return;
          }
          if(!photo_url){
             this.$message.error('封面不为空');
             return;
          }
          if(!att_url){
             this.$message.error('上传源文件不为空');
             return;
          }

          let AreaIds = [];
          if(sale_target == 2){
            if(relationAreasOptions && relationAreasOptions.length == 0){
              this.$message.error('上架范围不为空');
              return;
            }else {
              relationAreasOptions.forEach((item)=>{
                AreaIds.push(item.area_id);
              })
            }
          }
          let tagIds=[];
          this.seleTags.forEach((item)=>{
            tagIds.push(item.org_template_tag_id);
          });
         
          let params = {
            title,
            scene,
            photo_url,
            att_url,
            att_name,
            tag_ids: tagIds,
            // area_ids: [],
            status, //  2 立即上架 3暂不上架 
            sale_target,  // 1 为全体4S店  2 为自定义 
          }
          if(sale_target == 2){
            params['area_ids'] = AreaIds;
          }
          
          this.isLoading = true; // 防止重复提交
          if(this.editId){
            Http.updatePoster(this.editId,params).then((res)=>{
              this.isLoading = false;
              this.$handleResponse(res, res=>{
                this.$router.push("/marketTool/template/poster");
              })
            })
          }else {
            Http.addPoster(params).then((res)=>{
              this.isLoading = false;
              this.$handleResponse(res, res=>{
                this.$router.push("/marketTool/template/poster");
              })
            })
          }
        }else{
          this.isLoading = false;
        }
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
          this.uploadLoading = true;
        }else {
          this.$message.error('仅支持图片的格式jpg/jpeg/gif/png/bmp');
        }
      }else {
        if(fileName[fileName.length-1] && '|zip|rar|'.indexOf(fileName[fileName.length-1]) > -1){
          fileFormat = true;
          this.att_file_name = file.name;
          this.uploadLoading = true;
        }else{
          this.$message.error('仅支持源文件的格式zip/rar');
        }
      }
      return fileFormat;
    },
    fileSucc(res){
      this.uploadLoading = false;
      if(res.code == 200){
        if(this.uploadType == 'img'){
          this.form.photo_url = res.data;
          this.$refs.form.validateField('photo_url'); // 第一次校验出错时，再上传成功的时候取消
        }else if(this.uploadType == 'file'){
          this.form.att_url = res.data;
          this.form.att_name = this.att_file_name;
          this.$refs.form.validateField('att_url'); // 第一次校验出错时，再上传成功的时候取消
        }
      }else {
        this.$message.error(res.msg);
      }
    },
    queryPoster(id){
      Http.getPoster(id).then((res)=>{
        this.$handleResponse(res, res => {
          this.form = Object.assign(this.form, res); //title, scene, photo_url, att_url, att_name status sale_target
          const {tags,sale_target,sale_target_areas} = res;  
          // 剩下需要处理上线类型和 分类标签     
          this.seleTags = tags?tags:[]; // 标签
          this.shelfConfigs.sale_target = sale_target;
          this.shelfConfigs.relationAreasOptions = [];
          // 由于接口返回来的是 area_name
          if(sale_target_areas && sale_target_areas.length){
            sale_target_areas.forEach((item)=>{
              item['name'] = item['area_name'];
              item['area_id'] = JSON.stringify(item['area_id']); // 改为字符串去匹配接口（org/get-area-by-org）返回来的字符串
            })
            this.shelfConfigs.relationAreasOptions = sale_target_areas;
          }
        })
      })
    },
    getAreaByOrg(){
      HttpSetting.getAreaByOrg({}).then((res)=>{ // 这个接口返回来包括头部的信息
        this.$handleResponse(res, res => {
          if(res){
            this.shelfConfigs.pRelationAreasOptions=res;
          }else {
            this.shelfConfigs.pRelationAreasOptions=[];
          }
        })
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.poster__handle{
  .poster_box{
    padding: 30px 30px 20px 20px;
  }
  .poster_aside{
    height: 713px;
    border: 1px solid #eee;
    display: flex;
    justify-content: center;
    align-items: Center;
    flex-direction: column;
    overflow: hidden;
    text-align: center;
  }
  .post_img {
    width: 100%;
    height: auto;
    -o-object-fit: cover;
    object-fit: cover;
    -o-object-position: center;
    object-position: center;
  }
  .small_photo{
    width: 140px;
    height: 250px;
    overflow: hidden;
    border: 1px solid #eee;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .poster_contain {
    margin-left: 100px;
  }
  .step-common {
    width: 100%;
    flex: 1
  }
  .tip_style{
    font-size: 14px;
    margin-left: 15px;
  }
  .att_style{
    border: 1px solid #eee;
    height: 34px;
    line-height: 34px;
    width: 370px;
    padding: 0 55px 0 15px;
    color: #1494EB
  }
  .att_dele{
    top: 0;
    right: 18px;
  }
 
  .sale_box{
    width: 360px;
    padding: 15px 0 15px 20px;
    background: #eef3f9;
    border-radius: 5px;
    .sale_style{
      max-height: 317px;
      overflow-y: auto;
    }
  }
  .upload-demo{
    display: inline-block;
  }
}

.poster__handle /deep/.el-form .el-form-item__label{
  padding-right: 30px;
  position: relative;
}

.poster__handle /deep/.el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before {
  content: "";
}

.poster__handle /deep/.el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:after{
  content: "*";
  color: #f56c6c;
  position: absolute;
  top: 2px;
  right: 20px;
}

.poster__handle .upload-demo /deep/.el-upload-list{
  display:none;
}


</style>

