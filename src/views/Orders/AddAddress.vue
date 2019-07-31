<template>
    <div class="addAddress">
        <Header :isLeft="true" :title="title" />

        <!-- 添加地址 -->
        <div class="viewbody">
            <div class="content">
                <FormBlock 
                  label="联系人" 
                  placeholder="姓名" 
                  :tags="sexes" 
                  @checkSex="checkSex" 
                  :sex="addressInfo.sex"
                  v-model="addressInfo.name"
                />

                <FormBlock 
                  label="电话" 
                  placeholder="手机号码" 
                  v-model="addressInfo.phone"
                />

                <FormBlock 
                  label="地址" 
                  placeholder="小区/写字楼/学校" 
                  icon="angle-right" 
                  v-model="addressInfo.address" 
                  @click="showSearch=true"/>

                <FormBlock 
                  label="门牌号" 
                  placeholder="10号楼5单元404" 
                  icon="edit" textarea="textarea"
                  v-model="addressInfo.bottom"
                />
                
                <div class="formblock">
                    <div class="label-wrap">标签</div>
                    <!-- selectTag选中的标签 传给子组件.传过去之后和item比较，如果一样，就会有checked样式 -->
                    <TabTag :tags="tags" :selectTag="addressInfo.tag" @checkTag="checkTag"/>
                </div>
            </div>

            <!-- 确定按钮 -->
            <div class="form-button-wrap">
              <button @click="handleSave" class="form-button">确定</button>
            </div>
        </div>

        <!-- 搜索地址 -->
        <!-- 写在这里的原因是因为 它的路由地址也是addAddress -->
        <!-- @close="showSearch=false"这里改变showSearch为什么通过子组件emit方法传到父组件修改
            是因为如果在子组件修改后，父组件的showSearch没有改变 -->
        <AddressSearch @close="showSearch=false" :showSearch="showSearch" 
        :addressInfo="addressInfo"/>
    </div>
</template>

<script>
import Header from '../../components/Header'
import FormBlock from '../../components/Orders/FormBlock'
import TabTag from '../../components/Orders/TabTag'
import AddressSearch from '../../components/Orders/AddressSearch'
import { Toast } from 'mint-ui'
export default {
    name: 'AddAddress',
    data() {
        return {
            title: '',
            tags: ["家","学校","公司"],
            sexes: ["先生","女士"],
            // addressInfo: {             // 存储地址表单的所有信息，之后会post到数据库中
            //     tag: "",
            //     sex: '',
            //     address: '',
            //     name: '',
            //     phone: '',
            //     bottom: ''             // 门牌号
            // },  
            addressInfo: {},       // 这里变成空对象是因为其他地方传递了，此组件接收了
            showSearch: false      // 控制components/Orders/AddressSearch.vue是否显示
        }
    },
    // 页面跳转进来之前要执行的事
    // 这里指的是从MyAddress.vue中点击"编辑"进入此页面之前发生的事(把值传过来)
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // 这个to指的是MyAddress.vue
        vm.addressInfo = to.params.addressInfo 
        vm.title = to.params.title
      })
    },
    methods: {
        checkTag(item) {     //这个item指 家 学校 公司 ，点击谁返回谁
            // console.log(item)
            this.addressInfo.tag = item;
        },
        checkSex(item) {
            // console.log(item)
            this.addressInfo.sex = item;
        },
        // 点击确定按钮
        handleSave() {
          // console.log(this.addressInfo)
          if(!this.addressInfo.name) {
            this.showMsg('请输入联系人');
            return;
          }
          if(!this.addressInfo.phone) {
            this.showMsg('请输入手机号码');
            return;
          }
          if(!this.addressInfo.address) {
            this.showMsg('请输入收货地址');
            return;
          }

          // 存储数据
          // this.addAddress();
          if(this.title == '添加地址') {
            this.addAddress();
          } else {
            //编辑地址
            this.editAddress()
          }
        },
        showMsg(msg) {
          Toast({
            message: msg,
            position: 'bottom',
            duration: 2000
          });
        },
        // 以每个人的id添加地址
        addAddress() {
          this.$axios.post(`/api/user/add_address/${localStorage.ele_login}`,this.addressInfo)
          .then(res => {
            // console.log(res.data)
            // 判断新加的地址有没有存储到vuex中，如果没有，就先添加到vuex中去
            if(!this.$store.getters.UserInfo) {
              this.$store.dispatch("setUserInfo",this.addressInfo)
            }
            this.$router.push("myAddress")
          })
          .catch(err => console.log(err))
        },
        //编辑地址
        editAddress() {
          // 这里有两个id，一个是登陆id(哪个用户)，另一个是每一个地址的id(哪个地址)
          this.$axios.post(
            `/api/user/edit_address/${localStorage.ele_login}/${this.addressInfo._id}`,this.addressInfo)
          .then(res => {
            // 编辑成功后跳回到myAddress
            this.$router.push('/myAddress')
          })
        }
    },
    components: {
        Header,
        FormBlock,
        TabTag,
        AddressSearch
    }
}
</script>

<style scoped>
.addAddress {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 45px;
}
.viewbody {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  background-color: #f5f5f5;
}

.content {
  padding-left: 4vw;
  background: #fff;
  font-size: 0.94rem;
}

.formblock {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
}
.formblock .label-wrap {
  flex-basis: 17.333333vw;
  padding: 3.733333vw 0;
  line-height: 4.8vw;
  color: #333;
  font-weight: 700;
}

/* 确定按钮 */
.form-button-wrap {
  padding: 5.333333vw 4vw;
  display: flex;
}
.form-button-wrap .form-button {
  background: #00d762;
  text-align: center;
  border-radius: 0.533333vw;
  flex: 1;
  font-size: 1.1rem;
  line-height: 5.066667vw;
  color: #fff;
  padding: 3.333333vw 0;
  border: none;
  font-weight: 500;
}
</style>