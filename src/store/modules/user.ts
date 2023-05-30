//创建用户相关的数据仓库
import { defineStore } from 'pinia'
//引入登录api里的登录请求
import { reqLogin, reqLogout, reqUserInfo } from '@/api/user'
//引入用户请求信息的数据类型

// import type { UserState } from './type'
//引入封装好的存储token数据方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
//引入常量路由
import { constantRoute, premissionRoute, anyRoute } from '@/router/routes'
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep'
import router from '@/router'

//定义过滤路由的函数(根据账号分配的权限来选择性展示的路由)
function filterUserRoute(premissionRoute: any, routes: any) {
  return premissionRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterUserRoute(item.children, routes)
      }
      return true
    }
  })
}

//创建用户数据仓库
let useUserStore = defineStore('User', {
  //存储数据的地方
  state: (): any => {
    return {
      token: GET_TOKEN(), //token是用户的唯一标识
      menuRoutes: constantRoute, //仓库存储生成菜单导航所需的路由
      username: '', //用户的用户名
      avatar: '', //用户的头像
      buttons: [], //存放用户按钮的权限
    }
  },
  //处理异步|逻辑的地方
  actions: {
    //用户登录的方法
    async userLogin(data: any) {
      //登录请求
      let result: any = await reqLogin(data)
      //console.log(result)
      //登录请求的结果:成功200->TOKEN(TOKEN是用户登录成功的唯一标识，需要存储用的的TOKEN)
      //登录请求的结果:失败201->错误信息
      if (result.code == 200) {
        this.token = result.data as string //将值存储在state中
        SET_TOKEN(result.data as string) //调用封装好的存储token方法
        //保证async返回一个成功的promise对象
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },

    //登录成功后请求用户数据信息的地方
    async getUserInfo() {
      //console.log(999,GET_TOKEN())
      let result = await reqUserInfo()
      //console.log(123456, result.data)
      if (result.code == 200) {
        this.username = result.data.name //登录成功后获取用户名
        this.avatar = result.data.avatar //登录成功后获取用户头像
        this.buttons = result.data.buttons
        //计算用户登录成功后可获得的异步路由
        // const userRoutes = filterUserRoute(
        //     cloneDeep(premissionRoute),
        //     result.data.routes
        //   )
        let userRoutes = filterUserRoute(
          cloneDeep(premissionRoute),
          result.data.routes,
        )
        //console.log(123456, userRoutes)
        ;(this.menuRoutes = [...constantRoute, ...userRoutes, anyRoute]),
          [...userRoutes, anyRoute].forEach((route: any) => {
            router.addRoute(route)
          })

        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    async letUserLoginOut() {
      //清空state里的用户名,用户头像,和localstorge里的token
      let result = await reqLogout()
      if (result.code == 200) {
        this.username = ''
        this.avatar = ''
        this.token = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})

export default useUserStore

// function cloneDeep(premissionRoute: {
//     path: string //登录请求的结果:成功200->TOKEN(TOKEN是用户登录成功的唯一标识，需要存储用的的TOKEN)
//     //登录请求的结果:成功200->TOKEN(TOKEN是用户登录成功的唯一标识，需要存储用的的TOKEN)
//     //登录请求的结果:失败201->错误信息
//     component: () => Promise<any>; name: string //登录请求的结果:失败201->错误信息
//     //登录请求的结果:失败201->错误信息
//     redirect: string; meta: { title: string; hidden: boolean; icon: string } //将值存储在state中
//     //将值存储在state中
//     children: { path: string; component: () => Promise<any>; name: string; meta: { ... } }[]
// }[]): any {
//     throw new Error('Function not implemented.')
// }
