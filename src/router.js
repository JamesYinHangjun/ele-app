import Vue from 'vue'
import Router from 'vue-router'
// import Index from './views/index.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import("./views/index.vue"),
      children: [
          {
              path: '',
              redirect: '/home'
          },
          {
              path: "/home",
              name: "home",
              component: () => import("./views/Home.vue")
          },
          {
              path: "/order",
              name: "order",
              component: () => import("./views/Order.vue")
          },
          {
              path: "/me",
              name: "me",
              component: () => import("./views/Me.vue")
          },
          {
              path: "/address",
              name: "address",
              component: () => import("./views/Address.vue")
          },
          {
              path: "/city",
              name: "city",
              component: () => import("./views/City.vue")
          }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import("./views/Login.vue")
    },
  ]
});

// 路由守卫(除了login ,其他乱写的url 都不能访问, 全部会访问 login)
router.beforeEach((to,from,next) => {
    const isLogin = localStorage.ele_login ? true : false;
    if(to.path == '/login') {
        next();
    } else {
        // 是否在登陆状态下
        isLogin ? next() : next('/login');
    }
});

export default router;
