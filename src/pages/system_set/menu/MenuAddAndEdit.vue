<template>
    <el-dialog :title="title" :visible.sync="dialogShow" width="600px" :close-on-click-modal="false" :before-close="handleClose">
        <div class="form__content" 
            v-loading="loading" 
            style="width:520px">
            <el-form :model="menu" :label-position="'right'" ref="menuInfo" :rules="rules" @keyup.enter.native="onSubmit('menuInfo')" label-width="100px">
                <el-form-item prop="title" label="菜单标题">
                    <el-input type="text" v-model="menu.title" placeholder="请输入菜单标题"></el-input>
                </el-form-item>
                <el-form-item prop="url" label="前端路由">
                    <el-input type="text" v-model="menu.url" placeholder="如：格式：statistics/cloud"></el-input>
                </el-form-item>
                <el-form-item prop="api" label="urls">
                    <el-input type="textarea" v-model="menu.api"></el-input>
                </el-form-item>
                <el-form-item label="上级菜单">
                    <el-cascader
                        placeholder="请输入需要搜索的上级菜单"
                        :options="options"
                        :props="props"
                        v-model="menu.pidTree"
                        filterable
                        change-on-select
                        clearable
                        style="width:100%;"
                    ></el-cascader>
                </el-form-item>
                <el-form-item prop="sort" label="排序值">
                    <el-input-number v-model="menu.sort" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="是否隐藏">
                    <el-radio-group v-model="menu.hide">
                        <el-radio label="0">显示</el-radio>
                        <el-radio label="1">隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="onSubmit('menuInfo')">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import * as Http from '@/api/setting'
export default {
    props: ['type', 'menuId'],
    inject: ['reload'],
    data() {
        return {
            title: "新增菜单",
            dialogShow: true,
            loading: false,
            menu: {
                sort: 0,
                hide: '0',
                pidTree: []
            },
            rules: {
                title: [{
                    required: true,
                    message: '请输入菜单标题',
                    trigger: 'blur'
                }],
                url: [{
                    required: true,
                    message: '请输入前端路由',
                    trigger: 'blur'
                }],
                api: [{
                    required: true,
                    message: '请输入urls',
                    trigger: 'blur'
                }]
            },
            options:[],
            props: {
                label:'title',
                value:'menu_id',
                children: 'child',
                disabled: 'disabled'
            },
        }
    },
    created() {
        this.init();
        this.getMenuNodes();
    },
    methods: {
        init() {
            if(this.type == 'edit') {
                this.title = "编辑菜单";
                this.loading = true;    
                setTimeout(() => {
                    Http.viewMenu(this.menuId).then(res => {
                        this.loading = false;
                        this.$handleResponse(res, res=> {
                            this.menu = res;
                            this.menu.pidTree = res.pidTree.splice(0, res.pidTree.length - 1);  // 重新处理pidTree数据，去除pidTree最后一项（为当前id）
                            this.menu.hide = JSON.stringify(res.hide); // 是否隐藏数据需要处理成字符串
                        })
                    })
                },0);
            }
        },
        getMenuNodes() {  // 获取菜单节点数据
            Http.nodesMenu().then(res => {
                this.$handleResponse(res, res => {
                    this.options = res;
                    this.preNode(this.options, this.menuId);  // 禁止选菜单自身
                });
            })
        },
        preNode(node, id) {
            node.map((item) => {
                if(item.id && item.id == id) {  // 第一级
                    item.disabled = true;
                }else{   // 一级以上
                    if(item.child) {
                        this.preNode(item.child, id);   
                    }
                }
            })
           
        },
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if(valid) {
                    this.loading = true;
                    let {
                        title,
                        pidTree,
                        url,
                        api,
                        sort,
                        hide
                    } = this.menu;
                    
                    let params = {
                        title: title,
                        selectedMenus: pidTree.length > 0 ? pidTree : 0,
                        url: url,
                        api: api,    
                        sort: sort,
                        hide: hide
                    }
                    if(this.type == 'add') {
                        Http.addMenu(params).then(res => {
                            this.loading = false;
                            this.$handleResponse(res, res => {
                                this.$message({
                                    type: "success",
                                    message: '新增菜单成功'
                                });
                                this.reload();
                                this.$emit("success");
                            })
                        }).catch(err => {
                            this.loading = false;
                        });
                    }else {
                        Http.updateMenu(this.menu.menu_id, params).then(res => {
                            this.loading = false;
                            this.$handleResponse(res, res => {
                                this.$message({
                                    type: "success",
                                    message: "更新菜单成功"
                                });
                                this.reload();
                                this.$emit("success");
                            })
                        }).catch(err => {
                            this.loading = false;
                        });
                    }
                }
            })
        },
        handleClose() {
            this.$emit("cancel");
        }
    }
}
</script>

