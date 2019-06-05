<template>
  <div class="home">
      <div class="header">
          <!-- 点击跳转到 Address.vue 中 ，顺便 把 computed的 city 值传入过去-->
          <div class="address_map" @click="$router.push({name: 'address',params: {city:city}})">
              <i class="fa fa-map-marker"></i>
              <span>{{address}}</span>
              <i class="fa fa-sort-desc"></i>
          </div>

          <!-- 将搜索框 放入下面的 search_wrap 容器中，是为了实现当向下滑动时，搜索框仍然在最上面 -->
          <!-- <div class="shop_search">
              <i class="fa fa-search"></i>
              搜索商家 商家名称
          </div> -->
      </div>

      <!-- 没有放在header中，是为了实现当向下滑动时，搜索框仍然在最上面 -->
      <div class="search_wrap" :class="{'fixedview':showFilter}" @click="$router.push('/search')">
          <div class="shop_search">
              <i class="fa fa-search"></i>
              搜索商家 商家名称
          </div>
      </div>

      <div id="container">
          <!-- 轮播 -->
          <mt-swipe :auto="4000" class="swiper">
              <mt-swipe-item v-for="(img,index) in swipeImgs" :key="index">
                  <img :src="img" alt="">
              </mt-swipe-item>
          </mt-swipe>

          <!-- 分类 -->
          <mt-swipe :auto="0" class="entries">
              <!-- 首先遍历的是 entries(首先是两页) -->
              <mt-swipe-item v-for="(entry,i) in entries" :key="i" class="entry_wrap">
                  <!-- 然后遍历的是每页上面的小分类(每一个具体的entry) -->
                  <div class="foodentry" v-for="(item,index) in entry" :key="index">
                      <!-- 上面图片 -->
                      <div class="img_wrap">
                          <img :src="item.image" alt="">
                      </div>
                      <!-- 下面 字 -->
                      <span>{{item.name}}</span>
                  </div>

              </mt-swipe-item>
          </mt-swipe>
      </div>

      <!-- 推荐商家 -->
      <div class="shoplist-title">
          推荐商家
      </div>

      <!-- 导航 -->
      <FilterView :filterData="filterData"
      @searchFixed = "showFilterView" @update="update"/>

      <!-- 商家信息 -->
      <!-- 实现 下拉刷新，上拉加载 -->
      <mt-loadmore
        :top-method="loadData"
        :bottom-method="loadMore"
        :bottom-all-loaded="allLoaded"
        :auto-fill="false"
        :bottomPullText="bottomPullText"
        ref="loadmore"
        >

        <div class="shoplist">
            <IndexShop v-for="(item,index) in restaurants" :key="index"
            :restaurant = "item.restaurant"/>
        </div>
      </mt-loadmore>

  </div>
</template>

