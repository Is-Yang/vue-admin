<template>
  <el-dialog :title="title" :visible.sync="dialogShow"  :close-on-click-modal="false" :before-close="handleClose">
    <el-form 
      :model="taskForm"
      :rules="rules"
      ref="taskForm"
      @keyup.enter.native="onSubmit('taskForm')"
      label-width="100px" class="taskForm">
      <el-form-item label="风险定位" prop="risk_for">
        <el-input v-model="taskForm.risk_for"></el-input>
      </el-form-item>
      <el-form-item label="风险描述">
        <el-input v-model="taskForm.risk_desc"></el-input>
      </el-form-item>
      <el-form-item label="管控措施" prop="risk_to_do">
        <el-input v-model="taskForm.risk_to_do"></el-input>
      </el-form-item>
      <el-form-item label="风险分类" prop="risk_type">
        <el-input v-model="taskForm.risk_type"></el-input>
      </el-form-item>
      <el-form-item label="导致后果" prop="risk_result">
        <el-input v-model="taskForm.risk_result"></el-input>
      </el-form-item>
      <el-form-item label="工程技术" prop="risk_evaluate_technology">
        <el-input v-model="taskForm.risk_evaluate_technology"></el-input>
      </el-form-item>
      <el-form-item label="管控措施" prop="risk_evaluate_to_do">
        <el-input v-model="taskForm.risk_evaluate_to_do"></el-input>
      </el-form-item>
      <el-form-item label="培训教育" prop="risk_evaluate_train">
        <el-input v-model="taskForm.risk_evaluate_train"></el-input>
      </el-form-item>
      <el-form-item label="个体防护" prop="risk_evaluate_protect">
        <el-input v-model="taskForm.risk_evaluate_protect"></el-input>
      </el-form-item>
      <el-form-item label="应急处理" prop="risk_evaluate_emergency">
        <el-input v-model="taskForm.risk_evaluate_emergency"></el-input>
      </el-form-item>
      <el-form-item label="风险等级" prop="risk_level">
        <el-input v-model="taskForm.risk_level"></el-input>
      </el-form-item>
      <el-form-item label="法规依据" prop="row">
        <el-input v-model="taskForm.row"></el-input>
      </el-form-item>
      <el-form-item class="margin-top-30">
        <el-button type="primary" @click="submitForm('taskForm')">确定</el-button>
        <el-button @click="resetForm('taskForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import * as Http from '@/api/home'
export default {
    props: ['type', 'taskParent'],
    inject: ['reload'],
    data() {
      return {
        title: "创建任务",
        dialogShow: true,
        loading: false,
        taskForm: {},
        rules: {
          risk_for: [
            { required: true, message: '请输入风险定位', trigger: 'blur' }
          ],
          risk_to_do: [
            { required: true, message: '请输入管控措施', trigger: 'blur' }
          ],
          risk_type: [
            { required: true, message: '请输入风险分类', trigger: 'blur' }
          ],
          risk_result: [
            { required: true, message: '请输入导致后果', trigger: 'blur' }
          ],
          risk_evaluate_technology: [
            { required: true, message: '请输入工程技术', trigger: 'blur' }
          ],
          risk_evaluate_to_do: [
            { required: true, message: '请输入管控措施', trigger: 'blur' }
          ],
          risk_evaluate_train: [
            { required: true, message: '请输入培训教育', trigger: 'blur' }
          ],
          risk_evaluate_protect: [
            { required: true, message: '请输入个体防护', trigger: 'blur' }
          ],
          risk_evaluate_emergency: [
            { required: true, message: '请输入应急处理', trigger: 'blur' }
          ],
          risk_level: [
            { required: true, message: '请输入风险等级', trigger: 'blur' }
          ],
          row: [
            { required: true, message: '请输入法规依据', trigger: 'blur' }
          ]
        }
      };
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        if(this.type == 'edit') {
            this.title = "编辑任务";
            this.loading = true;    
            setTimeout(() => {
                this.taskForm = Object.assign({}, this.taskParent);
                this.loading = false;
            },0);
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            let {
              risk_for,
              risk_desc,
              risk_to_do,
              risk_type,
              risk_result,
              risk_evaluate_technology,
              risk_evaluate_to_do,
              risk_evaluate_train,
              risk_evaluate_protect,
              risk_evaluate_emergency,
              risk_level,
              row
            } = this.taskForm;

            let params = {
                risk_for: risk_for,
                risk_desc: risk_desc,
                risk_to_do: risk_to_do,
                risk_type: risk_type,
                risk_result: risk_result,
                risk_evaluate_technology: risk_evaluate_technology,
                risk_evaluate_to_do: risk_evaluate_to_do,
                risk_evaluate_train: risk_evaluate_train,
                risk_evaluate_protect: risk_evaluate_protect,
                risk_evaluate_emergency: risk_evaluate_emergency,
                risk_level: risk_level,
                row: row
            }

            if (this.type == 'add') { // 新增
              Http.addTaskDesc(params).then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                  this.$message.success('新增成功');
                  this.handleClose();
                  this.reload();
                })
              }).catch(err => {
                this.loading = false;
              });
            } else { // 修改
                params.task_desc_id = this.taskForm.task_desc_id;
                Http.updateTaskDesc(params).then(res => {
                    this.loading = false;
                    this.$handleResponse(res, res => {
                    this.$message.success('修改成功');
                    this.handleClose();
                    this.reload();
                    })
                }).catch(err => {
                    this.loading = false;
                });
            }
          }
        });
      },
      handleClose() {
        this.$emit("cancel");
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style lang="scss">
  .taskForm {
    .el-form-item {
      width: 49%;
      display: inline-block;
    }
  }
</style>
