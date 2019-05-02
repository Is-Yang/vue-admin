<template>
  <div class="img__text m20" ref="imgTextList">
    <bread-crumb :dataIsArr="false" breadName="imgText"></bread-crumb>

    <div class="common-inner minh750" v-loading="">
      <!-- tab -->
      <tabs-scrm @tabChange="tabChange" :tabs="tabs"></tabs-scrm>

      <!-- 标签 -->
      <tags :tag-type="1" :tags="tagsTree" :showEdit="showTagEdit" :configs="configTag" @changeTag="changeTag" :options="{'showCount': true}"></tags>

      <search-bar size="small" class="img_search_bar" @find="findSearch" @clear="clearSearch">
        <el-form :inline="true" class="search__form">
          <el-form-item label="搜索内容" class="mr80 search_input">
            <el-input v-model="search.title" size="small" placeholder="图文名称"></el-input>
          </el-form-item>
          <el-form-item label="状态" class="mr80" v-show="currentTab == '0'">
            <el-select v-model="search.status" size="small" placeholder="全部">
              <el-option
                v-for="item in statusOptions"
                :key="item.val"
                :label="item.label"
                :value="item.val">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间" v-show="currentTab == '0'">
            <el-date-picker
              size="small"
              class="picker-date"
              v-model="search.time"
              type="daterange"
              format="yyyy-MM-dd" 
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </search-bar>   

      <table-template class="table_list_box" :page="page" :layoutTop="'total, prev, pager, next'" @changePage="changePage">
        <div slot="tools" class="table__tools">
          <el-button plain size="medium" round icon="el-icon-plus" @click="addTemplate"  v-show="currentTab == '0'">添加图文模板</el-button>
          <el-button  plain  size="small"  style="width:70px;"  :class="{'hot_current': this.search.sort == 0}"
            v-show="currentTab == '1'"  round  @click="changesort(0)">最新</el-button>
          <el-button  plain  size="small"  style="width:70px;" :class="{'hot_current': this.search.sort == 1}"
            v-show="currentTab == '1'"  round  @click="changesort(1)">最热</el-button>
        </div>
        <div slot="template" class="clearfix">
          <div class="inline__block" v-for="(item, index) in dataList" :key="index" :style="{'width': colsStyle}" style="text-align:center;">
             <template-view
              :item="item" 
              :img-height="templateOpt.imgHeight"
              :shelf="templateOpt.shelf"
              :default-opt="defaultOpt"
              :showHot="false"
            >
              <div slot="operate">
                <div class="outer_parent" v-if="currentTab == '0'">
                  <!-- status  1为已下架 2 已上架 3为待上架 -->
                  <el-button plain size="mini" round @click="previewArticle(item)">预览</el-button>
                  <el-button plain size="mini" round @click="editFn(item)">编辑</el-button>
                  <el-button plain size="mini" round v-show="item.status == 2" @click="updata(item, 'down')">下架</el-button>
                  <el-button plain size="mini" round v-show="item.status == 1 || item.status == 3" @click="adjustLine(item, 'up')">上架</el-button>
                  <el-button plain size="mini" round v-show="item.status == 2" @click="adjustLine(item,'online')">上架调整</el-button>
                  <el-button plain size="mini" round @click="deleFn(item)">删除</el-button>
                </div>
                <el-row v-if="currentTab == '1'">
                  <el-col :span="12">
                    <el-button plain size="mini" round @click="previewArticle(item)">预览</el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-button type="primary" size="mini" round @click="userTemp(item)">使用</el-button>
                  </el-col>
                </el-row> 
              </div>
              <!-- item[full_upload_file] 为图文库中字段  item[att_url]为我的图文字段 -->
              <span slot="download">
                <a class="hot_line" 
                  v-show="(currentTab == '1'&&item['full_upload_files'])||(currentTab == '0'&& item['att_url'])" 
                  @click="downloadFile(item)">下载活动方案</a>
              </span>
              <span slot="hot">
                <span class="hot_button" :class="{'pointer': currentTab == '0' && item[defaultOpt.hot]}" @click="goToStatic(item)"><i class="hot_photo"></i>{{item[defaultOpt.hot]?item[defaultOpt.hot]:0}}</span>
              </span>
             
            </template-view>
          </div>
        </div>
      </table-template>

      <!-- 预览 -->
      <preview-article v-if="showPreview" :item="previewItem"  :configs="previewConfigs" @close="closePreview"></preview-article>

      <!-- 上下架跳转 -->
      <adjust-store v-if="showAdjust" :configs="shelfConfigs" @close="closeAdjust"></adjust-store>
    </div>
  </div>
</template>

