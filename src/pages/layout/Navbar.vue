<template>
    <el-menu class="navbar" mode="horizontal">
        <div class="flex-between">
            <div>
                <i class="fa fa-bars" @click="toggleSideBar" :isActive="sidebar.opened"></i>
                <tabs-view></tabs-view>
            </div>
            
            <div class="avatar-wrapper">
                <el-dropdown trigger="click">
                    <span class="user-name">{{userInfo.userName}}</span>
                    <i class="el-icon-caret-bottom"></i>
                    <el-dropdown-menu slot="dropdown">
                        <!-- <div @click="dialogFormVisible = true">
                        <el-dropdown-item>
                            设置
                        </el-dropdown-item>
                        </div> -->
                        <div @click="logout">
                        <el-dropdown-item>
                            退出登录
                        </el-dropdown-item>
                        </div>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </el-menu>
</template>

<script>
    import TabsView from './TabsView';
    import { mapGetters } from 'vuex';
    import * as userInfo from "@/utils/commonService/getUserInfo";
    export default {
        data() {
        return {
            loading: false,
            userInfo: {},
            dialogFormVisible: false,
            path: '',
        }
        },
        components: {
            TabsView
        },
        computed: {
            ...mapGetters([
                'sidebar',
            ])
        },
        created () {
            let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
            this.userInfo.userName = user_info.userName;
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('ToggleSideBar')
            },
            logout() { // 退出登录
                this.$confirm('请确认是否退出登录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    localStorage.removeItem('userInfo'); // 清除用户信息
                    this.$store.dispatch('saveUser', '');
                    this.$router.push('/login');
                    window.location.reload();
                }).catch(() => {

                });
            },
        }
    }
</script>


<style rel="stylesheet/scss" lang="scss" >
    .navbar {
        :active,
        :focus {
            outline: none;
        }
        height: 50px;
        line-height: 50px;
        border-radius: 0px !important;
        .flex-between {
            display: flex;
            justify-content: space-between;
        }

        .fa-bars{
            cursor: pointer;
            line-height: 50px;
            height: 50px;
            float: left;
            padding: 0 15px;
            color: #324157;
        }
        /*.hideSidebar .fa-bars{
            display: none;
        }*/
        .fa-bars[isactive] {
            transform: rotate(90deg);
        }
        .avatar-wrapper {
            padding-right: 20px;
            cursor: pointer;
        }
    }
</style>
