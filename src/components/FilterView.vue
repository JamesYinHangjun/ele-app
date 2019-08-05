<template>
    <!-- isSort 表示点击了 综合排序。 isScreen 表示点击了筛选。 两个随便点击一个就显示蒙版-->
     <!-- 这层div 是显示蒙版的 @click.self="hideView"当点击自己时蒙版取消 -->
     <div :class="{'open': isSort || isScreen}" @click.self="hideView"> 

         <!-- 导航 -->
        <!-- 判断从父级传来的filterData 是否有内容，有的话 才展示 -->
        <div v-if="filterData" class="filter_wrap">
            <aside class="filter">
                <!-- :class="{'filter-bold':currentFilter == index}"是 实现 点击谁谁加粗的效果 -->
                <div class="filter-nav" v-for="(item,index) in filterData.navTab" :key="index"
                :class="{'filter-bold':currentFilter == index}"
                @click="filterSort(index)"
                >
                    <span>{{item.name}}</span>
                    <i v-if="item.icon" :class="'fa fa-'+item.icon"></i>
                </div>
            </aside>
        </div>


        <!-- 排序 点击综合排序后，出现很多种排序方法(好评优先，销量最高等等)-->
        <section class="filter-extend" v-if="isSort">
            <ul>
                <li v-for="(item,index) in filterData.sortBy" :key="index" @click="selectSort(item,index)">
                    <!-- span 是排序名称 -->
                    <!-- :class="{'selectName':currentSort == index}"表示当选择谁时，谁的后面的√显示 -->
                    <!-- selectName类控制颜色 -->
                    <span
                    :class="{'selectName':currentSort == index}">{{item.name}}</span>
                    <!-- i是勾号    -->
                    <i v-show="currentSort == index" class="fa fa-check"></i>
                </li>
            </ul>
        </section>

        <!-- 筛选 -->
        <section class="filter-extend" v-if="isScreen">
            <div class="filter-sort">
                <div v-for="(screen,index) in filterData.screenBy" :key="index" class="morefilter">
                    <p class="title">{{screen.title}}</p>
                    <ul>
                        <li v-for="(item,i) in screen.data" :key="i"
                        :class="{'selected':item.select}" @click="selectScreen(item,screen)">
                            <img v-if="item.icon" :src="item.icon" alt>
                            <span>{{item.name}}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="morefilter-btn">
                <!-- 清空 按钮 绑定了 一个 edit类 -->
                <!-- 在计算属性中监视 edit，只要 每个screen下的data下的item的select  有true的，清空按钮就能点击 -->
                <span @click="clearFilter" :class="{'edit': edit}" class="morefilter-clear">清空</span>
                <!-- 只做了蜂鸟转送 -->
                <span @click="filterOk" class="morefilter-ok">确定</span>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    name: "FilterView",
    data() {
        return {
            currentFilter: 0,  //更改下标,当前点击的 Filter(综合排序，距离最近等等)
            isSort: false,    // 控制蒙版，正常情况下不显示，点击时显示蒙版
            currentSort: 0,    // 0表示综合排序
            isScreen: false
        }
    },
    props: {
        filterData: Object     // 从父组件 Home.vue 传过来的
    },
    computed: {
        // 清空 按钮 实现的，

        edit() {           //edit 是遍历其中所有select，看是否有 true
            let edit = false;
            this.filterData.screenBy.forEach(screen => {
                screen.data.forEach(item => {
                    if(item.select) {        // 有被选中的
                        edit = true;         // edit 表示 被选中了
                    }
                })
            })
            return edit;
        }
    },
    methods: {
        // 该方法点击不同的排序，出现不同的效果
        filterSort(index) {
            this.currentFilter = index;   //实现点击谁，谁加粗
            switch(index) {
                case 0:       // 当点击第一个（综合排序）时 显示蒙版
                    this.isSort = true;
                    // 当点击 综合排序时，会触发searchFixed事件，在父组件Home.vue中实现
                    this.$emit("searchFixed",true);
                    break;
                case 1:      // 距离最近
                    // 点击 距离最近，会更新数据，会触发父组件中的update 方法
                    this.$emit("update",{
                        condition: this.filterData.navTab[1].condition
                    });
                    this.hideView();
                    break;
                case 2:      // 品质联盟
                    this.$emit("update",{
                        condition: this.filterData.navTab[2].condition
                    });
                    this.hideView();
                    break;
                case 3:      // 筛选
                    this.isScreen = true;
                    this.isSort = false;
                    this.$emit("searchFixed",true);  // 点击筛选时，搜索框也跑到最上面
                    break;
                default:
                    this.hideView();
                    break;
            }
        },
        // 点击 取消蒙版 
        hideView() {
            this.isSort = false;
            this.isScreen = false;
            // 取消搜索框置顶
            this.$emit("searchFixed",false);
        },
        selectSort(item,index) {
            this.currentSort = index;   // 点击 谁
            // 这句是实现 当点击谁，最上面的排序规则就变成了什么
            this.filterData.navTab[0].name = this.filterData.sortBy[index].name;
            this.hideView();   // 点击之后，页面隐藏

            // 更新数据，比如说点击了好评优先，在filterData.sortBy[1].code中会有排序的规则
            // 更新数据应该在 Home.vue 中 更新
            this.$emit("update",{condition: item.code});
        },
        // 筛选页面里面的实现
        selectScreen(item,screen) {
            if(screen.id != "MPI") {     // MPI 的id是0，是多选
                // 单选， 遍历 所有的选项，使其一开始状态为 false
                screen.data.forEach(ele => {
                    ele.select = false
                });
            }
            item.select = !item.select;
        },
        // 点击清空按钮 实现的功能
        clearFilter() {
            this.filterData.screenBy.forEach(screen => {
                screen.data.forEach(item => {
                    item.select = false;
                })
            })
        },
        // 点击 确定 按钮 实现的功能
        filterOk() {
            let screenData = {
                MPI: "",     // 商家活动   只有商家活动有值
                offer: "",   // 优惠活动
                per: ""      // 人均消费
            };
            let mpiStr = "";    // id 为 MPI(多选) 的字符串

            this.filterData.screenBy.forEach(screen => {
                screen.data.forEach((item,index) => {
                    if(item.select) {     // 有选中的
                        // 两种情况 1.多选 2.单选
                        if(screen.id !== "MPI") {
                            // 单选
                            screenData[screen.id] = item.code;
                        } else {
                            // 多选 fengniao,pinpai
                            // 只有 蜂鸟传送和品牌商家 的code有值(我们只实现这两个)
                            mpiStr +=item.code + ",";
                            screenData[screen.id] = mpiStr;
                        }
                    }
                })
            });

            // console.log(mpiStr);
            this.$emit("update", {condition: screenData});

            this.hideView();    // 点击确定按钮之后 ，页面隐藏
        }
    }
}
</script>

