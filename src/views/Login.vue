<template>
  <div class="login">
      <div class="logo">
          <img src="../assets/logo.jpg" alt="my login image">
      </div>

      <!-- 手机号 -->
      <InputGroup
        type="number"
        v-model="phone"
        placeholder="手机号"
        :btnTitle="btnTitle"
        :disabled="disabled"
        :error="errors.phone"
        @btnClick="getVerifyCode"
      />
      <!-- 验证码 -->
      <InputGroup
        type="number"
        v-model="verifyCode"
        placeholder="验证码"
        :disabled="disabled"
        :error="errors.code"
      />

      <!-- 用户协议 -->
      <div class="login_des">
          <p>
            新用户登录即自动注册，表示已同意
            <span>《用户服务协议》</span>
          </p>
      </div>

      <!-- 登录按钮 -->
      <div class="login_btn">
          <button :disabled="isClick" @click="handleLogin">登录</button>
      </div>
  </div>
</template>

<script>
import InputGroup from "../components/InputGroup";
export default {
    name: "login",
    data() {
        return {
            phone: '',
            verifyCode: '',              // 验证码
            errors: {},                  // 是一个对象，可能是手机号错误，也可能是验证码错误
            btnTitle: '获取验证码',
            disabled: false              // btn false表示可以点击
        }
    },
    computed: {
        // isClick 绑定在 button 上
        isClick() {
            // 当手机号和密码 任何一个没有填的话，就不能点击按钮
            if(!this.phone || ! this.verifyCode) {
                return true;     // disabled 为 true
            } else {
                return false
            }
        }
    },
    methods: {
        handleLogin() {
            // 当点击登录按钮时，先取消错误提醒
            this.errors = {};
            // 然后再 发送请求
            this.$axios.post("/api/posts/sms_back", {
                phone: this.phone,
                code: this.verifyCode
            })
            .then(res => {
                // console.log(res.data)

                // 检验成功， 设置登录状态并且跳转到  / 页面
                // localStorage.setItem("ele_login",true);
                
                // 登陆后每个用户都会拿到一个userId，这个userId用来请求接口
                // 比如说在me.vue中，通过这个userId请求地址

                localStorage.setItem("ele_login",res.data.user._id);
                this.$router.push("/");
            })
            .catch(err => {
                // 返回错误信息
                this.errors = {
                    code: err.response.data.msg
                }
            })
        },

        // 获取验证码
        getVerifyCode() {
            // 先判断手机号
            if(this.validatePhone()) {
                this.validateBtn();            // 倒计时设置
                //如果手机号合法， 就发送网络请求
                this.$axios.post("/api/posts/sms_send", {
                    tpl_id: "150442",
                    key: "b46f9257907bb4b82df496a6d2c0e1f8",
                    phone: this.phone              // 发送哪个手机号
                })
                .then(res => {
                    console.log(res);
                })
            }
        },
        //手机号合法时，倒计时
        validateBtn() {
            let time = 60;
            let timer = setInterval(() => {
                if(time == 0) {
                    clearInterval(timer);
                    this.btnTitle = "获取验证码";
                    this.disabled = false;
                } else {
                    // 倒计时
                    this.btnTitle = time + '秒后重试';
                    this.disabled = true;    //disabled为true 表示不可以点击
                    time--;
                }
            },1000);
        },
        // 验证手机号合法
        validatePhone() {
            if(!this.phone) {                   // 手机号没填
                this.errors = {
                    phone: "手机号码不能为空"
                };
                return false;
            } else if (!/^1[345678]\d{9}$/.test(this.phone)) {
                this.errors = {
                    phone: "请填写正确的手机号码"
                };
                return false;
            } else {
                this.errors = {};
                return true;
            }
        }
    },
    components: {
        InputGroup
    }
}
</script>

<style scoped>
.login {
    width: 100%;
    height: 100%; 
    padding: 30px;
    box-sizing: border-box;
    background: #fff;
    text-align: center;
}

.logo {
    text-align: center;
}
.logo img {
    width: 150px;
}

.text_group,
.login_des,
.login_btn {
  margin-top: 20px;
}
.login_des {
  color: #aaa;
  line-height: 22px;
}
.login_des span {
  color: #4d90fe;
}
.login_btn button {
  width: 100%;
  height: 40px;
  background-color: #48ca38;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  border: none;
  outline: none;
}
/* 当按钮不能被点击时的样式 */
.login_btn button[disabled] {
  background-color: #8bda81;
}
</style>
