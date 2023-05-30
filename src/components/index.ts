import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
import Category from './Category/index.vue'
import type { App, Component } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//对外暴露一个插件对象
const components: { [name: string]: Component } = {
  SvgIcon,
  Pagination,
  Category,
}
export default {
  install(app: App) {
    //注册项目的全部全局组件
    Object.keys(components).forEach((key: string) => {
      app.component(key, components[key])
    })
    //注册项目的全局图标
    //console.log(Object.entries(ElementPlusIconsVue))
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
