<template>
    <!-- 点击首页中商家进入的页面 -->
    <div class="shop" v-if="shopInfo">
        <!-- 头部 -->
        <nav class="header-nav">
            <div class="nav_bg">
                <img :src="shopInfo.rst.scheme" alt="">
            </div>
            <!-- 左上的那个返回的小箭头 -->
            <div class="nav_back">
                <i @click="$router.push('/home')" class="fa fa-chevron-left"></i>
            </div>
            <!-- 汉堡王那张图片 -->
            <div class="shop_image">
                <img :src="shopInfo.rst.image_path" alt="">
            </div>
        </nav>

        <!-- 弹窗的title 商家信息    -->
        <div class="index-rst">
            <div class="rst-name">
                <span @click="showInfoModel=true">{{shopInfo.rst.name}}</span>
                <i class="fa fa-caret-right"></i>
            </div>
            <!-- 弹窗信息 -->
            <InfoModel @close="showInfoModel=false" :rst="shopInfo.rst" :showInfoModel="showInfoModel"/>

            <!-- 评分月售 -->
            <div class="rst-order">
                <span>评分{{shopInfo.rst.rating}}</span>
                <span>月售{{shopInfo.rst.recent_order_num}}单</span>
                <span>蜂鸟专送约{{shopInfo.rst.order_lead_time}}分钟</span>
            </div>

            <!-- 优惠信息 -->
            <Activity :activities="shopInfo.rst.activities" />

            <!-- 公告 -->
            <p class="rst-promotion">公告: {{shopInfo.rst.promotion_info}}</p>

        </div>

        <!-- 导航 -->
        <NavBar />
        <router-view></router-view>
    </div>
</template>

<script>
import InfoModel from '../../components/Shops/InfoModel'
import Activity from "../../components/Shops/Activity"
import NavBar from "../../components/Shops/NavBar"
export default {
    name: "Shop",
    data() {
        return {
            shopInfo:null,     // 存储访问后得到的数据
            showInfoModel: false   // 开关，控制components/Shops/InfoModel.vue的显示与隐藏，商品信息的弹窗的显示与隐藏
        }
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.$axios("/api/profile/batch_shop").then(res => {
                console.log(res.data);
                this.shopInfo = res.data;
            })
        }
    },
    components: {
        InfoModel,
        Activity,
        NavBar
    }
}
</script>

<style scoped>
.shop {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
.header-nav {
  position: relative;
}
.nav_bg img {
  width: 100%;
  height: 26.666667vw;
}
.nav_back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 26.666667vw;
  background: rgba(0, 0, 0, 0.5);
}
.nav_back i {
  color: #fff;
  font-size: 1.3rem;
  margin-left: 1.333333vw;
  margin-top: 1.333333vw;
}
.shop_image {
  position: absolute;
  top: 0;
  left: 50%;
  margin-left: -10vw;
  margin-top: 11vw;
}
.shop_image img {
  width: 20vw;
  height: 20vw;
  border-radius: 0.8vw;
}

.index-rst {
  padding: 8vw 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  box-shadow: inset 0 -0.666667vw 0.666667vw hsla;
}
.index-rst .rst-name {
  flex: 1;
  width: 72vw;
  font-size: 1.3rem;
  font-weight: 700;
  white-space: nowrap;
  padding-right: 2.666667vw;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.6vw 0;
}
</style>
