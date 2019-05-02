<template>
  <div class="uedit_scrm clearfix">
    <div id="ueditor" editor-content></div>
  </div>
</template>

<script>
export default {
  props:{
    configs: {
      type: Object,
      defautl(){
        return {}
      }
    },
    height:{
      type: Number,
    }
  },
  data(){
    return{
      UEinstance: '',
      toolbars:[],
      defaultConfig: {
        initialFrameWidth: '100%',
        initialFrameHeight: this.height || 456,
        autoHeightEnabled: !this.height,
        catchRemoteImageEnable: false,
        topOffset: 60,
        toolbars: [[
          'undo', 'redo', '|', 'fontsize', '|', 'blockquote', 'horizontal', '|', 'removeformat', 'formatmatch', '|', 'link', 'unlink',
        ],['bold', 'italic', 'underline', 'forecolor', 'backcolor', '|',
          'indent', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify','outpadding', '|',
          'rowspacingtop', 'rowspacingbottom', 'lineheight', 'fontborder', '|',
          'insertorderedlist', 'insertunorderedlist', '|', 'insertvideo', '|',
          'imagenone', 'imageleft', 'imageright', 'imagecenter', 'insertimage',]]
      },
    }
  },
  mounted(){
    this.defaultConfig = Object.assign(this.defaultConfig, this.configs); // 把新的配置赋予
    this.initEditor();
  },
  methods: {
    initEditor(){
      const _this = this;
      //dom元素已经挂载上去了
      this.$nextTick(() => {
        
        this.UEinstance = UE.getEditor('ueditor', this.defaultConfig);
  
        // 绑定事件，当 UEditor 初始化完成后，将编辑器实例通过自定义的 ready 事件交出去
        this.UEinstance.addListener('ready', () => {
            this.$emit('ready', this.UEinstance);
        });
      });
    },
  },
  destroyed(){
    if(this.UEinstance && this.UEinstance.destroy){ // 如果路由初始化没完成就被重定向到别的路由，很容易报错
      this.UEinstance.destroy();
    }
  }
}
</script>

<style lang="scss" scoped>
  
</style>
