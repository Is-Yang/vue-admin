<template>
  <!-- 快速导航tab -->
  <div class='tabs-view-container'>
    <div class="tabs-view" @click="goPath(tag,index)" v-for="(tag, index) in visitedViews.navs" :key="tag.url">
      <el-tag :closable="true" @close='closeViewTabs(tag, $event, index)' :class="{'is-active': visitedViews.actived == index}">
        {{tag.title}}
      </el-tag>
    </div>

  </div>
</template>

<script>
  export default {
    inject: ['reload'],
    data() {
      return {
        visitedViews: {
          navs: [],
          actived: 0,
        }
      }
    },
    watch: {
      "$route" (to, from) {
        let params = {
          url: to.path.substr(1, to.path.length - 1),
          title: to.name
        }
        this.dealNavs(params);
      }
    },
    created() {
      // let visitedViews = window.localStorage.getItem('visited');
      // this.visitedViews = visitedViews ? JSON.parse(visitedViews) : this.visitedViews;
      // this.$eventHub.$on('vistedNav', (data) => {
        // this.dealNavs(data);
      // })
    },
    methods: {
      closeViewTabs(view, $event, index) {
        $event.preventDefault();
        if (index > this.visitedViews.actived) {
          this.visitedViews.navs.splice(index, 1);
        } else if (index === this.visitedViews.actived) {
          if (this.visitedViews.navs.length === 1) {
            this.visitedViews.navs.splice(index, 1);
            this.visitedViews.actived = 0;
            this.$router.push({
              path: '/index'
            });
            this.reload();
          } else if (this.visitedViews.navs.length > 1) {
            this.visitedViews.navs.splice(index, 1);
            let indexPath = index - 1;
            indexPath < 0 ? this.visitedViews.actived = 0 : this.visitedViews.actived = indexPath;
            window.localStorage.setItem('visited', JSON.stringify(this.visitedViews));
            this.$eventHub.$emit('navFromVisted', '/' + this.visitedViews.navs[this.visitedViews.actived].url); // 改变父元素的当前选中状态
            this.$router.push({
              path: '/' + this.visitedViews.navs[this.visitedViews.actived].url
            });
          }
        } else if (index < this.visitedViews.actived) {
          this.visitedViews.navs.splice(index, 1);
          this.visitedViews.actived--;
        }
        window.localStorage.setItem('visited', JSON.stringify(this.visitedViews));
      },
      dealNavs(data) {
        if (this.isHasData(data)) {
          for (let i = 0; i < this.visitedViews.navs.length; i++) { // 获取当前索引
            if (this.visitedViews.navs[i].url == data.url) {
              this.visitedViews.actived = i;
              break;
            }
          }
        } else {
          this.visitedViews.navs.push(data);
          this.visitedViews.actived = this.visitedViews.navs.length - 1;
        }
        window.localStorage.setItem('visited', JSON.stringify(this.visitedViews));
      },
      isHasData(data) {
        let navs = this.visitedViews.navs;
        if (navs && navs.length > 0) {
          for (let i = 0; i < navs.length; i++) {
            if (data.url === navs[i].url) {
              return true;
            }
          }
        }
        return false;
      },
      goPath(tag, index) {
        this.visitedViews.actived = index;
        this.$eventHub.$emit('navFromVisted', '/' + tag.url); // 改变父元素的当前选中状态
        window.localStorage.setItem('visited', JSON.stringify(this.visitedViews));
        this.$router.push({
          path: '/' + tag.url
        });
      }
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tabs-view-container {
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
    outline: none;
    .tabs-view {
      margin-left: 10px;
      display: inline-block;
      cursor: pointer;
    }
  }

  .el-tag {
    background-color: rgba(64, 158, 255, .1);
  }
 
  .is-active {
    background-color: #409EFF;
    color: #fff;
    /deep/ .el-icon-close {
      color: #fff;
    }
  }

</style>
