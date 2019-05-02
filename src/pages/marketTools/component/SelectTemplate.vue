<template>
  <el-dialog class="select_tem_dialog" title="选择模板" :visible.sync="dialogShow" width="1200px" :before-close="handleClose">
    <!-- tab -->
    <tabs-scrm @tabChange="tabChange" :tabs="tabs"></tabs-scrm>
    <div class="por">
      <search-bar class="poa tem__search" size="small" @find="findSearch" @clear="clearSearch">
        <el-form :inline="true" class="search__form">
          <el-form-item label="搜索内容" class="mr80 search_input" style="padding-left:10px;">
            <el-input v-model.trim="search.title" size="small" style="width: 250px;" placeholder="图文名称"></el-input>
          </el-form-item>
        </el-form>
      </search-bar> 
    </div>
    <table-template class="table_list_box" :page="page" :layoutTop="'total, prev, pager, next'" @changePage="changePage">
      <div slot="template" class="clearfix">
        <div class="inline__block" v-show="dataList && dataList.length" v-for="(item, index) in dataList" :key="index" style="width: 389px;">
          <template-view
          :item="item" 
          :img-height="148"
          :shelf="false"
          :default-opt="defaultOpt"
          showHot>
          <div slot="operate">
            <el-row class="text-center">
              <el-col :span="12">
                <el-button plain size="mini" round @click="previewArticle(item)">预览</el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" size="mini" round @click="useTemplate(item)">使用</el-button>
              </el-col>
            </el-row> 
          </div>
          </template-view>
        </div>
        <div v-show="dataList && dataList.length == 0" class="search_none_data" style="margin-right: 30px;">暂无数据</div>
      </div>
    </table-template> 

    <preview-article v-if="showPreview" :item="previewItem"  :configs="previewConfigs" @close="closePreview"></preview-article>
  </el-dialog>
</template>

<script>
import * as Http from '@/api/marketTool';
import TemplateView from './TemplateView';
import PreviewArticle from './PreviewArticle';
export default {
  components: { TemplateView, PreviewArticle },
  props: {
    form: {
      type: Object,
    }
  },
  data(){
    return {
      dialogShow: true,
      tabs: [{title: "我的图文", name: "0"},{title: "图文库", name: "1"}],
      currentTab: '0',
      page:{page: 1,page_size: 18, total: 0},
      defaultOpt:{'photo_url':'photo_url','time':'created_date','hot': 'temp_num'},
      search: {
        title: '', // 搜索的字段
      },
      filter: {},
      dataList: [], // 数据
      showPreview: false, // 预览
      previewItem: {}, // 预览的内容
      previewConfigs: {
        isShow: 'is_show',
        src: 'cover',
        content: 'content',
        create_time: 'create_at', // 创建时间
        author: 'author',
        title: 'title'
      },
    }
  },
  created(){
    this.initFilter();
    this.getMyList();
  },
  methods: {
    initFilter(){
      this.page = { page: 1, page_size: 18, total: 0 };
      this.filter = {page: 1, pageSize: 18};
    },
    handleClose(){
      this.$emit('close','cancel',false, {}); // 单纯关闭
    },
    useTemplate(item){
      if(this.form && (this.form['title'] || this.form['author'] || this.form['content'] || this.form['photo_url'])){
        this.$confirm('选择的模板将会替换现有图文内容，您确定要使用吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.useTemplateFn(item);
        }).catch(() => {

        });
      }else {
        this.useTemplateFn(item);
      }
    },
    useTemplateFn(item){
      if(this.currentTab == '0'){
        this.$fetch.marketTool.getImgText(item.org_template_msg_id,{}).then((res)=>{
          this.$handleResponse(res, res =>{
             this.$emit('close', 'success', res, this.currentTab); // 选择使用模板 图文库有qu
          })
        })
      }else {
        this.$emit('close', 'success', item, this.currentTab); // 选择使用模板 图文库有qu
      }
    },
    getMyList(params={}){ // 获取我的图文
      this.filter = Object.assign(this.filter, params);
      Http.getImgTextList(this.filter).then((res)=>{
        this.$handleResponse(res, res=>{
          this.dataList = res.list.result;
          this.page.total = res.list.total;
          this.page.page = res.list.page;
        })
      })
    },
    getCenterList(params={}){ // 获取图文库
     
      this.filter = Object.assign(this.filter, params);
      Http.getImgTextCenterList(this.filter).then((res)=>{
        this.$handleResponse(res, res=>{
           this.dataList = res.list.result;
           this.page.total = res.list.total;
           this.page.page = res.list.page;
        })
      })
    },
    tabChange(item){
      this.search.title = '';
      this.currentTab = item;
      if(item == '1'){ // 图文库
        this.defaultOpt = {'photo_url':'cover','time':'created_at','hot':'temp_hot'};
      }else {
        this.defaultOpt = {'photo_url':'photo_url','time':'created_date','hot':'temp_num'};
      }
      this.initFilter();
      this.getTagList();
    },
    changePage(item){
      this.page = Object.assign(this.page, item);
      this.filter["page"] = this.page.page;
      this.filter["pageSize"] = this.page.page_size;
      this.getTagList();
    },
    findSearch(){
      this.getTagList(); //
    },
    clearSearch(){
      this.search.title = '';
      this.initFilter();
      this.getTagList();
    },
    getTagList(){ // 获取哪一种接口
      const {title} = this.search;
      if(this.currentTab == '1'){ // 图文库params
        let params = {
          keyword: title ? title: null,
        };
        this.getCenterList(params);
      }else{
        let params = {
          title: title?title:null,
        };
        this.getMyList(params);
      }
    },
    previewArticle(item){
      if(this.currentTab == 1){ // 图文库直接读取
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
    }
  }
}
</script>

<style lang="scss" scoped>
.select_tem_dialog {
  .table_list_box {
    margin: 40px 0 0 30px;
    min-height: 300px;
  }
  .tem__search{
    top: -11px;
    left: 0;
    z-index: 1000;
  }
  .search__bar{
    border-bottom: 0px solid #eee;
  }
} 

.select_tem_dialog /deep/.el-dialog__body{
  padding: 10px 0 30px;
  border-top: 1px solid #eee;
}

.select_tem_dialog .tem__search /deep/.el-button--primary {
  width: 90px;
}

.select_tem_dialog /deep/.lright  .el-pagination__sizes{
  display: none
}
</style>


