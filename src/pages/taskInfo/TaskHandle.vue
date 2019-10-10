<template>
  <el-dialog v-loading="loading" :title="title" :visible.sync="dialogShow" :close-on-click-modal="false" width="1000px"
    :before-close="handleClose">
    <el-form :model="taskForm" :rules="rules" ref="taskForm" @keyup.enter.native="onSubmit('taskForm')"
      label-width="110px" class="taskForm">
      <!-- <el-form-item label="所属公司" v-if="!companyId">
        <el-select v-model="taskForm.company_id" placeholder="请选择公司" @change="getDepartment">
          <el-option v-for="item in companyList" :key="item.company_id" :label="item.company_name"
            :value="item.company_id">
          </el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="风险点名称" prop="task_name">
        <el-input v-model="taskForm.position_name"></el-input>
      </el-form-item> -->
      <el-form-item label="二级子项">
        <el-select v-model="taskForm.position_detail_id" placeholder="请选择"
          @change="changePostion" filterable>
          <el-option v-for="item in positionDetailList" :key="item.position_detail_id"
            :label="item.position_detail_name" :value="item.position_detail_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级子项">
        <el-select v-model="taskForm.position_three_id" placeholder="请选择" 
          @change="changeThree" filterable>
          <el-option v-for="item in positionThreeList" :key="item.position_three_id"
            :label="item.position_three_name" :value="item.position_three_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="员工列表">
        <el-select v-model="taskForm.user_id" placeholder="请选择" filterable>
          <el-option v-for="item in userList" :key="item.user_id" :label="item.name"
            :value="item.user_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="风险描述">
        <el-input v-model="taskForm.risk_desc"></el-input>
      </el-form-item>
      <el-form-item label="导致后果" prop="risk_result">
        <el-input v-model="taskForm.risk_result"></el-input>
      </el-form-item>
      
      <!-- <el-form-item label="风险级别" prop="risk_level">
        <el-input v-model="taskForm.risk_level"></el-input>
      </el-form-item> -->
      <el-form-item label="风险级别" prop="risk_level">
        <el-select v-model="taskForm.risk_level" placeholder="请选择" filterable 
          @change="changeRiskLevel">
          <el-option v-for="item in riskLevel" :key="item.value" :label="item.label"
            :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <br/>
      <el-form-item label="工程技术" prop="risk_evaluate_technology">
        <el-input v-model="taskForm.risk_evaluate_technology"></el-input>
      </el-form-item>
       <el-form-item label="管控措施" prop="risk_to_do">
        <el-input v-model="taskForm.risk_to_do"></el-input>
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
      <br />
      <el-form-item label="法规依据" prop="row">
        <el-input v-model="taskForm.row"></el-input>
      </el-form-item>
      <el-form-item label="新增管控措施" prop="risk_evaluate_to_do">
        <el-input v-model="taskForm.risk_evaluate_to_do"></el-input>
      </el-form-item>
      <el-form-item label="管控周期">
        <!-- <el-radio v-model="taskForm.task_check_cycle" label="1">1天1次</el-radio>
        <el-radio v-model="taskForm.task_check_cycle" label="3">1天3次</el-radio> -->
        <el-input-number v-model="taskForm.task_check_cycle" :min="1" controls-position="right" @change="checkCycleChange" />
        <p class="tip-txt">*比如：1天一次就填24，3天一次就填72，1天3次就填8。(单位为小时)</p>
      </el-form-item>
      <el-form-item label="管控周期文字">
        <el-input v-model="taskForm.task_check_cycle_text" disabled></el-input>
        <!-- <p class="tip-txt">*比如：1天1次，1周1次</p> -->
      </el-form-item>
      <el-form-item label="所属部门">
        <el-select v-model="taskForm.department_id" placeholder="请选择部门" @change="changeDepart">
          <el-option v-for="item in departmentList" :key="item.department_id" :label="item.department_name"
            :value="item.department_id">
          </el-option>
        </el-select>
      </el-form-item>
      
      <!-- <el-form-item label="任务截止时间">
        <el-date-picker v-model="taskForm.task_deadline_text" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      
      <el-form-item label="风险分类" prop="risk_type">
        <el-input v-model="taskForm.risk_type"></el-input>
      </el-form-item> -->
      <br />
      <el-form-item class="margin-top-20">
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
        taskForm: {
          risk_level: ''
        },
        rules: {
          task_risk_init_level: [{
            required: true,
            message: '请选择风险级别',
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
          risk_level: [{
            required: true,
            message: '请选择风险等级',
            trigger: 'change'
          }],
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
        positionThreeList: [],
        companyList: [],
        departmentList: [],
        userList: [],
        propity: ''
      };
    },
    created() {
      const route = this.$route;
      this.taskForm.company_id = route.query && route.query.companyId;
      this.taskForm.position_id = route.query && route.query.positionId;

      // 获取公司列表
      this.getCompany();
      // 用户列表
      this.getUserList();
      // 二级子项
      // this.getPositionList();
      this.getPositionDetailList();
      // this.requestCompanyCheckInfo();
      
      this.init();
    },
    methods: {
      checkCycleChange(task_check_cycle) {
        if(task_check_cycle < 24){
            if(task_check_cycle != 0) {
                this.taskForm.task_check_cycle_text = "1天" + 24.0 / task_check_cycle +"次";
            } else {
                this.taskForm.task_check_cycle_text = "未设置";
            }
        } else {
            this.taskForm.task_check_cycle_text = task_check_cycle / 24.0 + "天1次";
        }
      },
      changeRiskLevel(val) {
        this.$set(this.taskForm, 'risk_level', val);
        this.$forceUpdate();
      },
      changePostion() {
        this.taskForm.position_three_id = '';
        this.getPositionThreeList(this.taskForm.position_detail_id);
      },
      getPositionThreeList(position_detail_id) {
        Http.mGetThree(
          {
            page: 0,
            position_detail_id: position_detail_id
          }
        ).then(res => {
          this.$handleResponse(res, res => {
            if (res) {
              this.positionThreeList = res.data;
            }
          });
        }).catch(err => {});
      },
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
      changeThree(data) {
        this.$set(this.taskForm, 'position_three_id', data);
        this.$forceUpdate();
      },
      getUserList() {
        Http.checkTask(
          {
            company_id: this.taskForm.company_id,
            position_id: this.taskForm.position_id
          }
        ).then(res => {
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

               this.getDepartment(this.taskForm.company_id);
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
            return item.company_id == companyId
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
        Http.getPositionDetailList(
          {
            company_id: this.taskForm.company_id,
            position_id: this.taskForm.position_id
          }
        ).then(res => {
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
          this.getPositionDetailList();
          setTimeout(() => {
            this.taskForm = Object.assign({}, this.taskParent);
            this.taskForm.task_check_cycle_text = this.taskParent.task_check_cycle_text;
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
            this.getPositionThreeList(this.taskForm.position_detail_id);
            this.loading = false;
          }, 500);
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            let {
              // task_risk_init_level,
              position_id,
              position_detail_id,
              position_three_id,
              task_name,
              user_id,
              department_id,
              company_id,
              task_deadline_text,
              task_check_cycle,
              task_check_cycle_text,
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
              // task_risk_init_level: task_risk_init_level,
              position_id: position_id,
              position_detail_id: position_detail_id,
              position_three_id: position_three_id,
              task_name: task_name,
              user_id: user_id,
              department_id: department_id,
              company_id: company_id,
              task_deadline: parseInt(task_deadline/1000),
              task_check_cycle: task_check_cycle,
              task_check_cycle_text: task_check_cycle_text,
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
      .tip-txt {
          line-height: 1.2;
          position: absolute;
          margin-top: 10px;
          font-size: 13px;
          color: #f56c6c;
          z-index: 1;
      }
    }
  }

</style>
