<template>
    <div class="footer-container" v-if="propity === 3">
        <el-row type="flex" align="middle" style="height: 65px;">
            <span>友情链接：</span>
            <a :href="data.link1">{{data.link1_name}}</a>
            <a :href="data.link2">{{data.link2_name}}</a>
            <a :href="data.link3">{{data.link3_name}}</a>
            <a :href="data.link4">{{data.link4_name}}</a>
        </el-row>
    </div>
</template>

<script>
import * as userInfo from "@/utils/commonService/getUserInfo";
import * as Http from "@/api/home";
export default {
    data() {
        return {
            propity: '',
            data: {}
        }
    },
    created() {
        let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
        this.propity = user_info && user_info.propity;
        if (this.propity === 3) {
            this.getData();
        }
    },
    methods: {
        getData() {
            Http.getFriendLink().then(res => {
                this.$handleResponse(res, res => {
                    this.data = res.data;
                });
            });
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .footer-container {
        background-color: #324157; 
        color: #fff;

        a {
            margin: 0 12px 0 4px;
        }

        a:hover {
            text-decoration: underline;
        }
    }
</style>