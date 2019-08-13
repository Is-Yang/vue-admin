<template>
  <el-dialog :title="title" :visible.sync="dialogShow" :close-on-click-modal="false" width="1000px"
    :before-close="handleClose">
    <el-form :model="taskForm" :rules="rules" ref="taskForm" @keyup.enter.native="onSubmit('taskForm')"
      label-width="110px" class="taskForm">
      <el-form-item label="任务初始等级" prop="task_risk_init_level">
        <el-select v-model="taskForm.task_risk_init_level" placeholder="请选择">
          <el-option v-for="item in riskLevel" :key="item.value" :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务名称" prop="task_name">
        <el-input v-model="taskForm.task_name"></el-input>
      </el-form-item>
      <el-form-item label="用户列表">
        <el-select v-model="taskForm.user_id" placeholder="请选择">
          <el-option v-for="item in userList" :key="item.user_id" :label="item.name"
            :value="item.user_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务截止时间">
        <el-date-picker v-model="taskForm.task_deadline_text" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="大分类">
        <el-select v-model="taskForm.position_id" placeholder="请选择">
          <el-option v-for="item in positionList" :key="item.position_id" :label="item.position_name"
            :value="item.position_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="小分类">
        <el-select v-model="taskForm.position_detail_id" placeholder="请选择">
          <el-option v-for="item in positionDetailList" :key="item.position_detail_id"
            :label="item.position_detail_sname" :value="item.position_detail_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属公司" v-if="!companyId">
        <el-select v-model="taskForm.company_id" placeholder="请选择公司" @change="getDepartment">
          <el-option v-for="item in companyList" :key="item.company_id" :label="item.company_name"
            :value="item.company_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属部门">
        <el-select v-model="taskForm.department_id" placeholder="请选择部门" @change="changeDepart">
          <el-option v-for="item in departmentList" :key="item.department_id" :label="item.department_name"
            :value="item.department_id">
          </el-option>
        </el-select>
      </el-form-item>
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
      <!-- <el-form-item label="风险等级" prop="risk_level">
        <el-input v-model="taskForm.risk_level"></el-input>
      </el-form-item> -->
      <el-form-item label="法规依据" prop="row">
        <el-input v-model="taskForm.row"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('taskForm')">确定</el-button>
        <el-button @click="resetForm('taskForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import * as Http from '@/api/home'
  import moment from 'moment';
  export default {
    props: ['type', 'taskParent', 'companyId'],
    inject: ['reload'],
    data() {
      return {
        title: "创建任务",
        dialogShow: true,
        loading: false,
        taskForm: {},
        riskLevel: [
          {
            label: '低风险',
            value: 0
          },{
            label: '一般风险',
            value: 1
          },{
            label: '较大风险',
            value: 2
          },{
            label: '重大风险',
            value: 3
          }
        ],
        rules: {
          task_risk_init_level: [{
            required: true,
            message: '请输入任务初始等级',
            trigger: 'blur'
          }],
          task_name: [{
            required: true,
            message: '请输入任务名称',
            trigger: 'blur'
          }],
          risk_for: [{
            required: true,
            message: '请输入风险定位',
            trigger: 'blur'
          }],
          risk_to_do: [{
            required: true,
            message: '请输入管控措施',
            trigger: 'blur'
          }],
          risk_type: [{
            required: true,
            message: '请输入风险分类',
            trigger: 'blur'
          }],
          risk_result: [{
            required: true,
            message: '请输入导致后果',
            trigger: 'blur'
          }],
          risk_evaluate_technology: [{
            required: true,
            message: '请输入工程技术',
            trigger: 'blur'
          }],
          risk_evaluate_to_do: [{
            required: true,
            message: '请输入管控措施',
            trigger: 'blur'
          }],
          risk_evaluate_train: [{
            required: true,
            message: '请输入培训教育',
            trigger: 'blur'
          }],
          risk_evaluate_protect: [{
            required: true,
            message: '请输入个体防护',
            trigger: 'blur'
          }],
          risk_evaluate_emergency: [{
            required: true,
            message: '请输入应急处理',
            trigger: 'blur'
          }],
          // risk_level: [{
          //   required: true,
          //   message: '请输入风险等级',
          //   trigger: 'blur'
          // }],
          company_id: [{
            required: true,
            message: '请选择所属公司',
            trigger: 'change'
          }],
          row: [{
            required: true,
            message: '请输入法规依据',
            trigger: 'blur'
          }]
        },
        positionList: [],
        positionDetailList: [],
        companyList: [],
        departmentList: [],
        userList: [],
        propity: ''
      };
    },
    created() {
      // 获取公司列表
      this.getCompany();
      setTimeout(() => {
        if (this.companyId) {
          this.getDepartment(this.companyId);
        } else {
          // 获取部门列表
          this.getDepartment();
        }
      }, 500);
      
      // 用户列表
      this.getUserList();
      this.getPositionList();
      this.getPositionDetailList();
      // this.requestCompanyCheckInfo();
      
      this.init();
    },
    methods: {
      requestCompanyCheckInfo() {
        Http.requestCompanyCheckInfo()
          .then(res => {
            this.loading = false;
            this.$handleResponse(res, res => {
              console.log(res)
            });
          })
          .catch(err => {
            this.loading = false;
          });
      },
      changeDepart(data) {
        this.$set(this.taskForm, 'department_id', data);
        this.$forceUpdate();
      },
      getUserList() {
        Http.checkTask()
          .then(res => {
            this.loading = false;
            this.$handleResponse(res, res => {
              if (res.users) {
                this.userList = res.users;
              }
            });
          })
          .catch(err => {
            this.loading = false;
          });
      },
      getCompany() {
        Http.getCompanyDepartment()
          .then(res => {
            this.loading = false;
            this.$handleResponse(res, res => {
              if (res.data) {
               this.companyList = res.data;
              }
            });
          })
          .catch(err => {
            this.loading = false;
          });
      },
      getDepartment(companyId) {
        this.taskForm.department_id = '';
        if (companyId) {
          let obj = {};
          obj = this.companyList.find(function (item) {
            return item.company_id === companyId
          });
          if (obj && obj.departments) {
            this.departmentList = obj.departments;
          }
        }
      },
      getPositionList() {
        Http.getPositionList()
          .then(res => {
            this.$handleResponse(res, res => {
              if (res) {
                this.positionList = res;
              }
            });
          })
          .catch(err => {});
      },
      getPositionDetailList() {
        Http.getPositionDetailList()
          .then(res => {
            this.$handleResponse(res, res => {
              if (res) {
                this.positionDetailList = res;
              }
            });
          })
          .catch(err => {});
      },
      init() {
        if (this.type == 'edit') {
          this.title = "编辑任务";
          this.loading = true;
          setTimeout(() => {
            this.taskForm = Object.assign({}, this.taskParent);
            this.taskForm.risk_for = this.taskParent.task_desc.risk_for;
            this.taskForm.risk_desc = this.taskParent.task_desc.risk_desc;
            this.taskForm.risk_to_do = this.taskParent.task_desc.risk_to_do;
            this.taskForm.risk_type = this.taskParent.task_desc.risk_type;
            this.taskForm.risk_result = this.taskParent.task_desc.risk_result;
            this.taskForm.risk_evaluate_technology = this.taskParent.task_desc.risk_evaluate_technology;
            this.taskForm.risk_evaluate_to_do = this.taskParent.task_desc.risk_evaluate_to_do;
            this.taskForm.risk_evaluate_train = this.taskParent.task_desc.risk_evaluate_train;
            this.taskForm.risk_evaluate_protect = this.taskParent.task_desc.risk_evaluate_protect;
            this.taskForm.risk_evaluate_emergency = this.taskParent.task_desc.risk_evaluate_emergency;
            this.taskForm.risk_level = this.taskParent.task_desc.risk_level;
            this.taskForm.row = this.taskParent.task_desc.row;

            // // 部门列表
            let obj = {};
            obj = this.companyList.find((item) => {
              return item.company_id ===  this.taskForm.company_id;
            });
            if (obj && obj.departments) {
              this.departmentList = obj.departments;
            }
            this.loading = false;
          }, 500);
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            let {
              task_risk_init_level,
              position_id,
              position_detail_id,
              task_name,
              user_id,
              department_id,
              company_id,
              task_deadline_text,
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

            let task_deadline = moment(task_deadline_text).hours(23).minutes(59).seconds(59).valueOf();

            let params = {
              task_risk_init_level: task_risk_init_level,
              position_id: position_id,
              position_detail_id: position_detail_id,
              task_name: task_name,
              user_id: user_id,
              department_id: department_id,
              company_id: company_id,
              task_deadline: parseInt(task_deadline/1000),
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
              params.task_id = this.taskForm.task_id;
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
      width: 33%;
      display: inline-block;
    }
  }

</style>
