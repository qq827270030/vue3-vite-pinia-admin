<template>
  <el-button
    type="success"
    icon="Refresh"
    title="刷新"
    circle
    @click="upDateReFsh"
  ></el-button>
  <el-button
    type="primary"
    icon="FullScreen"
    title="全屏模式"
    circle
    @click="fullscreen"
  ></el-button>

  <el-popover placement="bottom" title="设置" :width="300" trigger="click">
    <template #reference>
      <el-button type="info" icon="Setting" title="设置" circle></el-button>
    </template>
    <div class="dark">
      <div>
        <el-icon color="rgba(250, 212, 0, 1)" size="20px">
          <Moon></Moon>
        </el-icon>
        <el-tag :type="dark ? 'success' : 'info'">夜间模式</el-tag>
      </div>

      <el-switch
        v-model="dark"
        active-color="#13ce66"
        inactive-color="#000000"
        @change="changDark"
        inline-prompt
        active-icon="Moon"
        inactive-icon="Sunny"
      ></el-switch>
    </div>
    <div class="setColor">
      <div>
        <el-icon color="#4bb3f9" size="20px">
          <MilkTea></MilkTea>
        </el-icon>
        <el-tag type="info">主题颜色</el-tag>
      </div>

      <el-color-picker
        v-model="color"
        show-alpha
        :predefine="predefineColors"
        @change="changColir"
      ></el-color-picker>
    </div>
  </el-popover>

  <img :src="useStore.avatar" alt="" />
  <el-dropdown trigger="click" class="dropdown">
    <span class="el-dropdown-link">
      {{ useStore.username }}
      <el-icon>
        <ArrowDown />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          icon="Logout"
          style="font-size: 12px"
          @click="loginout"
        >
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import useLayoutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user'
import { ref } from 'vue'
let useStore = useUserStore()
let useSettingStore = useLayoutSettingStore()
let $route = useRouter()
let dark = ref<boolean>(false)
useSettingStore.refresh = false
const upDateReFsh = () => {
  setTimeout(() => {
    useSettingStore.refresh = !useSettingStore.refresh
  }, 1000)

  //console.log(reFresh)
}
//点击按钮实现全屏的函数
const fullscreen = () => {
  //获取是否时全屏  原生JS的document.fullscreenElement返回一个布尔值，全屏为true，不是全屏为false
  let full = document.fullscreenElement
  if (!full) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

//点击按钮实现退出登录功能
const loginout = async () => {
  //调用清除用户名、头像、token的函数
  await useStore.letUserLoginOut()
  //跳转至登录页面
  $route.push({ path: '/login' })
}

//夜间模式功能按钮
const changDark = () => {
  let html = document.documentElement
  dark.value ? (html.className = 'dark') : (html.className = '')
}
//改变主题颜色
const changColir = () => {
  let html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
  html.style.setProperty('--el-color-info', color.value)
  html.style.setProperty('--el-color-warning', color.value)
  html.style.setProperty('--el-color-danger', color.value)
}

const color = ref('rgba(255, 69, 0, 0.68)'),
  predefineColors: any = [
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
  ]
</script>

<style lang="scss" scoped>
img {
  width: $base_header_img_width;
  height: $base_header_img_height;
  border-radius: 20%;
  background-size: cover;
  border: 1px #333 solid;
  margin-left: 10px;
  margin-right: 2px;
}

.el-dropdown-link {
  display: flex;
  flex-direction: row;
  align-items: center;
  vertical-align: top;
}

.dropdown:hover {
  cursor: pointer;
  color: #4bb3f9;
}

.dark {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  div:nth-child(1) {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;

    .el-tag {
      margin-left: 10px;
    }

    .el-icon {
    }
  }
}

.setColor {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  div:nth-child(1) {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;

    .el-tag {
      margin-left: 10px;
    }

    .el-icon {
    }
  }
}
</style>
