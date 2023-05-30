//此ts文件时进行全局路由守卫的配置

//先引入路由方法
import router from './router'
//引入进度条功能的组件
//@ts-ignore
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

//获取pinia大仓库和小仓库中的用户数据(在src外部直接引入小仓库获取不到需要先引入大仓库)
import pinia from '@/store/index'
import useUserStore from './store/modules/user'
let useStore = useUserStore(pinia)
//console.log(666, useStore.token)
router.beforeEach(async (to: any, _from: any, next: any) => {
  //let token = useStore.token
  //let username = useStore.username
  //用户是否登录判断
  if (useStore.token) {
    if (to.path == '/login') {
      next({ path: '/home' })
    } else {
      if (useStore.username) {
        next()
      } else {
        //没有用户信息就去获取用户信息
        try {
          await useStore.getUserInfo()
          next(to)
        } catch (error) {
          //TOKEN过期，获取不到
          //用户手动修改本地token
          await useStore.letUserLoginOut()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else if (!useStore.token) {
    if (to.path == '/login') {
      //console.log(777, useStore.token)
      next()
    } else if (to.path !== '/login') {
      //console.log(888,useStore.token)

      next({ path: '/login' })
    }
  }
  nprogress.start()
})

router.afterEach((_to, _from) => {
  nprogress.done()
})

//登录成功时,可以访问其他路径，但不能访问login页面
//没有失败时,只能访问login页面，其他页面访问不了
