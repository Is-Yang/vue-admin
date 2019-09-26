<template>
    <div class="card-num">
      <el-row :gutter="15">
        <el-col :span="8" class="flow-item" v-for="(item, key, index) in areaList" :key="index">
          <el-card shadow="hover">
              <div class="show-area" @click="getAreaStat(item.manager_index)">
                <span>{{item.area_name}}</span>
              </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
</template>

<script>
import * as Http from '@/api/home'
export default {
    data() {
        return {
            areaList: []
        }
    },
    created () {
        this.getAreaList()
    },
    methods: {
        // 获取所有区域
        getAreaList() {
            Http.geAreaSelect().then(res => {
                this.$handleResponse(res, res => {
                    if (res.data) {
                        this.areaList = res.data;
                    }
                })
            }).catch(err => {
                console.log(err)
            });
        },
        // 获取区域统计
        getAreaStat(manager_index) {
            this.$emit('manageIndex', manager_index);
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.flow-item .show-area {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    cursor: pointer;

    span {
        font-size: 36px;
    }
}
</style>