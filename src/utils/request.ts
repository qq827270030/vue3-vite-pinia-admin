import axios from 'axios'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'

//创建axios实例
let request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})
//请求拦截器

//request实例添加请求与响应拦截器
request.interceptors.request.use((config) => {
  //config配置对象，headers属性请求头，经常给服务器端携带公共参数
  //获取用户的token
  let useStore = useUserStore()
  //console.log(777,useStore.token)
  if (useStore.token) {
    config.headers.token = useStore.token
  }
  return config
})
//响应拦截器
request.interceptors.response.use(
  (response) => {
    //成功回调，返回数据
    return response.data
  },
  (error) => {
    //处理网络错误
    let msg = ''
    let status = error.response.status
    switch (status) {
      case 401:
        msg = 'token过期'
        break
      case 403:
        msg = '无权访问'
        break
      case 404:
        msg = '请求地址错误'
        break
      case 500:
        msg = '服务器出现问题'
        break
      default:
        msg = '无网络'
    }
    ElMessage({
      type: 'error',
      message: msg,
    })
    return Promise.reject(error)
  },
)
export default request
