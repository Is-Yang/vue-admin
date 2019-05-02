<template>
  <div class="error-page">
    <div class="errorWarp">
      <div class="image">
        <img :src="image"/>
      </div>
      <!-- <h2 class="title" v-text="title"></h2> -->
      <h3 class="desc" v-text="desc"></h3>
      <!-- <router-link :to="path" class="backBtn" tag="span">返回首页</router-link> -->
    </div>
  </div>
</template>
<script type="text/javascript">
  export default {
    name: 'noPage',
    data() {
      return {
        image: require('./images/404_error.png'),
        title: 'PAGE NOT FOUND',
        desc: '抱歉，找不到对应的页面',
        path: '/xg/basic/all'
      }
    }
  }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">
  .error-page {
    text-align: center;
    .errorWarp {
      margin: 10% auto auto auto;
      .image {
        margin: 20px auto;
      }
      .title {
        color: #fff;
        font-size: 64px;
        padding: 15px 30px;
        margin-bottom: 20px;
        margin-top: 50px;
        font-weight: bold;
      }
      .desc {
        font-size: 32px;
        color: #474747;
        font-weight: bold;
        line-height: 30px;
        margin-top: 50px;
      }
      .backBtn {
        display: inline-block;
        color: #fff;
        margin-bottom: 20px;
        margin-top: 50px;
        padding: 15px 30px;
        border: 1px solid #fff;
        border-radius: 5px;
        cursor: pointer;
      }
    }
  }
</style>
