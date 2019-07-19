<template>
    <div class="addAddress">
        <Header :isLeft="true" :title="title" />

        <!-- 添加地址 -->
        <div class="viewbody">
            <div class="content">
                <FormBlock label="联系人" placeholder="姓名" 
                :tags="sexes" @checkSex="checkSex" :selectTag="addressInfo.sex"/>
                <FormBlock label="电话" placeholder="手机号码"/>
                <FormBlock label="地址" placeholder="小区/写字楼/学校" icon="angle-right"/>
                <FormBlock label="门牌号" placeholder="10号楼5单元404" icon="edit" textarea="textarea"/>
                
                <div class="formblock">
                    <div class="label-wrap">标签</div>
                    <TabTag :tags="tags" :selectTag="addressInfo.tag" @checkTag="checkTag"/>
                </div>
            </div>
        </div>

        <!-- 搜索地址 -->
        <AddressSearch @close="showSearch=false" :showSearch="showSearch" />
    </div>
</template>

<script>
import Header from '../../components/Header'
import FormBlock from '../../components/Orders/FormBlock'
import TabTag from '../../components/Orders/TabTag'
import AddressSearch from '../../components/Orders/AddressSearch'
export default {
    name: 'AddAddress',
    data() {
        return {
            title: '添加地址',
            tags: ["家","学校","公司"],
            sexes: ["先生","女士"],
            addressInfo: {                // 存储所有信息
                tag: "",
                sex: ''
            },
            showSearch: true
        }
    },
    methods: {
        checkTag(item) {     //这个item指 家 学校 公司 ，点击谁返回谁
            // console.log(item)
            this.addressInfo.tag = item;
        },
        checkSex(item) {
            console.log(item)
            this.addressInfo.sex = item;
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