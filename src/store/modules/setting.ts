// 存储伸缩导航栏相关的数据仓库

import { defineStore } from 'pinia'

let useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, //用于控制菜单是否折叠的变量
      refresh: false, //用于监听首页是否刷新的变量
    }
  },
})

export default useLayoutSettingStore