<script>
import * as Http from '@/api/marketTool';
import Tags from "../component/tag/Tags";
import TemplateView from '../component/TemplateView';
import PreviewArticle from '../component/PreviewArticle';
import {mapActions} from 'vuex';
import AdjustStore from '../component/AdjustStore';
import CommonService from "@/utils/commonService/index"; // 公用方法
export default {
  components: { Tags,TemplateView,PreviewArticle,AdjustStore },
  data(){
    return{
      tabs: [{title: "我的图文", name: "0"},{title: "图文库", name: "1"}],
      tagsTree: [],
      configTag: {
        id: "org_template_tag_id",
        name: "tag_name",
        count: 'count',
        childs: 'childs'
      },
      search:{
        title: '', // 搜索的标题
        status: '', // 搜索的状态
        time: '', // 搜索的时间
        tag: '', // 搜索的标签
        sort: '', // 图文库中 1为最热，默认最新
      },
      statusOptions: [], // 搜索下拉列表
      templateOpt: { // 模板的字段显示
        "imgHeight": 210, // 图文的高度计算
        'shelf': true
      },
      defaultOpt:{'photo_url':'photo_url','time':'created_date','hot': 'temp_num'},
      page:{page: 1,page_size: 20, total: 0},
      tempCols: 0, // 列数。去获取page_size的值
      colsStyle: '',
      dataList: [],
      currentTab: '0',
      filter: {}, // 过滤
      showTagEdit: true, // 是否显示编辑按钮
      showPreview: false, // 显示预览
      previewItem: {}, // 预览的对象
      previewConfigs: {
        isShow: 'is_show',
        src: 'cover',
        content: 'content',
        create_time: 'create_at', // 创建时间
        author: 'author',
        title: 'title'
      }, //
      shelfConfigs: { // 上下架跳转字段
        sale_target: 1,
        relationAreasOptions:[], // 已选择
        pRelationAreasOptions:[], // 未选中
      },
      showAdjust: false, // 上架的调整
      adjustItem: {}, // 当前上架的item
      adjustType: 'up', // 跳转的上架还是在架调整
      menus: []
    };
  },
  created(){
    this.getAreaByOrg(); // 上架跳转的范围
  },
  mounted(){
    window.addEventListener('resize', this.handleResize)
    this.getCol();
    this.initFilter(); // 先获取列数
    this.getMyList(); // 由于需要获取 page_size的值，所以置后调接口
  },
  watch: {
    tempCols:function(newVal, oldVal){
      if(newVal && oldVal && newVal != oldVal){ // 当展示的列表不一样的时候，需要重新调接口
        this.getTagList();
      }
    }
  },
  methods: {
    ...mapActions(['openLoading','closeLoading']),
    initSerach(){
      this.search = Object.assign(this.search, {title: '',status: '',time: '',tag: '',sort: ''});
    },
    initFilter(){
      this.page = { page: 1, page_size: this.tempCols == 3? 18: 20 , total: 0 };
      this.filter = {page: 1, pageSize: this.tempCols == 3? 18: 20};
    },
    getMyList(params={}){ // 获取我的图文
      this.$store.dispatch('openLoading', 'full');
      this.filter = Object.assign(this.filter, params);
      Http.getImgTextList(this.filter).then((res)=>{
        this.$store.dispatch('closeLoading', 'full');
        this.$handleResponse(res, res=>{
          const {tags, status} = res.options;
          const {result, total, page} = res.list;
          this.tagsTree = tags?tags:[];
          this.statusOptions = status?status:[];
          this.statusOptions.unshift({label: "全部", val: ''});
          this.dataList = result?result: [];
          this.page.total = total;
          this.page.page = page;
        })
      }).catch((res)=>{
        this.$store.dispatch('closeLoading', 'full');
      })
    },
    getCenterList(params={}){ // 获取图文库
      this.$store.dispatch('openLoading', 'full');
      this.filter = Object.assign(this.filter, params);
      Http.getImgTextCenterList(this.filter).then((res)=>{
        this.$store.dispatch('closeLoading', 'full');
        this.$handleResponse(res, res=>{
           const {tags, status} = res.options;
           const {result, total, page} = res.list;
           
           this.tagsTree = tags?tags:[];
           this.statusOptions = status?status:[];
           this.dataList = result?result:[];
           this.page.total = total;
           this.page.page = page;
        })
      }).catch((res)=>{
        this.$store.dispatch('closeLoading', 'full');
      })
    },
    tabChange(item) {
      this.dataList = []; // 切换时table情况
      this.currentTab = item;
      this.initSerach(); // sort 需要在图文库中为赋值，所以放在前面 最新 最热
      this.initFilter();
     
      if(item == 1){ // 图文库
        this.showTagEdit = false; // 不显示编辑按钮
        this.templateOpt.shelf = false;
        this.configTag.id = 'tag_id';
        this.search.sort = 0;
        this.defaultOpt = {'photo_url':'cover','time':'created_at','hot':'temp_hot'};
      }else{
        this.showTagEdit = true; // 显示编辑按钮
        this.templateOpt.shelf = true;
        this.configTag.id = 'org_template_tag_id';
        this.defaultOpt = {'photo_url':'photo_url','time':'created_date','hot':'temp_num'};
      }
      
      this.getTagList();
    },
    changeTag(id) {
      this.search.tag = id;
      this.getTagList();
    },
    changesort(item){
      // 海报库切换 最新，最热搜索
      this.search.sort = item; // 赋值
      this.findSearch();
    },
    findSearch(){
      this.getTagList(); //
    },
    clearSearch(){
      this.initSerach();
      this.initFilter();
      this.getTagList();
    },
    getTagList(){ // 获取哪一种接口
      const {title, status, time,tag, sort} = this.search;
      if(this.currentTab == 1){ // 图文库params
        let params = {
          tag_id: tag == ''?null:tag,
          keyword: title ? title.trim() : null,
          sort: sort ? sort : null // 1为最热  默认最新
        };
        this.getCenterList(params);
      }else{
        let params = {
          tag_id: tag == ''?null:tag,
          title: title?title.trim():null,
          status: status == ''?null:status,
          created_date_start: time?time[0]:null,
          created_date_end: time?time[1]:null
        };
        this.getMyList(params);
      }
    },
    changePage(item){
      this.page = Object.assign(this.page, item);
      this.filter["page"] = this.page.page;
      this.filter["pageSize"] = this.page.page_size;
      this.getTagList();
    },
    getCol(){
      let width = this.$refs['imgTextList'].getBoundingClientRect().width;
      let cols = Math.floor(width / 370); // 370 为每个模板的框框
      this.tempCols = cols <= 2 ? 3 : cols;
      this.colsStyle = 100 /this.tempCols + '%';
      this.templateOpt.imgHeight = (width*(100 / this.tempCols/100)*0.9)/2.35; 
      // width 总长，(100 /cols) 每一列的宽， 0.9 每个字展示占父元素0.9, 经过测试-11 后更符合比例 2.35:1为宽高的长宽比例
      this.page.page_size = this.tempCols == 3? 18: 20;
      this.filter["pageSize"] = this.tempCols == 3? 18: 20;
    },
    handleResize(){
      this.getCol();
    },
    addTemplate(){
      this.$router.push('/marketTool/template/imageText/add');
    },
    editFn(item){
      this.$router.push('/marketTool/template/imageText/edit/'+ item.org_template_msg_id);
    },
    downloadFile(item){
      CommonService.download.downloadPoster(item,this.currentTab == '1'?'full_upload_files':'att_url',()=>{ this.$message.error('下载出错了')});
    },
    previewArticle(item){
      if(this.currentTab == 1){
        this.previewConfigs = {  
          isShow: 'isShow',  
          src: 'cover', 
          content: 'content', 
          create_time: 'created_at', // 创建时间
          author: 'author',
          title: 'title'
        }
        this.previewItem=item;
        this.showPreview = true;
      }else {
        this.previewConfigs = { 
          isShow: 'is_show',  
          src: 'photo_url', 
          content: 'content', 
          create_time: 'created_date', // 创建时间
          author: 'author',
          title: 'title'
        }
        // 由于图文这边需要调接口获取 content，
        this.$fetch.marketTool.getImgText(item.org_template_msg_id,{}).then((res)=>{
          this.$handleResponse(res, res =>{
            this.previewItem=res;
            this.showPreview = true;
          })
        })
      }
    },
    closePreview(){
      this.showPreview = false;
    },
    deleFn(item){ // 删除
      this.$confirm('请确认删除该图文?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Http.deleImgText(item.org_template_msg_id).then((res)=>{
          this.$handleResponse(res, res=>{
            this.getTagList();
          })
        })
      }).catch(() => {

      });
    },
    updata(item, type){ // 上下架
      let tip = type =='up'? "上": '下';
      this.$confirm('您确定要' + tip +'架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // status状态(1:下架 2:上架)
        Http.updataImgText(item.org_template_msg_id,{'status': type=='up'?2:1}).then((res)=>{
          this.$handleResponse(res, res=>{
            this.getTagList();
          })
        })
      }).catch(() => {});
    },
    getAreaByOrg(){
      this.$fetch.setting.getAreaByOrg({}).then((res)=>{ // 这个接口返回来包括头部的信息
        this.$handleResponse(res, res => {
          if(res){
            this.shelfConfigs.pRelationAreasOptions=res;
          }else {
            this.shelfConfigs.pRelationAreasOptions=[];
          }
        })
      }).catch((err)=>{
        
      });
    },
    adjustLine(item, type){ // 上架调整
      this.adjustType = type;
      this.adjustItem = item; // 保存当前上架的item
      this.shelfConfigs.sale_target = item.sale_target?item.sale_target: 1; // 有些接口会为0 ，则默认所有
      this.shelfConfigs.relationAreasOptions = []; // 切换不一样的问题需要初始化
      if(item.sale_target == 2){ // 自定义
        if(item.sale_target_areas && item.sale_target_areas.length){ // 由于编辑获取的是 area_name, 上架范围的接口是 name,所以统一用name
          item.sale_target_areas.forEach((item)=>{
            if(item['area_name']){
              item['name'] = item['area_name']
            }
            item['area_id'] = JSON.stringify(item['area_id']); // 改为字符串去匹配接口（org/get-area-by-org）返回来的字符串
          })
          this.shelfConfigs.relationAreasOptions = item.sale_target_areas;
        }
      }
      this.showAdjust = true;
    },
    closeAdjust(type){
      if(type == 'update'){
        let {org_template_msg_id} = this.adjustItem; // 后端缺少一个字段 sale_target
        const {sale_target,relationAreasOptions} = this.shelfConfigs;
        let params = {
          sale_target
        }
        if(this.adjustType == 'up'){
          params['status'] = 2;
        }
        if(sale_target == 2){
          let area_ids = [];
          relationAreasOptions.forEach((item)=>{
            area_ids.push(item.area_id)
          });
          params['area_ids'] = area_ids;
        }
        this.$fetch.marketTool.updataImgText(org_template_msg_id, params).then((res)=>{
          this.$handleResponse(res, (res)=>{
            this.getTagList();
          })
        });
      }

      this.showAdjust = false; // 关弹窗
    },
    userTemp(item){ // 使用图文库中的图片
      this.$router.push({path:'/marketTool/template/imageText/add',query: { 'useTemp': item }});
    },
    goToStatic(item){
      if(this.currentTab == '0' && item[this.defaultOpt.hot]){ // 热度不为0时才跳转
        
        this.$router.push({'path': '/xg/marketing/group', query: {'title': item.title}})
        this.$eventHub.$emit('activeHeader', '/xg');    // 头部菜单 高亮当前菜单
        this.menus = JSON.parse(localStorage.getItem('catchMenus'));
        if(this.menus && this.menus.length){
          for(let i=0; i<this.menus.length; i++){
            if('/xg' == ('/' + this.menus[i].url)) {
              let child = this.menus[i].child && this.menus[i].child.length ? this.menus[i].child : []
              this.$eventHub.$emit('getNav', child, true); // 第三个参数true代表点击事件
              break;
            }
          }
        }
      }
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
    // this.$eventHub.$off('getNav');
  }
}
</script>

