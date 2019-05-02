<template>
  <el-dialog class="market_tag_dialog" :title="title" width="950px" visible @close="closeDialog('no')">
    <!-- 内层弹窗 -->
    <el-dialog
      width="480px"
      :title="innerInfo.title"
      :visible.sync="innerInfo.visible"
      append-to-body>
      <el-input v-model.trim="innerInfo.text" placeholder="请输入"></el-input>
      <div slot="footer" class="dialog-footer text-center mb10">
        <el-button style="width: 90px;" type="primary" size="medium" :loading="isLoading" round @click="saveInnerData()">保存</el-button>
        <el-button style="width: 90px;" @click="innerInfo.visible=false" size="medium" round>取 消</el-button>
      </div>
    </el-dialog>
 
    <div v-loading="reloading" class="tree__box clearfix">
      <el-row>
        <el-col :span="12">
          <el-button type="primary" size="medium" round icon="el-icon-plus" @click="tagsFn({}, {}, 'mainAdd')">添加主标签</el-button>
        </el-col>
        <el-col :span="12" class="text-right por">
          <el-input class="search_text" size='medium' v-model="filterText"  placeholder="标签名称搜索"></el-input>
          <i class="el-icon-search search_text_icon poa"></i>
        </el-col>
      </el-row>
      <div class="mt30">
        <el-tree
          ref="tagTree"
          class="tag_tree tag_tree_none"
          :data="treeData"
          node-key="id"
          default-expand-all
          :props="defaultProps"
          :filter-node-method="filterNode"
          :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span v-show="node.childNodes && node.childNodes.length == 0">
              <el-checkbox v-model="data.checkbox" v-show="showCheckbox">{{ node.label }}</el-checkbox>
              <span v-show="!showCheckbox">{{ node.label }}</span>
            </span>
            <span v-show="node.childNodes && node.childNodes.length > 0">{{ node.label }}</span>
            <span>
              <a v-show="node.level && node.level == 1" class="a_style mr20" @click="() => tagsFn(node,data,'add')">添加</a>
              <a class="a_style mr20" @click="() => tagsFn(node, data,'edit')">编辑</a>
              <a class="a_style mr20" @click="() => deleTag(node, data,'dele')">删除</a>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <div slot="footer" v-show="showfooter" class="dialog-footer text-center mb10">
      <el-button style="width: 90px;" type="primary" size="medium" round @click="closeDialog('yes')">确定</el-button>
      <el-button style="width: 90px;" @click="closeDialog('no')" size="medium" round>取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as Http from '@/api/marketTool';
