<template>
  <div class="market_tags clearfix">
    <div class="tags_label f-l" :class="{'tags_label_mini': size == 'mini', 'tags_label_small': size == 'small','tags_label_medium': size == 'medium'}">{{Toptions.title}}</div>
    
    <div class="tags_item">
      <el-button :size="size" :class="{'is_current': firstCurTag == ''}" plain v-if="Toptions.showAll" @click="select('all', {})">全部</el-button>
      <el-button :size="size" plain v-for="(item,index) in tags" :key="index"  @click="select('first', item)"  :class="{'is_current': firstCurTag == item[configs.id]}">
        {{item[configs.name]}} 
        <span v-show="Toptions.showCount">( {{item[configs.count]}})</span>
      </el-button>
      <el-button v-show="showEdit" type="text" icon="el-icon-edit" @click="editTagDialog">编辑</el-button>

      <div class="second_line" v-show="secondTags && secondTags.length">
        <el-button :size="size" plain v-for="(item,index2) in secondTags" :key="index2" @click="select('second', item)" :class="{'is_current': secondCurTag == item[configs.id]}">
          {{item[configs.name]}} 
          <span v-show="Toptions.showCount">( {{item[configs.count]}} )</span>
        </el-button>
      </div>
    </div>

    <tag-operate v-bind="$attrs" v-if="showDialog"  @closeDialog="closeDialog"></tag-operate>
  </div>
</template>

<script>
import TagOperate from './TagOperate'
export default {
  inject: ['reload'],
  components: {
    TagOperate
  },
  props:{
    tags: {
      type: Array,
      default: []
    },
    options: {
      type: Object,
      default: {}
    },
    configs: {
      type: Object,
      default: {
        id: 'id',
        name: 'name',  
        count: 'count',  
        childs: 'childs'
      }
    },
    size: {
      type: String,
      default: "small"
    },
    showEdit: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return{
      showDialog: false, // 显示新增的
      firstCurTag: '',
      secondTags: [],
      secondCurTag: '',
      currtSelect: '',
      Toptions: { showAll: true, title: '分类',  showCount: false, sendObject: false}, // showAll 为显示全部， title 为标签左侧，sendObject发送给父组件为对象
    }
  },
  mounted(){
    this.Toptions = Object.assign(this.Toptions, this.options); 
    this.$eventHub.$on("tab-change", (item) =>{
      this.initData();
    }); // 切换菜单，初始化
    this.$eventHub.$on("clear-change", (item) =>{
      this.initData();
    }); 
  },
  methods:{
    select(type, item){
      if(type == 'all'){
        this.initData();
      }else if(type == 'first'){
        this.currtSelect = item[this.configs.id];
        this.firstCurTag = item[this.configs.id];
        this.secondTags = item[this.configs.childs]?item[this.configs.childs]:[];
        this.secondCurTag = '';
      }else if(type == 'second'){
        this.currtSelect = item[this.configs.id];
        this.secondCurTag = item[this.configs.id];
      }
      this.$emit("changeTag", this.Toptions.sendObject?item:this.currtSelect); // 默认传选中的id
    },
    initData(){
      this.currtSelect = '';
      this.firstCurTag = '';
      this.secondTags = [];
      this.secondCurTag = '';
    },
    editTagDialog(){
      this.showDialog = true; // 编辑弹窗出现
    },
    closeDialog(type, item){
      if(type == 'success'){ // 有增，删，改查过，需要刷新页面
        this.reload();
      }
      this.showDialog = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.market_tags {
  .tags_label {
    text-align: center;
    padding: 0 20px;
    width: 100px;
  }
  .tags_label_mini {
    height: 28px;
    line-height: 28px;
  }
  .tags_label_small {
    height: 32px;
    line-height: 32px;
  }
  .tags_label_medium{
    height: 36px;
    line-height: 36px;
  }
  .tags_item {
    margin-left: 100px;
  }
  .is_current {
    color: #3a8ee6;
    border-color: #3a8ee6;
  }
  .second_line{
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #e4e7ed;
  }
}
</style>
