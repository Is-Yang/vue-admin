<template>
  <div class="poster__list m20" ref="posterList">
    <bread-crumb :dataIsArr="false" breadName="poster"></bread-crumb>

    <div class="common-inner minh750">
      <!-- tab -->
      <tabs-scrm @tabChange="tabChange" :tabs="tabs"></tabs-scrm>

      <!-- 标签 -->
      <tags
        :tag-type="2"
        :tags="tagsTree"
        :showEdit="showTagEdit"
        :configs="configTag"
        @changeTag="changeTag"
        :options="{'showCount': true}"
      ></tags>

      <search-bar size="small" class="poster_search_bar" @find="findSearch" @clear="clearSearch">
        <el-form :inline="true" class="search__form">
          <el-form-item label="搜索内容" class="mr80 search_input">
            <el-input v-model="search.title" size="small" placeholder="海报名称"></el-input>
          </el-form-item>
          <el-form-item label="状态" class="mr80" v-show="currentTab == '0'">
            <el-select v-model="search.status" size="small" @change="statusChange" placeholder="全部">
              <el-option
                v-for="item in statusOptions"
                :key="item.val"
                :label="item.label"
                :value="item.val"
              ></el-option>
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
          <el-button
            plain
            size="medium"
            v-show="currentTab == '0'"
            round
            icon="el-icon-plus"
            @click="addPoster"
          >添加海报模板</el-button>

          <el-button
            plain
            size="small"
            style="width:70px;"
            :class="{'hot_current': this.search.sort == 0}"
            v-show="currentTab == '1'"
            round
            @click="changesort(0)"
          >最新</el-button>
          <el-button
            plain
            size="small"
            style="width:70px;"
            :class="{'hot_current': this.search.sort == 1}"
            v-show="currentTab == '1'"
            round
            @click="changesort(1)"
          >最热</el-button>
        </div>
        <div slot="template" class="clearfix">
          <div
            class="inline__block"
            v-for="(item, index) in dataList"
            :key="index"
            :style="{'width': colsStyle}"
            style="text-align:center;"
          >
            <template-view 
              :item="item" 
              :title="defaultOpt.title"
              :scene="defaultOpt.scene"
              :img-height="templateOpt.imgHeight"
              :shelf="templateOpt.shelf"
              :default-opt="defaultOpt"
              showHot>
              <div slot="operate">
                <div class="outer_parent" v-show="currentTab == '0'">
                  <el-button plain size="mini" round  @click="previewDialog(item)">预览</el-button>
                  <el-button plain size="mini" round @click="editPoster(item)">编辑</el-button>
                  <el-button plain size="mini" round v-show="item.status == 1 || item.status == 3" @click="updata(item, 'up')">上架</el-button>
                  <el-button plain size="mini" round v-show="item.status == 2" @click="updata(item, 'down')" >下架</el-button>
                  <el-button plain size="mini" round @click="deleFn(item)">删除</el-button>
                </div>
               
                <el-row v-show="currentTab == '1'">
                  <el-col :span="12">
                    <el-button plain size="mini" round @click="previewDialog(item)">预览</el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-button type="primary" size="mini" round @click="downloadFile(item)">下载源文件</el-button>
                  </el-col>
                </el-row>
              </div>
            </template-view>
          </div>
        </div>
      </table-template>

      <preview-poster v-if="showPreview" :src="posterUrl" @close="closePreview"></preview-poster>
    </div>
  </div>
</template>

