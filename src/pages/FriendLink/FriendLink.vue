<template>
    <el-form label-width="120px">
        <!-- <el-form-item label="友情链接1:">
            <el-col :span="4" v-if="!isEdit">
                <a :href="data.link1" target="_bank">{{data.link1_name}}</a>
            </el-col>
            <el-col :span="4" v-if="isEdit">
                <el-input v-model="data.link1_name" placeholder="请输入链接名称" />
            </el-col>
            <el-col :span="1" v-if="isEdit" class="text-center"> -- </el-col>
            <el-col :span="4" v-if="isEdit">
                <el-input v-model="data.link1" placeholder="请输入链接地址" />
            </el-col>
        </el-form-item>
        <el-form-item label="友情链接2:">
            <el-col :span="4" v-if="!isEdit">
                <a :href="data.link2" target="_bank">{{data.link2_name}}</a>
            </el-col>
            <el-col :span="4" v-if="isEdit">
                <el-input v-model="data.link2_name" placeholder="请输入链接名称" />
            </el-col>
            <el-col :span="1" v-if="isEdit" class="text-center"> -- </el-col>
            <el-col :span="4" v-if="isEdit">
                <el-input v-model="data.link2" placeholder="请输入链接地址" />
            </el-col>
        </el-form-item>
        <el-form-item label="友情链接3:">
            <el-col :span="4" v-if="!isEdit">
                <a :href="data.link3" target="_bank">{{data.link3_name}}</a>
            </el-col>
            <el-col :span="4" v-if="isEdit">
                <el-input v-model="data.link3_name" placeholder="请输入链接名称" />
            </el-col>
            <el-col :span="1" v-if="isEdit" class="text-center"> -- </el-col>
            <el-col :span="4" v-if="isEdit">
                <el-input v-model="data.link3" placeholder="请输入链接地址" />
            </el-col>
        </el-form-item>
        <el-form-item label="友情链接4:">
            <el-col :span="4" v-if="!isEdit">
                <a :href="data.link4" target="_bank">{{data.link4_name}}</a>
            </el-col>
            <el-col :span="4" v-if="isEdit">
                <el-input v-model="data.link4_name" placeholder="请输入链接名称" />
            </el-col>
            <el-col :span="1" v-if="isEdit" class="text-center"> -- </el-col>
            <el-col :span="4" v-if="isEdit">
                <el-input v-model="data.link4" placeholder="请输入链接地址" />
            </el-col>
        </el-form-item> -->
        <!-- <el-form-item>
            <el-button v-if="!isEdit" type="primary" @click="isEdit = true">修改</el-button>
            <el-button v-if="isEdit" type="primary" @click="editHandle">确定</el-button>
            <el-button v-if="isEdit" @click="cancelForm">取消</el-button>
        </el-form-item> -->

        <el-form-item v-for="(item, index) in relatedLinks" :key="index" :label="'友情链接' + (index + 1) + '：'">
           <router-link :to="'/showPage?page=' + item.flag">
                {{item.title}}
            </router-link>
        </el-form-item>
    </el-form>
</template>

<script>
import * as Http from "@/api/home";
export default {
    inject: ["reload"],
    data() {
        return {
            loading: false,
            data: {},
            relatedLinks: [
                {
                    title: '隐患排查治理信息系统',
                    link: 'http://ent.hazard.scaqjg.com',
                    flag: 1,
                }, {
                    title: '社会单位消防安全户籍化管理系统',
                    link: 'http://202.61.89.197:85/FrameSet/Login.aspx',
                    flag: 2,
                }, {
                    title: '四川省安全社区信息管理平台',
                    link: 'http://aqsq.tccxfw.com',
                    flag: 3,
                }, {
                    title: '四川省安全评价信息公开平台',
                    link: 'http://www.czax.org/cyxx',
                    flag: 4,
                }
            ],
            copyData: {},
            isEdit: false,
        };
    },
    created() {
        // this.getListData();
    },
    methods: {
        getListData() {
            // 菜单列表数据
            this.loading = true;
            Http.getFriendLink().then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                    this.data = res.data;
                    this.copyData['link1Copy'] = res.data.link1;
                    this.copyData['link1NameCopy'] = res.data.link1_name;
                    this.copyData['link2Copy'] = res.data.link2;
                    this.copyData['link2NameCopy'] = res.data.link2_name;
                    this.copyData['link3Copy'] = res.data.link3;
                    this.copyData['link3NameCopy'] = res.data.link3_name;
                    this.copyData['link4Copy'] = res.data.link4;
                    this.copyData['link4NameCopy'] = res.data.link4_name;
                });
            }).catch(err => {
                this.loading = false;
            });
        },
        editHandle() {
            let rule = /(http|https):\/\/([\w.]+\/?)\S*/;
            if (this.data.link1 != '') {
                if(!rule.test(this.data.link1)) {
                    this.$message.error('友情链接1，链接地址必须包括http://或者https://');
                    return;
                }
            }　

            if (this.data.link2 != '') {
                if(!rule.test(this.data.link2)) {
                    this.$message.error('友情链接2，链接地址必须包括http://或者https://');
                    return;
                }
            }　

            if (this.data.link3 != '') {
                if(!rule.test(this.data.link3)) {
                    this.$message.error('友情链接3，链接地址必须包括http://或者https://');
                    return;
                }
            }　

            if (this.data.link4 != '') {
                if(!rule.test(this.data.link4)) {
                    this.$message.error('友情链接4，链接地址必须包括http://或者https://');
                    return;
                }
            }　

            this.loading = true;
            Http.updateFriendLink(this.data).then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                    this.$message.success('修改成功');
                    this.reload();
                });
            }).catch(err => {
                this.loading = false;
            });
        },
        cancelForm() {
            this.data.link1 = this.copyData.link1Copy;
            this.data.link1_name = this.copyData.link1NameCopy;
            this.data.link2 = this.copyData.link2Copy;
            this.data.link2_name = this.copyData.link2NameCopy;
            this.data.link3 = this.copyData.link3Copy;
            this.data.link3_name = this.copyData.link3NameCopy;
            this.data.link4 = this.copyData.link4Copy;
            this.data.link4_name = this.copyData.link4NameCopy;
            this.isEdit = false;
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    a {
        margin: 0 12px 0 4px;

        &:hover {
            text-decoration: underline;
        }
    }
</style>