<script>
import { Swipe, SwipeItem,Loadmore } from 'mint-ui';
import FilterView from "../components/FilterView";
import IndexShop from "../components/IndexShop"
export default {
    name: "home",
    data() {
        return {
            swipeImgs: [],  // swipeImgs和entries 里面装的全是从 /api/profile/shopping中访问得到的内容
            entries: [],
            filterData: null,  //对象 存储 从 /api/profile/filter 得到的数据
            showFilter: false,  //控制搜索框 跑到最上面

            page: 1,            // 商家 中 第几页
            size: 5,            // 请求的 条数
            restaurants: [],     // 用于 存放 所有商家 容器
            allLoaded: false,
            bottomPullText: "上拉加载更多",
            data: null
        }
    },
    computed: {
        // 将定位到的地点 通过 computed 获取到，然后放到收获地址 上
        address() {
            return this.$store.getters.address;
        },
        city() {
            // 获取城市或者省份，放到 Address.vue 中 的城市定位中
            return this.$store.getters.location.addressComponent.city || this.$store.getters.location.addressComponent.province;
        }
    },
    //轮播,网页一进来就显示
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.$axios('/api/profile/shopping').then(res => {
                // console.log(res.data);  // 这个时候会得到四张图片，
                // 然后把图片存储在 data 中的 swipeImgs 中
                this.swipeImgs = res.data.swipeImgs;//存储轮播的四张图片
                this.entries = res.data.entries;//存储轮播图下面的图片
            });
            this.$axios("/api/profile/filter").then(res => {
                console.log(res.data);
                this.filterData = res.data;
            });

            this.loadData();
            // // 拉取首页中 下面的 商家信息
            // // /api/profile/restaurant/1/5   第一页 有五个商家
            // this.$axios.post(`/api/profile/restaurants/1/5`)
            // .then(res => {
            //     console.log(res.data);
            //     this.restaurants = res.data;
            // })
        },

        // 该方法是显示商品 上拉加载的
        loadData() {
            // 一进来 使 page =1
            this.page = 1;
            this.allLoaded = false;
            this.bottomPullText = "上拉加载更多"
            // 拉取首页中 下面的 商家信息
            // /api/profile/restaurant/1/5   第一页 有五个商家
            this.$axios.post(`/api/profile/restaurants/${this.page}/${this.size}`,this.data)
            .then(res => {
                // console.log(res.data);
                this.$refs.loadmore.onTopLoaded();
                this.restaurants = res.data;
            })
        },
        //上拉加载
        loadMore() {
            if(!this.allLoaded) {
                this.page++;
            // 拉取首页中 下面的 商家信息
            this.$axios.post(`/api/profile/restaurants/${this.page}/${this.size}`)
            .then(res => {
                // 加载完之后 重新渲染
                this.$refs.loadmore.onBottomLoaded();
                if(res.data.length > 0) {
                    res.data.forEach(item => {
                        this.restaurants.push(item);
                    });
                    if(res.data < this.size) {
                        this.allLoaded = true;
                        this.bottomPullText = "没有更多了哦";
                    }
                } else {
                    // 数据为空
                    this.allLoaded = true;
                    this.bottomPullText = "没有更多了哦";
                }
              })
            }
        },
        showFilterView(isShow) {
            this.showFilter = isShow;
        },
        update(condition) {
            // console.log(condition);
            this.data = condition;
            this.loadData();
        }
    },
    components: {
        FilterView,
        IndexShop
    }
}
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
.header,
.search_wrap {
  background-color: #009eef;
  padding: 10px 16px;
}
.header .address_map {
  color: #fff;
  font-weight: bold;
}
.address_map i {
  margin: 0 3px;
  font-size: 18px;
}
.address_map span {
  display: inline-block;
  width: 80%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.search_wrap .shop_search {
  /* margin-top: 10px; */
  background-color: #fff;
  padding: 10px 0;
  border-radius: 4px;
  text-align: center;
  color: #aaa;
}

.search_wrap {
    position: sticky;
    top: 0px;
    z-index: 999;
    box-sizing: border-box;
}

/* 轮播图 */
.swiper {
    height: 100px;
}
.swiper img {
    width: 100%;
    height: 100px;
}

/* 分类 */
.entries {
  background: #fff;
  height: 47.2vw;
  text-align: center;
  overflow: hidden;
}
.foodentry {
  width: 20%;
  float: left;
  position: relative;
  margin-top: 2.933333vw;
}
.foodentry .img_wrap {
  position: relative;
  display: inline-block;
  width: 12vw;
  height: 12vw;
}
.img_wrap img {
  width: 100%;
  height: 100%;
}
.foodentry span {
  display: block;
  color: #666;
  font-size: 0.32rem;
}

/* 推荐商家 */
.shoplist-title {
  display: flex;
  align-items: flex;
  justify-content: center;
  height: 9.6vw;
  line-height: 9.6vw;
  font-size: 16px;
  color: #333;
  background: #fff;
}
.shoplist-title:after,
.shoplist-title:before {
  display: block;
  content: "一";
  width: 5.333333vw;
  height: 0.266667vw;
  color: #999;
}
.shoplist-title:before {
  margin-right: 3.466667vw;
}
.shoplist-title:after {
  margin-left: 3.466667vw;
}

/* 搜索框中的,用来控制 当点击 综合排序(在 FilterView.vue中)时，搜索框跑到最上方 */
.fixedview {
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 999;
}

.mint-loadmore {
    height: calc(100% - 95px);
    overflow: auto;
}
</style>
