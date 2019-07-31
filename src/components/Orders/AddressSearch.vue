<template>
    <!-- showSearch是从父组件views/Orders/AddAddress.vue传过来 -->
    <div v-if="showSearch" class="addressSearch">
        <div class="search-view">
            <div class="search-box">
                <div class="search-box-input">
                    <i class="fa fa-search"></i>
                    <input type="text" placeholder="请输入小区/写字楼/学校等" v-model="search_address">
                </div>

                <!-- 点击取消进入添加地址页 -->
                <!-- 父组件是views/Orders/AddAddress.vue -->
                <button class="search-box-btn" @click="$emit('close')">取消</button>
            </div>

            <!-- 这部分是显示地点搜索出来的相关信息 -->
            <ul class="search-list">
              <li v-for="(item,index) in areaList" :key="index" class="search-row"
              @click="selectAddress(item)">
                <p class="search-row-title">{{item.name}}</p>
                <p class="search-row-location">{{item.district}}{{item.address}}</p>
              </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AddressSearch',
    data() {
        return {
            search_address: '',       // 要搜索的地点
            areaList:[]               // 存储"地点搜索"相关的信息
        }
    },
    props: {
        showSearch: Boolean,       //控制在"点击地址"时才跳转过来
        addressInfo: Object
    },
    computed: {
      city() {
        return (
          this.$store.getters.location.addressComponent.city || 
          this.$store.getters.location.addressComponent.province
        );
      }
    },
    // 监听输入的值
    watch: {
      search_address(val) {     // val 是 输入的值
        // console.log(val)
        this.searchPlace(val)
      }
    },
    methods: {
      searchPlace(val) {
        // console.log(this.city)

        //调用高德地图的搜索
        AMap.plugin('AMap.Autocomplete', () => {
          // 实例化Autocomplete
          var autoOptions = {
            //city 限定城市，默认全国
            // city: '全国'
            city: this.city
          }
          var autoComplete= new AMap.Autocomplete(autoOptions);
          autoComplete.search(val, (status, result) => {
            // 搜索成功时，result即是对应的匹配数据
            // console.log(result)  其中有个tips属性存储了相关地点
            this.areaList = result.tips
          })
        })
      },

      selectAddress(item) {
        // console.log(item)
        this.addressInfo.address = item.name + item.district + item.address;
        // 关闭这个页面
        this.$emit("close")
      }
    }
}
</script>

<style scoped>
.addressSearch {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 45px;
}
.search-view {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  background-color: #fff;
}
.search-box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.133333vw 3.866667vw 1.866667vw;
}
.search-box-input {
  flex: 1;
  border: 1px solid #ddd;
  outline: 0;
  color: #999;
  height: 7.466667vw;
  margin-right: 2.666667vw;
  border-radius: 0.533333vw;
  background: #f5f5f5;
  padding: 0 2.133333vw;
  display: flex;
  align-items: center;
}
.search-box-input > input {
  margin-left: 2vw;
  width: 90%;
  background: none;
}
input,
button {
  outline: none;
  border: none;
}
.search-box-btn {
  color: #333;
  border-radius: 0.533333vw;
  width: 14.8vw;
  height: 7.466667vw;
  font-size: 0.9rem;
  white-space: nowrap;
}

.search-list {
  padding-left: 4vw;
}
.search-row {
  border-bottom: 0.266667vw solid #eee;
  padding: 2.533333vw 0 3.333333vw;
  line-height: 1.2;
}
.search-row-title {
  color: #333;
  font-size: 1rem;
}
.search-row-location {
  color: #999;
  font-size: 0.866rem;
}
</style>