<style lang="scss" scoped>
.img__text{
  .search__form{
    .mr80 {
      margin-right: 80px;
    }
  }
  .table_list_box{
    padding: 0 20px;
  }
  .hot_line {
    color: #3a8ee6;
    text-decoration: underline;
    margin-right: 5px;
  }
  .search_input{
    padding-left: 10px;
  }
  .outer_parent{
    display:flex;
    align-items: center;
    justify-content: space-around;
    height: 50px;
    line-height: 50px;
  }
  .hot_button {
    color: #fff;
    display: inline-block;
    min-width: 50px;
    border-radius: 10px;
    padding: 2px 10px;
    background: #f00;
    text-align: center;
    background: linear-gradient(to right,#ff5101, #f80);
  }
  .hot_photo{
    width: 11px;
    height: 11px;
    margin-right: 5px;
    display: inline-block;
    background: url('../../../assets/images/market/hot.png')center center no-repeat;
  }
}

.img__text .table__tools .el-button{
  color: #3a8ee6;
  border-color: #3a8ee6;
}

.img__text .table__tools .el-button.hot_current{
  background:#3a8ee6;
  color: #fff;
}
// .img__text .search__form /deep/ .search_input /deep/.el-form-item__content{
//   width: 250px;
// }
// .img__text .search__form /deep/.el-select{
//   width: 250px;
// }

.img__text .search__form .el-date-editor.el-input__inner {
  width: 220px;
}

.img__text .img_search_bar /deep/.el-button--primary {
  width: 90px;
}
 
.img__text .outer_parent .el-button+.el-button {
  margin-left: 0;
}

.img__text .outer_parent .el-button--mini.is-round {
  padding: 7px 13px;
}
</style> 


