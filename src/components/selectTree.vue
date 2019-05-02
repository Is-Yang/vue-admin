<!-- 树状选择器 -->
<template>
  <el-popover
    ref="popover"
    placement="bottom-start"
    trigger="click"
    @show="onShowPopover"
    @hide="onHidePopover"
    class="selectTree re-input-placeholder"
  >
    <el-tree
      ref="tree"
      class="select-tree"
      highlight-current
      :style="`min-width: ${treeWidth}`"
      :data="data"
      :props="props"
      show-checkbox
      node-key="org_id"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :default-expand-all="true"
      :default-checked-keys="keys"
      @check="onClickNode"
      @check-change="handleCheckChange"
    ></el-tree>
    <el-input
      slot="reference"
      ref="input"
      v-model="labelModel"
      readonly="readonly"
      :style="`width: ${width}px;cursor:pointer;`"
      class="el-select basic-width"
      :class="{ 'rotate': showStatus }"
      suffix-icon="el-icon-arrow-down"
      :placeholder="placeholder"
    ></el-input>
  </el-popover>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    type: String,
    // 接收绑定参数
    value: Array,
    // 输入框宽度
    width: String,
    // 选项数据
    options: {
      type: Array,
      required: true
    },
    // 输入框占位符
    placeholder: {
      type: String,
      required: false,
      default: "请选择"
    },
    // 树节点配置选项
    props: {
      type: Object,
      required: false,
      // default: Object,
      default: () => ({
        // parent: 'parentId',
        value: "org_id",
        label: "name",
        children: "childs"
      })
    },
    keys: Array,
    init: String
  },
  // 设置绑定参数
  model: {
    prop: "value",
    event: "selected"
  },
  computed: {
    // 是否为树状结构数据
    dataType() {
      const jsonStr = JSON.stringify(this.options);
      return jsonStr.indexOf(this.props.children) !== -1;
    },
    // 若非树状结构，则转化为树状结构数据
    data() {
      if (!this.labelModel && this.init) {
        try {
          this.options.forEach(element => {
            //  this.labelModel = element.name;
            if(this.ikeys.indexOf(element.org_id) > -1){
              this.$nextTick(() => {
                this.labelModel = element.name;
              });
              throw new Error('break');
            }
            element.childs.forEach(ele => {
              if(this.ikeys.indexOf(ele.org_id) > -1){
                this.$nextTick(() => {
                  this.labelModel = ele.name;
                });
                throw new Error('break');
              }
            })
          });
        } catch (error) {
          console.log(error)
        }

      }
      return this.dataType ? this.options : this.switchTree();
    }
  },
  watch: {
    // labelModel(val) {
    //   if (!val) {
    //     this.valueModel = '';
    //   }
    //   this.valueModel = val;
    //   // this.$refs.tree.filter(val);
    // },
    value(val) {
      // this.labelModel = this.queryTree(this.data, val);
    },
  },
  data() {
    return {
      // 树状菜单显示状态
      showStatus: false,
      // 菜单宽度
      treeWidth: "auto",
      // 输入框显示值
      labelModel: "",
      // 实际请求传值
      valueModel: "0",
      ikeys: this.keys,
    };
  },
  created() {
    // 检测输入框原有值并显示对应 label
    this.ikeys = this.value;
    if (this.value) {
      this.labelModel = this.queryTree(this.data, this.value);
    }
    if(this.init){
      let selectData = this.value;
      let afterSelectData = JSON.parse(JSON.stringify(selectData));
      this.data.forEach(element => {    // 一级被禁用，且一级被勾选时，去除一级的id
        if (element.disabled && selectData.indexOf(element.org_id) > -1) {
          selectData.splice(selectData.indexOf(element.org_id), 1);
        }
        if (element.disabled && afterSelectData.indexOf(element.org_id) > -1) {
          afterSelectData.splice(afterSelectData.indexOf(element.org_id), 1);
        }
        if(selectData){
          element.childs.forEach(ele => {    
            if (ele.disabled && afterSelectData.indexOf(ele.org_id) > -1) {
              afterSelectData.splice(afterSelectData.indexOf(ele.org_id), 1);
            }
          });
        }
      });
      if (afterSelectData && afterSelectData.length) {
        let str = afterSelectData.length > 1 ? "等" : "";
        this.$nextTick(() => {
          this.labelModel = this.queryTree(this.data, afterSelectData[0]) + str;
        });
      } else {
        this.labelModel = "";
      }
    }
    // 获取输入框宽度同步至树状菜单宽度
    this.$nextTick(() => {
      this.treeWidth = `${(this.width ||
        this.$refs.input.$refs.input.clientWidth) - 24}px`;
    });
  },
  methods: {
    labelModelNull() {
      // 父组件中点击重置，将数据清空
      this.labelModel = '';
    },
    // 单击节点
    onClickNode(node) {
      this.labelModel = node[this.props.label];
      this.valueModel = node[this.props.value];
      let cNode = this.$refs.tree.getNode(node.org_id);
      let pNode = this.$refs.tree.getNode(node.org_id).parent;
      if (pNode && pNode.level == 1) {
        if (cNode.checked) {
          pNode.data.disabled = true;
        } else {
          this.data.forEach(element => {
            if (pNode.data.org_id == element.org_id) {
              pNode.data.disabled = false;
              element.childs.forEach(ele => {
                let selectData = this.$refs.tree.getCheckedKeys();
                let index = selectData.indexOf(ele.org_id);
                if (index > -1) {
                  pNode.data.disabled = true;
                }
                // this.$refs.tree.setCheckedKeys(selectData);
              });
            }
          });
        }
      }
      if (cNode.childNodes && pNode.level == 0) {
        if (cNode.checked) {
          this.data.forEach(element => {
            if (node.org_id == element.org_id) {
              element.childs.forEach(ele => {
                ele.disabled = true;
                ele.checked = false;
              });
            }
          });
        } else {
          this.data.forEach(element => {
            if (node.org_id == element.org_id) {
              element.childs.forEach(ele => {
                ele.disabled = false;
                ele.checked = false;
                console.log(this.$refs.tree.getCheckedKeys());
                let selectData = this.$refs.tree.getCheckedKeys();
                let index = selectData.indexOf(ele.org_id);
                if (index > -1) {
                  selectData.splice(index, 1);
                }
                this.$refs.tree.setCheckedKeys(selectData);
              });
            }
          });
        }
      }

      // this.$refs.tree.updateKeyChildren(node.org_id,this.$refs.tree.getNode(node.org_id).parent.data)
      // this.onClickNode(node);
      // this.onCloseTree();
      // this.$nextTick(()=> {
      //   // set input's checked property
      //   // in case parent refuses to change component's value
      //   this.$refs.tree.getNode(node.org_id).parent.data.disabled = true
      //   console.log(pid)
      //   this.data.forEach(element => {
      //     if(element.org_id == pid){
      //       console.log(element)
      //       element.disabled = true
      //       this.$set(element, 'disabled',true);
      //     }
      //   });
      // });

      this.onHidePopover();
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    // 偏平数组转化为树状层级结构
    switchTree() {
      return this.cleanChildren(this.buildTree(this.options, "0"));
    },
    // 隐藏树状菜单
    onCloseTree() {
      this.$refs.popover.showPopper = false;
    },
    // 显示时触发
    onShowPopover() {
      this.showStatus = true;
      this.$refs.tree.filter(false);
      this.$nextTick(() => {
        // this.$refs.tree.setCheckedKeys(["1"]); // treeBox 元素的ref   value 绑定的node-key
        this.$refs.tree.setCurrentKey(this.checkedKeys);
      });
      this.$refs.tree.setCurrentKey(this.checkedKeys);
      // this.$set( this.checkedKeys, this.checkedKeys[0], 1);
    },
    // 隐藏时触发
    onHidePopover() {
      let selectData = this.$refs.tree.getCheckedKeys();
      this.ikeys = selectData;
      let afterSelectData = JSON.parse(JSON.stringify(selectData));
      this.data.forEach(element => {    // 一级被禁用，且一级被勾选时，去除一级的id
        if (element.disabled && selectData.indexOf(element.org_id) > -1) {
          selectData.splice(selectData.indexOf(element.org_id), 1);
        }
        if (element.disabled && afterSelectData.indexOf(element.org_id) > -1) {
          afterSelectData.splice(afterSelectData.indexOf(element.org_id), 1);
        }
        if(selectData){
          // element.childs.forEach(ele => {    // 选择了一级，且二级被禁用，则删除二级的id
          //   if (ele.disabled && selectData.indexOf(ele.org_id) > -1) {
          //     selectData.splice(selectData.indexOf(ele.org_id), 1);
          //   }
          // });
          element.childs.forEach(ele => {    
            if (ele.disabled && afterSelectData.indexOf(ele.org_id) > -1) {
              afterSelectData.splice(afterSelectData.indexOf(ele.org_id), 1);
            }
          });
        }
        
      });

      this.showStatus = false;
      if (afterSelectData && afterSelectData.length) {
        let str = afterSelectData.length > 1 ? "等" : "";
        this.labelModel = this.queryTree(this.data, afterSelectData[0]) + str;
      } else {
        this.$nextTick(() => {
          this.labelModel = "";
        });
        this.labelModel = "";
      }
      this.$emit("tree-selected", selectData, this.type);
    },
    // 树节点过滤方法
    filterNode(query, data) {
      if (!query) return true;
      return data[this.props.label].indexOf(query) !== -1;
    },
    // 搜索树状数据中的 ID
    queryTree(tree, id) {
      let stark = [];
      stark = stark.concat(tree);
      while (stark.length) {
        const temp = stark.shift();
        if (temp[this.props.children]) {
          stark = stark.concat(temp[this.props.children]);
        }
        if (temp[this.props.value] === id) {
          return temp[this.props.label];
        }
      }
      return "";
    },
    // 将一维的扁平数组转换为多层级对象
    buildTree(data, id = "0") {
      const fa = parentId => {
        const temp = [];
        for (let i = 0; i < data.length; i++) {
          const n = data[i];
          if (n[this.props.parent] === parentId) {
            n.children = fa(n.rowGuid);
            temp.push(n);
          }
        }
        return temp;
      };
      return fa(id);
    },
    // 清除空 children项
    cleanChildren(data) {
      const fa = list => {
        list.map(e => {
          if (e.children.length) {
            fa(e.children);
          } else {
            delete e.children;
          }
          return e;
        });
        return list;
      };
      return fa(data);
    }
  }
};
</script>

<style>
.el-input.el-input--suffix {
  cursor: pointer;
  overflow: hidden;
}
.el-input.el-input--suffix.rotate .el-input__suffix {
  transform: rotate(180deg);
}
.el-input.el-input--suffix .el-input__suffix input.el-input__inner {
  cursor: pointer;
}
.select-tree {
  max-height: 350px;
  overflow-y: scroll;
}
/* 菜单滚动条 */
.select-tree::-webkit-scrollbar {
  z-index: 11;
  width: 6px;
}
.select-tree::-webkit-scrollbar-track,
.select-tree::-webkit-scrollbar-corner {
  background: #fff;
}
.select-tree::-webkit-scrollbar-thumb {
  border-radius: 5px;
  width: 6px;
  background: #b4bccc;
}
.select-tree::-webkit-scrollbar-track-piece {
  background: #fff;
  width: 6px;
}
</style>
