//对外暴露的配置路由(常量路由)
export const constantRoute = [
  //这是登录页面的路由
  {
    path: '/login',
    component: () => import('../views/login/index.vue'),
    name: 'Login', //命名路由
    meta: {
      title: '登录路由',
      hidden: true, //true为隐藏
      icon: 'HomeFilled',
    },
  },
  //这是登录成功后展示首页的路由
  {
    path: '/',
    component: () => import('../layout/index.vue'),
    name: 'Layout',
    redirect: '/home',
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('../views/home/index.vue'),
        meta: {
          title: '首页',
          hidden: false,
          icon: 'House',
        },
      },
    ],
  },
  //数据大屏路由
  {
    path: '/screen',
    component: () => import('@/views/screen/index.vue'),
    name: 'Screen',
    meta: {
      title: '数据大屏',
      hidden: false,
      icon: 'Monitor',
    },
  },
  //权限管理路由

  //商品管理

  //404页面
  {
    path: '/404',
    component: () => import('../views/404/index.vue'),
    name: '404',
    meta: {
      title: '404',
      hidden: true,
      icon: 'Warning',
    },
  },
  //任意路由
]

//对外暴露的异步路由(根据账号分配的权限来选择性展示的路由)
export const premissionRoute = [
  //权限管理路由
  {
    path: '/acl',
    component: () => import('../layout/index.vue'),
    name: 'Acl',
    redirect: '/acl/user',
    meta: {
      title: '权限管理',
      hidden: false,
      icon: 'Avatar',
    },
    children: [
      {
        path: '/acl/user',
        component: () => import('@/views/acl/user/index.vue'),
        name: 'User',
        meta: {
          title: '用户管理',
          hidden: false,
          icon: 'User',
        },
      },
      {
        path: '/acl/role',
        component: () => import('@/views/acl/role/index.vue'),
        name: 'Role',
        meta: {
          title: '角色管理',
          hidden: false,
          icon: 'platform',
        },
      },
      {
        path: '/acl/permission',
        component: () => import('@/views/acl/permission/index.vue'),
        name: 'Permission',
        meta: {
          title: '菜单管理',
          hidden: false,
          icon: 'Grid',
        },
      },
    ],
  },
  //商品管理
  {
    path: '/product',
    component: () => import('@/layout/index.vue'),
    name: 'Product',
    redirect: '/product/trademark',
    meta: {
      title: '商品管理',
      hidden: false,
      icon: 'Box',
    },
    children: [
      {
        path: '/product/trademark',
        component: () => import('@/views/product/trademark/index.vue'),
        name: 'Trademark',
        meta: {
          title: '品牌管理',
          hidden: false,
          icon: 'Refrigerator',
        },
      },
      {
        path: '/product/attr',
        component: () => import('@/views/product/attr/index.vue'),
        name: 'Attr',
        meta: {
          title: '属性管理',
          hidden: false,
          icon: 'SetUp',
        },
      },

      {
        path: '/product/spu',
        component: () => import('@/views/product/spu/index.vue'),
        name: 'Spu',
        meta: {
          title: 'SPU管理',
          hidden: false,
          icon: 'IceTea',
        },
      },
      {
        path: '/product/sku',
        component: () => import('@/views/product/sku/index.vue'),
        name: 'Sku',
        meta: {
          title: 'SKU管理',
          hidden: false,
          icon: 'HotWater',
        },
      },
    ],
  },
]

//对外暴露的任意路由
export const anyRoute =
  //任意路由
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: {
      title: '任意路由',
      hidden: true,
      icon: 'Warning',
    },
  }
