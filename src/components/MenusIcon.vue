<template>
    <i :class="iconName" class="icon-img"></i>
</template>

<script>
export default {
    name: 'MenusIcon',
    props: {
        iconClass: {
            type: String,
            required:true
        },
        className: {
            type: String,
            default: ''
        },
        isActive: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        iconName() {
            let iconC = this.isActive ? `icon-${this.iconClass.split('/').join('-')}-active` : `icon-${this.iconClass.split('/').join('-')}`;
            return iconC
        },
    }
}
</script>

<style lang="scss" scoped>
    .icon-img{
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 4px;
    }
    .icon-xg-basic{
        background: url('~@/assets/images/icons/xg/basic.png')
    }
    .icon-xg-basic-active{
        background: url('~@/assets/images/icons/xg/basic_1.png')
    }
    .icon-xg-marketing{
        background: url('~@/assets/images/icons/xg/marketing.png')
    }
    .icon-xg-marketing-active{
        background: url('~@/assets/images/icons/xg/marketing_1.png')
    }
    .icon-xg-setting{
        background: url('~@/assets/images/icons/xg/setting.png')
    }
    .icon-xg-setting-active{
        background: url('~@/assets/images/icons/xg/setting_1.png')
    }

    .icon-system-parameter{
        background: url('~@/assets/images/icons/system/parameter.png')
    }
    .icon-system-parameter-active{
        background: url('~@/assets/images/icons/system/parameter_1.png')
    }
    .icon-system-role{
        background: url('~@/assets/images/icons/system/role.png')
    }
    .icon-system-role-active{
        background: url('~@/assets/images/icons/system/role_1.png')
    }
    .icon-system-org{
        background: url('~@/assets/images/icons/system/org.png')
    }
    .icon-system-org-active{
        background: url('~@/assets/images/icons/system/org_1.png')
    }

    .icon-marketTool-template{
        background: url('~@/assets/images/icons/marketTool/template.png')
    }
    .icon-marketTool-template-active{
        background: url('~@/assets/images/icons/marketTool/template_1.png')
    }


</style>
