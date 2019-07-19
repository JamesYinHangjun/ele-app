<template>
  <div class="index">
      <!-- 有三个子路由，Home.vue  Me.vue  Order.vue -->
      <!-- 占坑 -->
      <router-view></router-view>
      <TabBar :data="tabbarData"/> 
  </div>
</template>
  
<script>
import TabBar from "../components/TabBar";
export default {
    name: "index",
    data() {
        return {
            tabbarData: [
                {title: "首页",icon: "home",path: "/home"},
                {title: "订单",icon: "file-text-o",path: "/order"},
                {title: "我的",icon: "user",path: "/me"}
            ]
        }
    },
    components: {
        TabBar
    }
}
</script>

<style scoped>
.index {
  width: 100%;
  /* 减掉的45px是TabBar的高度(它是固定的) */
  height: calc(100% - 45px);
}
</style>