<script>
import * as Http from "@/api/marketTool";
import Tags from "../component/tag/Tags";
import {mapActions} from 'vuex';
import TemplateView from "../component/TemplateView";
import PreviewPoster from "../component/PreviewPoster"; // 海报预览
import CommonService from "@/utils/commonService/index"; // 公用方法
export default {
  components: { Tags, TemplateView, PreviewPoster},
  data() {
    return {
      tabs: [{ title: "我的海报", name: "0" }, { title: "海报库", name: "1" }],
      tagsTree: [],
      configTag: {
        id: "org_template_tag_id",
        name: "tag_name",
        count: "count",
        childs: "childs"
      },
      search: {
        title: "", // 搜索的标题
        status: "", // 搜索的状态
        time: "", // 搜索的时间
        tag: "", // 搜索的标签
        sort: "" // 海报图文库中的 1最热  默认最新
      },
      statusOptions: [], // 搜索下拉列表
      templateOpt: {
        // 模板的字段显示
        imgHeight: 210, // 图文的高度计算
        shelf: true
      },
      defaultOpt: {
        title: "title",
        time: "created_date",
        photo_url: "photo_url",
        hot: "temp_num"
      },
      page: { page: 1, page_size: 20, total: 0 },
      tempCols: 0, // 列数。去获取page_size的值
      colsStyle: "",
      dataList: [],
      currentTab: 0,
      filter: {}, // 过滤
      showTagEdit: true, // 是否显示编辑按钮
      showPreview: false, // 海报预览
      posterUrl: '', // 海报预览url
    };
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.getCol();
    this.initFilter(); // 先获取列，
    this.getMyList(); // 先获取列
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
    initSerach() {
      this.search = Object.assign(this.search, {
        title: "",
        status: "",
        time: "",
        tag: "",
        hot: ""
      });
    },
    initFilter() {
      this.page = { page: 1, page_size: this.tempCols == 3? 18: 20, total: 0 };
      this.filter = { page: 1, pageSize: this.tempCols == 3? 18: 20 };
    },
    getMyList(params = {}) {
      // 获取我的海报
      this.$store.dispatch('openLoading', 'full');
      this.filter = Object.assign(this.filter, params);
      Http.getPosterList(this.filter).then(res => {
        this.$store.dispatch('closeLoading', 'full');
        this.$handleResponse(res, res => {
          const {tags, status} = res.options;
          const {result, total, page } = res.list;
          this.tagsTree = tags?tags: [];
          this.statusOptions = status?status: [];
          this.statusOptions.unshift({label: "全部", val: ''});
          
          this.dataList = result?result: [];
          this.page.total = total?total:0;
          this.page.page = page?page:1;
        });
      }).catch((res)=>{
        this.$store.dispatch('closeLoading', 'full');
      });
    },
    getCenterList(params = {}) {
      // 获取海报库
      this.$store.dispatch('openLoading', 'full');
      this.filter = Object.assign(this.filter, params);
      Http.getPosterCenter(this.filter).then(res => {
        this.$store.dispatch('closeLoading', 'full');
        this.$handleResponse(res, res => {
          const {tags, status} = res.options;
          const {result, total, page} = res.list;
          this.tagsTree = tags?tags:[];
          this.statusOptions = status?status:[];
          this.dataList = result?result:[];
          this.page.total = total?total:0;
          this.page.page = page?page:1;
        });
      }).catch((res)=>{
        this.$store.dispatch('closeLoading', 'full');
      });
    },
    tabChange(item) {
      this.dataList = []; // 置空
      this.currentTab = item;
      this.initSerach(); // sort 需要在图文库中为赋值，所以放在前面 最新 最热
      this.initFilter();
      if (item == 1) {
        // 图文库
        this.showTagEdit = false; // 不显示编辑按钮
        this.templateOpt.shelf = false;
        this.configTag.id = "tag_id";
        this.search.sort = 0;
        this.defaultOpt = { photo_url: "poster_show", time: "created_at",hot: "temp_hot", title: "poster_title",scene: "poster_scene"}; // 海报库
      } else {
        this.showTagEdit = true; // 不显示编辑按钮
        this.templateOpt.shelf = true;
        this.configTag.id = "org_template_tag_id";
        this.defaultOpt = { photo_url: "photo_url",time: "created_date",hot: "temp_num",title: "title",scene: "scene"}; //我的海报
      }
      this.getTagList();
    },
    changeTag(id) {
      this.search.tag = id;
      this.getTagList();
    },
    statusChange(val) {
      // 状态的更改
      this.search.status = val;
    },
    changesort(item) {
      // 海报库切换 最新，最热搜索
      this.search.sort = item; // 赋值
      this.findSearch();
    },
    findSearch() {
      this.getTagList(); //
    },
    clearSearch() {
      this.initSerach();
      this.initFilter();
      this.getTagList();
    },
    getTagList() {
      // 获取哪一种接口
      const { title, status, time, tag, sort } = this.search;
      if (this.currentTab == 1) {// 图文库
        let params = {
          tag_id: tag == "" ? null : tag,
          keyword: title ? title.trim() : null,
          sort: sort ? sort : null // 1为最热  默认最新
        };
        this.getCenterList(params);
      } else {
        let params = {
          tag_id: tag == "" ? null : tag,
          title: title ? title.trim() : null,
          status: status == "" ? null : status, // 排查0
          created_date_start: time ? time[0] : null,
          created_date_end: time ? time[1] : null
        };
        this.getMyList(params);
      }
    },
    changePage(item) {
      this.page = Object.assign(this.page, item);
      this.filter["page"] = this.page.page;
      this.filter["pageSize"] = this.page.page_size;
      this.getTagList();
    },
    getCol() {
      let width = this.$refs["posterList"].getBoundingClientRect().width;
      let cols = Math.floor(width / 300); // 300 为每个模板的框框
      this.tempCols  = cols <= 3 ? 3 : cols;
      this.colsStyle = 100 /  this.tempCols  + "%";
      this.templateOpt.imgHeight = Math.floor((width * (100 /this.tempCols/100) * 0.9 - 11) * 1.7813);
      // width 总长，(100 /cols) 每一列的宽， 0.9 每个字展示占父元素0.9, 经过测试-11 后更符合比例 1.7813为宽高的长宽比例
      this.page.page_size = this.tempCols == 3? 18: 20; // 要么3列，要么4, 5列
      this.filter["pageSize"] = this.tempCols == 3? 18: 20;
    },
    handleResize() {
      this.getCol();
    },
    addPoster() {
      this.$router.push("/marketTool/template/poster/add");
    },
    downloadFile(item) { // 海报库 下载模板
      CommonService.download.downloadPoster(item,'full_upload_files',()=>{ this.$message.error('下载出错了')});
    },
    editPoster(item){
      this.$router.push('/marketTool/template/poster/edit/'+ item.org_template_msg_id);
    },
    previewDialog(item){
      if(this.currentTab == 1){ // 海报库
        this.posterUrl = item['poster_show'];
      }else {
        this.posterUrl = item['photo_url'];
      }
      this.showPreview=true;
    },
    closePreview(){ //海报预览关闭
      this.showPreview=false;
    },
    updata(item, type){ // 上下架
      let tip = type =='up'? "上": '下';
      this.$confirm('您确定要' + tip +'架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // status, //  2 立即上架 3暂不上架 
        Http.updataImgText(item.org_template_msg_id,{'status': type=='up'?2:3}).then((res)=>{
          this.$handleResponse(res, res=>{
            this.getTagList();
          })
        })
      }).catch(() => {});
    },
    deleFn(item){ // 删除
      this.$confirm('请确认删除该海报?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Http.delePoster(item.org_template_msg_id).then((res)=>{
          this.$handleResponse(res, res=>{
            this.getTagList();
          })
        })
      }).catch(() => {

      });
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
    // this.$eventHub.$off('getNav');
  }
};
</script>

<style lang="scss" scoped>
.poster__list {
  .search__form {
    .mr80 {
      margin-right: 80px;
    }
  }
  .table_list_box {
    padding: 0 20px;
  }
  .search_input {
    padding-left: 10px;
  }
  .outer_parent{
    display:flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    line-height: 50px;
  }
}

.poster__list .table__tools .el-button {
  color: #3a8ee6;
  border-color: #3a8ee6;
}

.poster__list .table__tools .el-button.hot_current {
  background: #3a8ee6;
  color: #fff;
}

// .poster__list .search__form /deep/ .search_input /deep/.el-form-item__content{
//   width: 250px;
// }
// .poster__list .search__form /deep/.el-select{
//   width: 250px;
// }

.poster__list .search__form .el-date-editor.el-input__inner {
  width: 220px;
}

.poster__list .poster_search_bar /deep/.el-button--primary {
  width: 90px;
}
</style>

