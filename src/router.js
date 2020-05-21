import Vue from 'vue'
import Router from 'vue-router'
// import Index from './views/index.vue'

Vue.use(Router)
  
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
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
    {
      path: '/search',
      name: 'search',
      component: () => import("./views/Search.vue")
    },
    {
      path: '/shop',
      name: 'shop',
      redirect: 'goods',
      component: () => import("./views/Shops/Shop.vue"),
      children: [
          {
              path: '/goods',
              name: 'goods',
              component: () => import("./views/Shops/Goods.vue")
          },
          {
              path: '/comments',
              name: 'comments',
              component: () => import("./views/Shops/Comments.vue")
          },
          {
              path: '/seller',
              name: 'seller',
              component: () => import("./views/Shops/Seller.vue"),
          }
      ]
    },
    {
      path: '/myAddress',
      name: 'myAddress',
      component: () => import("./views/Orders/MyAddress.vue")
    },
    {
      path: '/addAddress',
      name: 'addAddress',
      component: () => import("./views/Orders/AddAddress.vue")
    },
    {
      path: '/settlement',
      name: 'settlement',
      component: () => import("./views/Orders/Settlement.vue")
    },
    {
      path: '/remark',
      name: 'remark',
      component: () => import("./views/Orders/Remark.vue")
    },
    {
      path: '/pay',
      name: 'pay',
      component: () => import("./views/Orders/Pay.vue")
    }
  ]
});

// 路由守卫(除了login ,其他乱写的url 都不能访问, 全部会访问 login)
// ele_login 控制登陆状态的，true via表示登陆状态

// 如果不是登陆状态，输入什么路由都会进入到登陆页面
router.beforeEach((to,from,next) => {
    const isLogin = localStorage.ele_login ? true : false;
    if(to.path == '/login') {
      // 是否跳转到login,是的话正常跳转
        next();
    } else {
        // 是否在登陆状态下，是的话，就进行下一步，否则的话就跳转到login页面
        isLogin ? next() : next('/login');
    }
});

export default router;
