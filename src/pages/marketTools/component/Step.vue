<template>
  <div class="step__order por">
    <span class="step_left">{{step.title}}</span><span>{{step.content}}</span>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Object,
      default(){
        return {
          title: '第一步',
          content: '海报内容'
        }
      }
    }
  },
  data(){
    return{

    }
  }
}
</script>

<style lang="scss" scoped>
.step__order{
  height: 36px;
  line-height: 36px;
  background: #eef3f9;
  font-size: 15px;
  color: #1494EB;
  padding-left: 30px;
  font-weight: 700;
  &:before {
    content: '';
    width: 0;
    height: 0;
    border: 18px solid transparent;
    border-left: 18px solid #1494EB;
    position: absolute;
    left: 0;
  }
  .step_left{
    margin-right: 22px;
  }
}
</style>

