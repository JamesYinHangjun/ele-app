<template>
  <div class="city">
      <div class="search_wrap">
          <div class="search">
              <i class="fa fa-search"></i>
              <input v-model="city_val" type="text" placeholder="输入城市名">
          </div>
          <button @click="$router.push({name: 'address',params:{city:city}})">取消</button>
      </div>

      <div style="height:100%" v-if="searchList.length == 0">
          <div class="location">
              <Location @click="selectCity({name:city})" :address="city"/>
          </div>
          <Alphabet @selectCity="selectCity" ref="allcity" :cityInfo="cityInfo" :keys="keys"/>
      </div>

      <!-- 这里显示 输入 关键字然后相关城市 显示在页面的功能 -->
      <div class="search_list" v-else>
          <ul>
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
            cityInfo: null,
            keys:[],
            allCities: [],
            searchList: []
        }
    },
    computed: {
        city() {
            // 获取城市或者省份
            return this.$store.getters.location.addressComponent.city || this.$store.getters.location.addressComponent.province;
        }
    },
    created() {
        this.getCityInfo();
    },
    watch: {
            city_val() {
                // console.log(this.city_val);
                this.searchCity();
            }
    },
    methods: {
        getCityInfo() {
            this.$axios("/api/posts/cities")
            .then(res => {
                // console.log(res.data);
                this.cityInfo = res.data;

                // 处理 key
                this.keys = Object.keys(res.data);

                // hotCities 这个 可以 移除掉
                this.keys.pop();       // 最后一个

                // keys 排序
                 this.keys.sort();

                 this.$nextTick( () => {
                     this.$refs.allcity.initScroll();
                 });

                 // 存储所有城市， 用来搜索遍历
                 this.keys.forEach(key => {
                     // console.log(key);
                     //获取到 所有的城市， 然后把结果给 allCities
                     this.cityInfo[key].forEach(city => {
                         // console.log(city);
                         this.allCities.push(city);

                     })
                 })
            })
            .catch(err => {
                // console.log(err);
            });
        },

        selectCity(city) {
            // console.log(city);
            // 得到的值 返回到 address 中去
            this.$router.push({name:"address",params: {city: city.name} });
        },

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
                // 这时已经得到了数据，  比如输入一个 上 字， 会出现23个结果，这时只要把结果显示到页面上就可一乐
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
