<template>
    <div class="address">
        <Header :isLeft="true" title="选择收获地址"/>
        <div class="city_search">
            <div class="search">
                <!-- 这里添加点击事件，路由跳转到 City.vue 去 -->
                <span class="city" @click="$router.push('/city')">
                    {{city}}
                    <i class="fa fa-angle-down"></i>
                </span>
                <i class="fa fa-search"></i>
                <input type="text" v-model="search_val" placeholder="小区/学校/写字楼">
            </div>

            <!-- Location -->
            <!-- 这个方法是从 Location.vue中传过来的 -->
            <Location @click="selectAddress" :address="address"/>
        </div>

        <div class="area">
            <ul class="area_list" v-for="(item,index) in areaList" :key="index">
                <!-- li是搜索得到的每一个信息 -->
                <!-- 设置点击方法，获取到相关的地址内容，然后传给 Home.vue 中去 -->
                <li @click="selectAddress(item)">
                    <h4>{{item.name}}</h4>
                    <p>{{item.district}}{{item.address}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Header from "../components/Header";
import Location from "../components/Location"
export default {
    name: "Address",
    data() {
        return {
            // city: "北京",       // 当前的城市
            city: "",
            search_val: "",       // 要搜索的值
            areaList: []
        };
    },
    computed: {
        address() {
            // 传到loaction.vue 中的当前定位后
            return this.$store.getters.location.formattedAddress;
        }
    },
    watch: {
        search_val() {
            this.searchPlace();
        }
    },
    methods: {
        searchPlace() {
            // console.log(this.search_val);
            const self = this;

            AMap.plugin('AMap.Autocomplete', function(){
              // 实例化Autocomplete
              var autoOptions = {
                //city 限定城市，默认全国
                city: self.city
              }
              var autoComplete= new AMap.Autocomplete(autoOptions);
              autoComplete.search(self.search_val, function(status, result) {
                // 搜索成功时，result即是对应的匹配数据
                // console.log(result); 其中有个 tips  属性
                self.areaList = result.tips;
                });
            });
        },

        selectAddress(item) {
            // 设置地址
            if (item) {      //  传参
                this.$store.dispatch("setAddress",item.district + item.address + item.name);
            } else {
                this.$store.dispatch("setAddress",this.address);
            }

            // 跳转 到 home
            this.$router.push("/home");
        }

    },
    components: {
        Header,
        Location
    },
    // 进入 Address.vue 之前要做的事
    // 在进入 Address.vue之前，先获得定位得到的地址
    beforeRouteEnter(to,from,next) {
        // console.log(to.params.city);
        next(vm => {
            // vm.city指的是Address.vue的data() 的 city值
            // to.params.city 指的是从Home.vue 中传过来的值， 注意 ： 这里用的是 to, 不是 from
            vm.city = to.params.city;
        });
    }
}
</script>

<style scoped>
.address {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding-top: 45px;
}

.city_search {
  background-color: #fff;
  padding: 10px 20px;
  color: #333;
}

.search {
  background-color: #eee;
  height: 40px;
  border-radius: 10px;
  box-sizing: border-box;
  line-height: 40px;
}
.search .city {
  padding: 0 10px;
}
.city i {
  margin-right: 10px;
}
.search input {
  margin-left: 5px;
  background-color: #eee;
  outline: none;
  border: none;
}

.area {
  margin-top: 16px;
  background: #fff;
}
.area li {
  border-bottom: 1px solid #eee;
  padding: 8px 16px;
  color: #aaa;
}
.area li h4 {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}
</style>
