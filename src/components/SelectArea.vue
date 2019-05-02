<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogShow"
    width="750px"
    :close-on-click-modal="false"
    :before-close="handleClose"
    append-to-body
  >
    <el-transfer
      class="transfer-class"
      filterable
      filter-placeholder="4S店名称"
      v-model="relationAreas"
      :data="pRelationAreas"
      :titles="['选择：', '已选：']"
      @left-check-change="leftCheckChange"
      @change="handleChange"
      :props="transProps"
    ></el-transfer>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose" size="medium" round>取 消</el-button>
      <el-button type="primary" @click="onSubmit('menuInfo')" size="medium" round>确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as Http from "@/api/setting";
export default {
  props: {
    relationAreasOptions: Array, 
    pRelationAreasOptions: Array,
    transProps: {
      default: () => ({
        key: 'area_id',
        label: 'name'
      })
    },
    title: {
      type: String,
      default: "选择4s店"
    }
  },
  inject: ["reload"],
  data() {
    return {
      dialogShow: true,
      loading: false,
      pRelationAreas: this.pRelationAreasOptions,
      relationAreas: this.obj2Array(this.relationAreasOptions, this.transProps.key)
    };
  },
  created() {
    console.log(this.pRelationAreas, this.relationAreas)
  },
  methods: {
    onSubmit(formName) {
      this.$emit('areas-change',this.handleSelectData(this.relationAreas, this.pRelationAreas));
      this.handleClose();
    },
    handleClose() {
      this.$emit("cancel");
    },
    leftCheckChange() {
    },
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
    },
    /* 根据id值返回完整的数据 */
    handleSelectData(arrId, obj) {
      let key = this.transProps.key
      let data = [];
      if(arrId && arrId.length){
        arrId.forEach(elementId => {
          obj.forEach(element => {
            if(elementId == element[key]){
              data.push(element);
            }
          });
        })
      }
      return data;
    },
    //* 提取对象中的某一项，例如id */
    obj2Array(obj, ele) {
      console.log(obj, ele)
      let array = [];
      if(obj && obj.length){
        obj.forEach(element => {
          if(element[ele]){
            array.push(element[ele])
          }
        });
      }
      return array;
    }
  }
};
</script>

<style lang="scss">
</style>





