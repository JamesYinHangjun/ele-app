<template>
  <div class="header">
    <!-- 左侧返回 -->
    <div class="header-button is-left" v-show="isLeft">
      <i class="fa fa-chevron-left"></i>
      <button @click="$router.go(-1)">返回</button>
    </div>
    <!-- 中间标题 -->
    <h1 class="header-title">{{title}}</h1>
  </div>
</template>

<script>
export default {
    name: "Header",
    props: {
      // 从父组件 Address.vue传递下来的
        title: String,
        isLeft: {
            type: Boolean,
            default: false
        }
    }
}
</script> 

<style scoped>
.header {
  background-color: #009eef;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  align-items: center;
  font-size: 16px;
  height: 45px;
  width: 100%;
  line-height: 1;
  padding: 0 10px;
  position: relative;
  text-align: center;
  white-space: nowrap;
  position: fixed;
  top: 0;
  z-index: 99;
}

.header-button button {
  background-color: transparent;
  border: 0;
  box-shadow: none;
  color: inherit;
  display: inline-block;
  padding: 0;
  font-size: inherit;
  outline: none;
}
.header-title {
  flex: 1;
}
.is-left {
  text-align: left;
}
</style>
