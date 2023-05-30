import { createApp } from 'vue'
import App from '@/App.vue'
import pinia from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//引入暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
//引入svg图标
import 'virtual:svg-icons-register'
//引入自定义插件组件 注册成全局组件
import globalComponents from '@/components'
//引入全局样式文件
import '@/style/index.scss'
import router from '@/router'
//引入路由守卫文件
import './premission'
import { isCheckedButton } from './directive/check'

const app = createApp(App)
isCheckedButton(app)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(pinia)
app.use(ElementPlus)
app.use(globalComponents)
app.use(router)

app.mount('#app')
//console.log(pinia)
