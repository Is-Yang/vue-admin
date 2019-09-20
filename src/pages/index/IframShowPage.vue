<template>
<div>
    <iframe id="myiframe" :src="link" width="100%" frameborder="0"></iframe>
</div>
</template>

<script>
export default {
    data() {
        return {
            link: '',
            height: 680
        }
    }, 
    mounted() {
        this.resetHeight(); // 初始化执行

        window.onresize = () => {
            this.resetHeight(); // 窗口改变执行
        };
    },
    created () {
        let page = this.$route.query && this.$route.query.page;  
        switch (page) {
            case '1':
                this.link = 'http://ent.hazard.scaqjg.com';
                break;
            case '2':
                this.link = 'http://202.61.89.197:85/FrameSet/Login.aspx';
                break;
            case '3':
                this.link = 'http://aqsq.tccxfw.com';
                break;
            case '4':
                this.link = 'http://www.czax.org/cyxx';
                break;
        
            default:
                break;
        }

        this.setStyle('is');
    },
    methods: {
        resetHeight() {
            this.height = `${document.documentElement.clientHeight}` - 80;
            var ifm= document.getElementById("myiframe");
		    ifm.height = this.height;
        },
        setStyle(flag) {
            let html = document.getElementsByTagName('html')[0];
            html.style.height = flag ? 'auto' : '';
            html.style.overflow = flag ? "hidden" : '';
        }
    }, 
    destroyed() {
        this.setStyle();
    }
}
</script>
