<template>
  <div class="form__content" v-loading="loading">
    <el-form :model="role" :label-position="'right'" ref="roleInfo" :rules="rules" @keyup.enter.native="onSubmit('roleInfo')"
      size="medium" label-width="120px">
      <el-form-item prop="name" label="角色名称：">
        <el-input type="text" v-model="role.name" placeholder="请输入角色名称" style="width: 240px;"></el-input>
      </el-form-item>
      <el-form-item class="is-required" label="后台栏目权限：">
        <el-tree :data="roleNodes" show-checkbox node-key="menu_id" default-expand-all :expand-on-click-node="false" ref="tree" :props="roleProps"
          :render-content="renderContent" :highlight-current="false">
        </el-tree>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('roleInfo')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import * as Http from '@/api/setting'
  export default {
    data() {

      return {
        role: {
          name: ''
        },
        loading: false,
        roleNodes: [], // 权限数据
        roleProps: {
          children: 'child',
          label: 'title'
        },
        rules: {
          name: [{
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }]
        },
        paramsName: '' // 参数-角色名
      }
    },
    created() {
      this.paramsName = this.$route.query && this.$route.query.name;
      this.init();
    },
    methods: {
      init() {
        this.getNodes(); // 获取所有权限节点
        if (this.paramsName) { // 编辑
          this.loading = true;
          Http.viewRole(this.paramsName).then(res => {
            this.$handleResponse(res, res => {
              this.role.name = res.role; // 角色名称
              // 选中对应的权限
              if (res.authRules) {
                this.$refs.tree.setCheckedKeys(res.authRules);
              }
            })
          })
        }

        var _levelname = document.getElementsByClassName("levelname");  //levelname是上面的最底层节点的名字
        setTimeout(() => {  //等到树都加载完了再去执行的这里
          for (var i = 0; i < _levelname.length; i++) {        
            _levelname[i].parentNode.style.cssFloat = 'left';   //最底层的节点，包括多选框和名字都让他左浮动
            _levelname[i].parentNode.style.styleFloat = 'left';      
          }  
          this.loading = false;
        }, 1000);
      },
      getNodes() {
        this.loading = true;
        Http.nodesMenu().then(res => {
          this.$handleResponse(res, res => {
            this.roleNodes = res; // 展示所有权限节点
          })
        })
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const treeNode = this.$refs.tree.getCheckedNodes(); // 选中的权限信息
            if (treeNode.length === 0 ){
              this.$message.error('请至少选择一项后台栏目权限');
              return;
            }

            this.loading = true;
            let {
              name
            } = this.role;
            
            let params = {
              name: name
            }
            
            const pids = [];

            treeNode.forEach(item => {
              let arr = item.pids.split(',');
              pids.push(...arr);
            });

            for (var key in pids) {
              params["rules"] = pids;
            };

            if (!this.paramsName) { // 新增
              Http.addRole(params).then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                  this.$message.success('新增角色成功');
                  this.handleClose();
                })
              }).catch(err => {
                this.loading = false;
              });
            } else {
              Http.updataRole(this.paramsName, params).then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                  this.$message.success('更新角色成功');
                  this.handleClose();
                })
              }).catch(err => {
                this.loading = false;
              });
            }
          }
        })
      },
      handleClose() { // 取消
        this.$router.push({
          path: '../role'
        });
      },
      renderContent(h, { node, data, store}) {            
        let classname = '';            
        if (node.level == 3) {               
          classname = 'levelname';            
        }             
        return (
          <span class={classname}>
            <span>{node.label}</span>
          </span>);
        }
      }
    }

</script>
