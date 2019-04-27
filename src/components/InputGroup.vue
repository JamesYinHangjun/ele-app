<template>
  <div class="text_group">
      <!-- 组件结构 -->

      <!-- 组件容器 -->
      <!-- :class="{'is-invalid': error}" 当号码错误时，边框显示红色 -->
      <div class="input_group" :class="{'is-invalid': error}">
          <!-- 输入框 -->
          <input
            :type="type"
            :name="name"
            :value="value"
            :placeholder="placeholder"
            @input = "$emit('input',$event.target.value)"
          />

          <!-- 输入框后面的按钮 -->
          <!-- 当传入 btnTitle 时，会显示按钮 -->
          <!-- disabled是控制按钮点击的，当点击了按钮获取验证码后，在多少秒之内是不能再次点击按钮的 -->
          <button v-if="btnTitle" :disabled="disabled" @click="$emit('btnClick')">{{btnTitle}}</button>
      </div>
      <!-- 验证码错误提醒 -->
      <!-- 当点击登录按钮后，提醒验证码错误 -->
      <!-- 当定义的 error 出现，就出现这个 div -->
      <div v-if="error" class="invalid-feedback">
          {{error}}
      </div>
  </div>
</template>

<script>
export default {
    name: "inputGroup",
    // 这个组件是 login.vue 的子组件，接收从 login.vue 传递来的数据
    props: {
        type: {
            type: String,
            default: "text"
        },
        value: String,
        placeholder: String,
        name: String,
        btnTitle: String,           // 拥不拥有获取验证码的
        disabled: Boolean,
        error: String
    }
}
</script>

<style scoped>
.input_group {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.input_group input {
  height: 100%;
  width: 60%;
  outline: none;
  border: none;
}
.input_group button {
  border: none;
  outline: none;
  background: #fff;
}
.input_group button[disabled] {
  color: #aaa;
}
.is-invalid {
  border: 1px solid red;
}
.invalid-feedback {
  color: red;
  padding-top: 5px;
  text-align: left;
}
</style>
