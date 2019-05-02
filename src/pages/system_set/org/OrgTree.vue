<template>
    <div class="org-tree">
        <el-aside width="240px" style="min-height: 700px; border: 1px solid #ebeef5">
            <div class="padding-10">
                <el-input placeholder="输入关键字" v-model="filterTree"></el-input>
            </div>
            <el-tree :data="orgNodes" ref="orgTree" node-key="org_id" default-expand-all :expand-on-click-node="false" :check-on-click-node="true"
            highlight-current :props="orgNodesProps" :filter-node-method="filterNode">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <strong v-if="data.pid" @click="clickNode(data)" class="tit">{{ data.name }}</strong>
                <span v-if="!data.pid" @click="clickNode(data)" class="tit">{{ data.name }}</span>

                <span class="more-operate">
                    <el-dropdown trigger="click">
                        <span class="el-dropdown-link">
                        <i class="el-icon-more"></i>
                        </span>
                        <!-- 第一级 -->
                        <el-dropdown-menu slot="dropdown" v-if="data.pid">
                          <div @click="handleOrg('add', data.org_id, data.name)">
                              <el-dropdown-item>新增子组织</el-dropdown-item>
                          </div>
                        </el-dropdown-menu>
                        <!-- 其他级 -->
                        <el-dropdown-menu slot="dropdown" v-if="!data.pid">
                        <div @click="handleOrg('add', data.org_id, data.name)">
                            <el-dropdown-item>新增子组织</el-dropdown-item>
                        </div>
                        <div @click="handleOrg('edit', data.org_id)">
                            <el-dropdown-item>编辑</el-dropdown-item>
                        </div>
                        <div @click="delOrg(data.org_id)">
                            <el-dropdown-item>删除</el-dropdown-item>
                        </div>
                        </el-dropdown-menu>
                    </el-dropdown>
                </span>
            </span>
            </el-tree>
        </el-aside>
    </div>
</template>

<script>
  import * as Http from '@/api/setting';
import { setTimeout } from 'timers';
  export default {
    data() {
      return {
        orgNodes: [], // 组织级别节点
        orgNodesProps: {
          children: 'childs',
        },
        filterTree: '',
      }
    },
    created() {
      let _this = this;
      this.getOrgNodes();
      _this.$nextTick(function(){
        setTimeout(()=> {
          let orgTree = _this.$refs.orgTree;
          let orgId = orgTree && orgTree.data[0] && orgTree.data[0].org_id;  // 默认为节点的第一个数据
          let stateOrg = this.$store.state.app.org;  // 获取vuex中org的数据

          if(stateOrg && stateOrg.org_id) {  // 如果vuex state中有数据时则取vuex中的数据
            orgId = stateOrg.org_id;
          }
          if(orgTree) {
            orgTree.setCurrentKey(orgId);  // 选中高亮
          }
        }, 1200);
      });
    },
    watch: {
      filterTree(val) {
        this.$refs.orgTree.filter(val);
      }
    },
    methods: {
      getOrgNodes() { // 获取组织级别列表
        Http.gerOrgNodes().then(res => {
          this.$handleResponse(res, res => {
            res.forEach(element => {
              element['pid'] = 1; // 设置pid 判断为第一级，不显示编辑和删除按钮
            });
            this.orgNodes = JSON.parse(JSON.stringify(res));
            if(!this.$store.state.app.org) {  // 如果 vuex 中没有组织信息则传递
              this.$store.dispatch('GetOrg', this.orgNodes[0]);
            }
            // this.$eventHub.$emit("orgTree", this.orgNodes[0]);  // 默认第一个组织的数据
          });
        })
      },
      handleOrg(from, id, name) { // 组织的操作
        if (from === 'edit') { // 编辑
          this.$router.push({
            path: 'org/edit',
            query: {
              id: id
            }
          });
        } else if (from === 'add') { // 新增
          this.$router.push({
            path: 'org/add',
            query: {
              id: id,
              name: name
            }
          });
        }
      },
      delOrg(id) { // 删除组织
        this.$confirm('删除该组织时，同时会删除所属子组织及该组织下的所有账号包括子组织账号，删除后，组织下的账号将不能登录后台，请确认是否删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          Http.deleteOrg(id).then(res => {
            this.loading = false;
            this.$handleResponse(res, res => {
              if (res) {
                this.$message.success('删除成功');
                this.getOrgNodes();
              }
            });
          }).catch(error => {
            this.loading = false;
            this.$message.error('删除失败');
          });
        });
      },
      clickNode(data) {
        // this.$router.push({
        //   path: 'org',
        //   query: {
        //     org_id: data.org_id
        //   }
        // })
        // this.$eventHub.$emit("orgTree", data);
        this.$store.dispatch('GetOrg', data);
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      }
    }
  }

</script>

<style lang="scss" scoped>
  .org-tree {
    .custom-tree-node {
        width: calc(100% - 60px);
        .tit {
            display: inline-block;
            width: 100%;
        }
    }
    .more-operate {
      position: absolute;
      right: 15px;
      z-index: inherit;
    }
  }
</style>
