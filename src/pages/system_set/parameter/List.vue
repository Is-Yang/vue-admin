<template>
    <div class="parameter-list">
        <el-row :gutter="10">
            <el-col :span="3">
                <el-card shadow="hover" class="item-card" :body-style="{ padding: '0'}">
                    <router-link to="/system/parameter/assess" style="display:block;">
                        <img src="~@/assets/images/setting/target.png" class="set-icon">
                        <p class="set-text">销冠周考核目标</p>
                    </router-link>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<style lang="scss" scoped>
.parameter-list {
    .item-card {
        background-color: #f5f6f7;
        text-align: center;
        cursor: pointer;

        .set-icon {
            padding: 15px 0;
            width: 45%;
        }
        .set-text {
            background-color: #fff;
            padding: 15px 5px;
        }
    }
}
</style>
