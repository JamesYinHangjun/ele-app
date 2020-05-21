<template>
    <div class="Rating-gray">
        <!-- <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i> -->
        <i v-for="(item,index) in itemClasses" :key="index" class="fa" :class="item">
        </i>
    </div>
</template>

<script>
// 星星长度(星星最长为5个星)
const LENGTH = 5;
// 星星对应的class, 全星 对应的 class
const CLS_ON = "fa-star";
// 半星
const CLS_HALF = "fa-star-half-empty";
// 填充(星级剩下的，如评分4.8分，占4.5个星，还要补齐剩下的 0.5个星)
const CLS_OFF = "fa-star-o";

export default {
    name: "Rating",
    props: {
        rating: Number          // 从 IndexShop.vue 中 传过来的
    },
    computed: {
        // 计算星星的个数
        itemClasses() {
            // 得到对应的评分，如 4.8 分,就是 四个全星 一个半星
            let result = [];    // 装 有几个全星和半星

            // 对分数进行处理. 向下取0.5 的倍数
            let score = Math.floor(this.rating * 2) / 2;
            // 控制半星
            let hasDecimal = score % 1 !== 0;    // 有半星
            // 全星
            let integer = Math.floor(score);

            // 把全星放到数组中
            for(let i = 0; i < integer; i++) {
                result.push(CLS_ON);
            }

            // 半星   有半星的话，就把半星 填充到数组中去
            if(hasDecimal) {
                result.push(CLS_HALF);
            }

            // 补齐
            while(result.length < LENGTH) {
                result.push(CLS_OFF)
            }

            return result;
        }
    }
}
</script>

<style scoped>
.Rating-gray {
    margin-right: 1.066667vw;
    color: #ffbe00;
    display: inline-block;
}
</style>