<style scoped>
.filter_wrap {
  background: #fff;
  position: sticky;
  top: 54px;
  z-index: 10;
}
.filter {
  position: relative;
  border-bottom: 1px solid #ddd;
  line-height: 10.4vw;
  z-index: 101;
  height: 10.666667vw;
  display: flex;
  justify-content: space-around;
}
.filter-nav {
  flex: 1;
  text-align: center;
  color: #666;
  font-size: 0.8333rem;
}
.filter-nav i {
  width: 1.6vw;
  height: 0.8vw;
  margin-left: 1.333333vw;
  margin-bottom: 0.533333vw;
  fill: #333;
  will-change: transform;
}

/* 加粗 */
.filter-bold {
  font-weight: 600;
  color: #333;
}

/* 显示的蒙版 */
.open {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease-in-out;
  z-index: 3;
}


/* 点击综合排序出现的各种排序方法 */
.filter-extend {
  background-color: #fff;
  color: #333;
  padding-top: 2.133333vw;
  position: absolute;
  width: 100%;
  z-index: 4;
  left: 0;
  top: 24.533333vw;
}
.filter-extend li {
  position: relative;
  padding-left: 5.333333vw;
  line-height: 10.666667vw;
  overflow: hidden;
}
.fa-check {
  float: right;
  color: #009eef;
  margin-right: 3.733333vw;
  line-height: 10.666667vw;
}

.selectName {
  color: #009eef;
}
/* 筛选 */
.filter-sort {
  background: #fff;
  padding: 0 2.666667vw;
  line-height: normal;
}
.morefilter {
  margin: 2.666667vw 0;
  overflow: hidden;
}
.morefilter .title {
  margin-bottom: 2vw;
  color: #666;
  font-size: 0.5rem;
}
.morefilter ul {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 0.8rem;
}
.morefilter li {
  box-sizing: border-box;
  width: 30%;
  height: 9.333333vw;
  line-height: 9.333333vw;
  margin: 0.8vw 1%;
  background: #fafafa;
}
.morefilter li img {
  width: 3.466667vw;
  height: 3.466667vw;
  vertical-align: middle;
  margin-right: 0.8vw;
}
.morefilter li span {
  margin-left: 2%;
  vertical-align: middle;
}

.morefilter-btn {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fafafa;
  box-shadow: 0 -0.266667vw 0.533333vw 0 #ededed;
  line-height: 11.466667vw;
  box-sizing: border-box;
}
.morefilter-btn span {
  font-size: 0.826667rem;
  text-align: center;
  text-decoration: none;
  flex: 1;
}
.morefilter-clear {
  color: #ddd;
  background: #fff;
}
.morefilter-ok {
  color: #fff;
  background: #00d762;
  border: 0.133333vw solid #00d762;
}

.selected {
  color: #3190e8 !important;
  background-color: #edf5ff !important;
}

 /* 清空按钮 可以点击时的颜色 */
.edit {
  color: #333 !important;
}
</style>