export default {
  props: {
    seleTags: {
      type: Array,
      default() {
        return [];
      }
    },
    title: {
      type: String,
      default: "标签管理"
    },
    showfooter: { // 是否显示
      type: Boolean,
      default: false
    },
    showCheckbox: { // 是否显示checkbox
      type: Boolean,
      default: false
    },
    configs: {
      type: Object,
      default(){
        return {
          id: 'org_template_tag_id',
          label:'tag_name',
          children: 'childs'
        }
      }
    },
    tagType: { // 1 软文，2 海报 默认1
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      innerInfo: { // 内层弹窗信息
        visible: false,
        title: '标签',
        text: '',
        type: 'add', // 弹窗出现
      },
      treeData: [], // 数组数据
      currentData: [],
      currentNode: [],
      seleData: [], 
      defaultProps: { // 默认属性需要这几个属性
        children: 'children',
        label: 'label',
        id: 'id'
      },
      isOperate: false, // 有增，删，编辑过的动作标识
      isLoading: false, // 防止重复提交
      reloading: false, // 初始出现弹窗
      filterText: '',
    }
  },
  created(){
    this.defaultProps = Object.assign(this.defaultProps, this.configs); // 重新定义取的值
    this.getTagList();
  },
  watch: {
    filterText(val) {
      this.$refs.tagTree.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data[this.defaultProps.label].toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
    closeDialog(type) {
      if(type == 'yes'){ // 确定按钮点击
        this.seleData = [];
        this.findCheck(this.treeData);
        if(this.seleData && this.seleData.length == 0){
          this.$message.error('您还没有选择标签！请选择标签');
          return;
        }
        this.$emit("closeDialog", 'success',this.seleData);
      }else{ // 取消按钮点击
        if(this.showfooter){
          // 显示底部的话，右上角单纯关闭 
          this.$emit("closeDialog", 'cancel', []);
        }else {
          // 没有显示底部，右上角点击关闭按钮，但有增，删，改过后，需要在图文列表页面(或海报列表页面) 重新请求数据，刷新标签
          if(this.isOperate){
            this.$emit("closeDialog", 'success',[]); // 没有底部的时候，编辑后的需要刷新
          }else {
            this.$emit("closeDialog", 'cancel', []);
          }
        } 
      }
    },
    // 遍历获取选中的值
    findCheck(data){
      if(data && data.length){
        for(let i=0; i< data.length; i++){
          if(data[i] && data[i].checkbox){
            // this.seleData.push(data[i]);
            this.seleData.push(data[i]);
          }
          if(data[i][this.defaultProps.children] && data[i][this.defaultProps.children].length){
            this.findCheck(data[i][this.defaultProps.children]);
          }
        }
      }
    },
    tagsFn(node, data, type){
      this.innerInfo.visible = true; // 弹窗出现
      this.innerInfo.type = type; // 类型
      this.innerInfo.title = type=='mainAdd'?"添加主标签":(type=='add'?'添加副标签':(type =='edit'?'编辑标签': '删除标签'));
      this.innerInfo.text = type=='edit'? data[this.defaultProps.label]:'';
      this.currentData = data; // 当前的数据
      this.currentNode = node; // 当前的节点
    },
    saveInnerData(){
      if(this.innerInfo.type=='mainAdd'){
        this.addTag();
      }else if(this.innerInfo.type=='add'){
        this.addTag();
      }else if(this.innerInfo.type=='edit'){
        this.updateTag();
      }
    },
    getTagList(){
      this.reloading = true;
      Http.getTagList({'type': this.tagType}).then(res => {
        this.reloading = false;
        this.$handleResponse(res, res=>{
          this.treeData = res.tree;
          if(this.seleTags && this.seleTags.length && this.treeData && this.treeData.length){
            for(let i=0; i<this.seleTags.length; i++){
              this.setInItTree(this.seleTags[i][this.defaultProps.id],this.treeData)
            }
          }
        });
      }).catch(()=>{this.reloading = false;});
    },
    setInItTree(id, treeData){
      for(let i=0; i< treeData.length; i++){
        if(treeData[i][this.defaultProps.children] && treeData[i][this.defaultProps.children].length){
          this.setInItTree(id, treeData[i][this.defaultProps.children]);
        }else if(treeData[i][this.defaultProps.id] == id){
          this.$set(treeData[i], 'checkbox', true);
        }
      }
    },
    addTag(){
      if(!this.innerInfo.text){
        this.$message.error('标签不为空');
        return;
      }
      let params = { 
        tag_name: this.innerInfo.text, // 标签名
        tag_type: this.tagType, // 标签类型 1软文  2海报  默认1
        pid: this.currentData[this.defaultProps.id]?this.currentData[this.defaultProps.id]: null, // 标签上级
      };
      this.isLoading = true;
      Http.addTag(params).then(res =>{
        this.isLoading = false;
        this.$handleResponse(res, res=>{
          this.isOperate = true; // 列表时表示有过更新，刷新一下页面
          this.innerInfo.visible = false;
          if(this.innerInfo.type=='mainAdd'){
            // 成功后
            let newChild = {};
            newChild[this.defaultProps.id] = res[this.defaultProps.id];
            newChild[this.defaultProps.label] = this.innerInfo.text;
            newChild[this.defaultProps.children] = [];
            if(this.treeData){
              this.treeData.push(newChild);
            }else { // 没有标签时，添加主标签时treeData 为null
              this.treeData = [];
              this.treeData.push(newChild);
            }
            this.innerInfo.visible = false;
          }else {
            // 请求成功后 执行
            if(this.currentData && this.currentData.checkbox){
              this.currentData.checkbox = false;
            }
            let newChild = {};
            newChild[this.defaultProps.id] = res[this.defaultProps.id];
            newChild[this.defaultProps.label] = this.innerInfo.text;
            newChild[this.defaultProps.children] = [];

            if(!this.currentData[this.defaultProps.children]) {
              this.$set(this.currentData, this.defaultProps.children, []);
            }
            this.currentData[this.defaultProps.children].push(newChild);
            this.innerInfo.visible = false; 
          }
          
        });
      }).catch(()=>{this.isLoading = false;})
    },
    updateTag(){
      if(!this.innerInfo.text){
        this.$message.error('标签不为空');
        return;
      }
      this.isLoading = true;
      Http.updateTag(this.currentData[this.defaultProps.id],{'tag_name': this.innerInfo.text}).then(res =>{
        this.isLoading = false;
        this.$handleResponse(res, res=>{
          this.isOperate = true; // 列表时表示有过更新，刷新一下页面
          // 请求接口成功后，执行
          this.currentData[this.defaultProps.label] = this.innerInfo.text;
          this.innerInfo.visible = false;
        })
      }).catch(()=>{this.isLoading = false;})
    },
    deleTag(node, data, type){
      this.currentData = data; // 当前的数据
      this.currentNode = node; // 当前的节点
      this.$confirm('确定删除标签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Http.deleTag(this.currentData[this.defaultProps.id]).then(res =>{
          this.$handleResponse(res, res=>{
            this.isOperate = true; // 列表时表示有过更新，刷新一下页面
            // 成功后执行 目前只有两级，并且后端只能从删除子标签开始
            
            const parent = node.parent;
            const children = parent.data[this.defaultProps.children] || parent.data;
            const index = children.findIndex(d => d[this.defaultProps.id] == data[this.defaultProps.id]);
            children.splice(index, 1);
          })
        });
      }).catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.market_tag_dialog {
  .tag_tree{
    border: 1px solid #eee;
    border-bottom: 0px solid #eee;
    min-height: 50px;
    max-height: 550px;
    overflow-y: auto;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .tree__box{
    min-height: 150px;
  }
  .search_text{
    width: 300px;
  }
  .search_text_icon{
    right: 10px;
    top: 10px;
    font-size: 18px;
    cursor: pointer;
  }
}

.market_tag_dialog .tag_tree /deep/.el-tree-node__content {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #eee;
}
.market_tag_dialog .tag_tree /deep/.el-tree__empty-block{
  border-bottom: 1px solid #eee;
}

.market_tag_dialog /deep/.search_text .el-input__inner{
  border-radius: 30px;
}

</style>
