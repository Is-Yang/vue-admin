<template>
  <div>
    <section
      class="app-main"
      :class="[{ 'common-section': !this.$route.meta.specialModule }]"
      :style="{'min-height': minHeight+'px'}"
    >
      <router-view :key="key"></router-view>
    </section>
  </div>
</template>


<script>
export default {
  name: "AppMain",
  data() {
    return {
      minHeight: 680
    };
  },
  mounted() {
    this.resetHeight(); // 初始化执行

    window.onresize = () => {
      this.resetHeight(); // 窗口改变执行
    };
  },
  computed: {
    key() {
      return this.$route.name !== undefined
        ? this.$route.name + +new Date()
        : this.$route + +new Date();
    }
  },
  methods: {
    resetHeight() {
      this.minHeight = `${document.documentElement.clientHeight}` - 65;
      if (this.minHeight < 550) this.minHeight = 550;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.app-main {
  margin: 20px 20px 0 20px;
}
</style>
