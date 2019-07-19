import Vue from 'vue'
import App from './App.vue'

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

import router from './router'
import store from './store'
import axios from 'axios'

import { Indicator } from 'mint-ui';

Vue.config.productionTip = false

// 这样就可以全局使用 axios 了
Vue.prototype.$axios = axios;

Vue.use(MintUI)

// 请求拦截, 当 发起请求时，会有一个转圈的动画Indicator
axios.interceptors.request.use(
    config => {
        //加载动画,mint-ui中的
        Indicator.open();
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截
axios.interceptors.response.use(
    response => {
        Indicator.close();
        return response;
    },
    error => {
        // 错误提醒
        Indicator.close();
        return Promise.reject(error);
    }
)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
