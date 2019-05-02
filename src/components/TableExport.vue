<template>
    <div class="margin-bottom-20">
        <el-button class="re-primary-button" plain round type="primary" size="small" icon="el-icon-download" @click="exportTable()" :loading="loading">导出</el-button>
    </div>
</template>

<script>
import moment from "moment";
import http from '@/utils/request';
export default {
    props: ['url', 'params', 'filename', 'method'],
    data () {
        return {
            loading: false
        }
    },
    methods: {
        exportTable (ext = 'xls') {
            this.loading = true;
            let qusMethod = this.method == 'get' ? 'getDownAjax' : 'postAjax';  // 请求方式判断(只考虑get和post两种方式)
            http[qusMethod](
                this.url,
                this.params,
                { responseType: 'blob'}
            ).then(res => {
                if(res.status === 200) {
                    this.loading = false;
                    const blob = new Blob([res.data]);
                    const a = document.createElement('a');
                    a.href = window.URL.createObjectURL(blob);
                    a.download = `${this.filename}-${moment().format('YYYYMMDDHHmmss')}.${ext}`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                } else {
                    this.$message.error("请刷新页面重试！");
                }

            }).catch(error => {
                console.log(error);
            })
        }
    }
}
</script>

