<template>
  <div class="city">
      <!-- 最上面一行: 搜索框和取消按钮 -->
      <div class="search_wrap">
          <div class="search">
              <i class="fa fa-search"></i>
              <input v-model="city_val" type="text" placeholder="输入城市名">
          </div>

          <!-- 点击 取消 按钮， 回到 Address.vue 中 -->
          <button @click="$router.push({name: 'address',params:{city:city}})">取消</button>
      </div>


      <!-- 当搜索框中，没有输入值时  v-if="searchList.length == 0"-->
      <div style="height:100%" v-if="searchList.length == 0">
          <div class="location">
              <!-- city要传到location组件 -->
              <Location @click="selectCity({name:city})" :address="city"/>
          </div>
          <!-- 字母表 -->
          <!-- 这里调用Alphabet.vue中的 selectCity 方法 -->
          <Alphabet @selectCity="selectCity" ref="allcity" :cityInfo="cityInfo" :keys="keys"/>
      </div>

      <!-- 这里显示输入关键字然后相关城市 显示在页面的功能 -->
      <!-- 这里用 v-else 是因为当输入 关键字搜索后，页面其他的 内容都没有了，只出来了 关键字 相关的内容 -->
      <div class="search_list" v-else>
          <ul>
              <!-- 点击跳转到 Address.vue 中 -->
              <li @click="selectCity(item)" v-for="(item,index) in searchList" :key="index">
                  {{item.name}}
              </li>
          </ul>
      </div>
  </div>
</template>

<script>
import Location from "../components/Location";
import Alphabet from "../components/Alphabet";
export default {
    name: "City",
    data() {
        return {
            city_val: "",
            cityInfo: null,   // 用来 存储 得到的城市数据,包括 0,1,2.。
            keys:[],          // 存储A-Z 和 hotCities 的 key
            allCities: [],    // 存放 所有的城市
            searchList: []    // 搜索框中 搜索出阿里的 值 放进去，比如说搜索 上 ，出来关于上的城市全部存进去
        }
    },
    computed: {
        city() {
            // 获取城市或者省份  从 Home.vue 中 拷贝的
            return this.$store.getters.location.addressComponent.city || this.$store.getters.location.addressComponent.province;
        }
    },
    // 一进入 City.vue这个页面，就进行一个对 城市 的请求
    created() {
        this.getCityInfo();
    },
    watch: {
            // 在获取到所有城市之后监听
            city_val() {
                // console.log(this.city_val);
                this.searchCity();
            }
    },
    methods: {
        // 获取城市的信息
        getCityInfo() {
            this.$axios("/api/posts/cities")
            .then(res => {
                // console.log(res.data);
                this.cityInfo = res.data;

                // 处理 key,计算 key
                // 得到res.data 中所有的keys ，包括A-Z和hotCities
                this.keys = Object.keys(res.data);
                // console.log(this.keys);

                // hotCities 这个 key 移除掉
                this.keys.pop();       // 最后一个

                // keys 排序
                this.keys.sort();
                // console.log(this.keys);

                // 数据请求完成之后执行
                // this.$refs.allcity指的是 Alphabet.vue组件
                 this.$nextTick( () => {
                     this.$refs.allcity.initScroll();
                 });

                 // 存储所有城市， 用来搜索遍历
                 this.keys.forEach(key => {
                     // console.log(key);     得到 A- Z
                     //获取到 所有的城市， 然后把结果给 allCities
                     this.cityInfo[key].forEach(city => {
                         // console.log(city);    得到所有的城市 如 安庆 鞍山。。
                         this.allCities.push(city);

                     })
                 });
            })
            .catch(err => {
                // console.log(err);
            });
        },

        selectCity(city) {
            // console.log(city);
            // 把得到的值(城市) 返回到 address 中去
            this.$router.push({name:"address",params: {city: city.name} });
        },

        // 输入框中输入关键字，查询城市   比如 输入 上， 出现 上海 上饶等
        searchCity() {
            if(!this.city_val) {
                // 如果搜索框为空，数组置 空
                this.searchList = [];
            } else {
                // 根据输入框的关键字检索城市，并存入到 searchList 数组中
                this.searchList = this.allCities.filter(item => {
                    return item.name.indexOf(this.city_val) != -1;
                });

                // console.log(this.searchList);
                // 这时已经得到了数据，  比如输入一个 上 字， 会出现12个结果，这时只要把结果显示到页面上就可以了
            }
        }
    },
    components: {
        Location,
        Alphabet
    }
}
</script>

<style scoped>
.city {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding-top: 45px;
}
.search_wrap {
  position: fixed;
  top: 0;
  height: 45px;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 3px 16px;
  display: flex;
  justify-content: space-between;
}
.search {
  background-color: #eee;
  border-radius: 10px;
  line-height: 40px;
  width: 85%;
  box-sizing: border-box;
  padding: 0 16px;
}
.search input {
  background: #eee;
  outline: none;
  border: none;
  margin-left: 5px;
}
.search_wrap button {
  outline: none;
  color: #009eef;
}


.location {
  background: #fff;
  padding: 8px 16px;
  height: 65px;
  box-sizing: border-box;
}

.search_list {
  background: #fff;
  padding: 5px 16px;
}
.search_list li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
</style>
