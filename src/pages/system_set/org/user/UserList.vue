<template>
  <div style="width:100%;">
    <el-row>
      <el-col :span="20">
        <el-form :inline="true" size="small">
          <el-form-item label="用户名/手机号：">
            <el-input v-model.trim="filter.keyword" placeholder="用户名/手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              round
              icon="el-icon-search"
              class="m-l-28"
              @click="searchFn"
            >查询</el-button>
            <el-button plain size="small" round icon="el-icon-delete" @click="resetFn">清空查询条件</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="4">
        <router-link :to="{path: 'org/user_add', query: {org_id: org_id}}">
          <el-button type="primary" size="small" class="f-r">新增成员</el-button>
        </router-link>
      </el-col>
    </el-row>

    <el-table v-loading="loading" border :data="userList" tooltip-effect="dark" ref="usertable" size="small">
      <el-table-column prop="nickname" label="成员姓名"></el-table-column>
      <el-table-column prop="mobile" label="手机"></el-table-column>
      <el-table-column label="角色">
        <template slot-scope="scope">
          <span v-if="scope.row.role && scope.row.role.length != 0" v-for="item in scope.row.role" :key="item" class="margin-right-5">
            {{item}}
          </span>
          <span v-if="scope.row.role && scope.row.role.length == 0">--</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          {{scope.row.status === 1 ? "启用" : "停用"}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="isStop(scope.row.status, scope.row.user_id)" :disabled='scope.row.rank === 1'>
            {{scope.row.status !== 1 ? "启用" : "停用"}}
          </el-button>
          <el-button size="mini" type="primary" plain icon="el-icon-edit" :title='scope.row.rank === 1 ? "超级管理员不可编辑" : "编辑"' @click="editUser(scope.row.user_id)" :disabled='scope.row.rank === 1'></el-button>
          <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="delUser(scope.row.user_id)" :disabled='scope.row.rank === 1'
            :title='scope.row.rank === 1 ? "超级管理员不可删除" : "删除"'>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="page.current" :page-size="page.size"
      :total="page.total" :page-sizes="[10, 20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  import * as Http from '@/api/setting';
  import {
    mapGetters
  } from 'vuex';
  import {
    setTimeout
  } from 'timers';
  export default {
    data() {
      return {
        userList: [],
        loading: false,
        filter: {},
        page: {
          current: 1,
          size: 10,
          total: 0
        },
        org_id: 0
      }
    },
    computed: {
      ...mapGetters([
        'org'
      ])
    },
    watch: {
      org(data) {
        if (data && data.org_id) {
          this.org_id = data.org_id;
          this.getUserData();
        }
      }
    },
    created() {
      setTimeout(() => {
        let orgData = this.$store.state.app.org;
        if (orgData && orgData.org_id) {
          this.org_id = orgData.org_id;
          this.getUserData();
        }
      }, 1000);

      // this.$eventHub.$on('orgTree', (data) => { // 获取组织ID
      //     this.org_id = data.org_id;
      //     this.getUserData();
      // })

    },
    methods: {
      getUserData() { // 获取用户列表数据
        this.loading = true;
        let {
          keyword,
          department
        } = this.filter;
        let params = {
          page: this.page.current,
          pageSize: this.page.size,
          keyword: keyword,
          org_id: this.org_id || ''
        };
        Http.getUserList(params).then(res => {
          this.loading = false;
          this.$handleResponse(res, res => {
            this.userList = res.result;
            this.page.total = res.total;
          });
        }).catch(err => {
          this.loading = false;
        });
      },
      isStop(from, user_id) { // 是否停用用户
        this.$confirm(from !== 1 ? '确定启用吗？' : '确定停用吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          Http.isBan({
            id: user_id,
            status: from !== 1 ? 1 : 0
          }).then(res => {
            this.loading = false;
            this.$handleResponse(res, res => {
              this.$message.success('操作成功');
              this.getUserData();
            });
          }).catch(error => {
            this.$message.error('操作失败');
          });
        })
      },
      delUser(id) { // 删除用户
        this.$confirm('请确认是否继续删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          Http.deleteUser(id).then(res => {
            this.loading = false;
            this.$handleResponse(res, res => {
              this.$message.success('删除成功');
              this.getUserData();
            });
          }).catch(error => {
            this.loading = false;
            this.$message.error('删除失败');
          });
        }).catch(() => {});
      },
      editUser(id) { // 编辑用户
        this.$router.push({
          path: 'org/user_edit',
          query: {
            id: id,
            org_id: this.org_id
          }
        });
      },
      resetFn() { // 重置
        this.filter = {};
        this.getUserData();
      },
      searchFn() { // 搜索
        this.page.current = 1;
        this.getUserData();
      },
      sizeChange(val) {
        this.page.size = val;
        this.getUserData();
      },
      currentChange(val) {
        this.page.current = val;
        this.getUserData();
      },
    }
  }

</script>
