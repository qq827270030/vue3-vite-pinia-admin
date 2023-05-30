<template>
  <div class="layout">
    <el-container>
      <el-aside :class="{ fold: Flod.fold ? true : false }">
        <div class="wrap">
          <div class="nav">
            <div class="btn">
              <div class="btn-item"></div>
              <div class="btn-item"></div>
              <div class="btn-item"></div>
            </div>
            <div class="logo_title">
              <Logo></Logo>
              <h3>硅谷甄选后台管理系统</h3>
            </div>
            <div class="line"></div>
            <el-scrollbar class="scrollbar">
              <el-menu
                text-color="white"
                :collapse="Flod.fold ? true : false"
                :default-active="$route.path"
              >
                <Menu :menuList="useStore.menuRoutes"></Menu>
              </el-menu>
            </el-scrollbar>
            <!-- Element导航菜单 -->
          </div>
        </div>
      </el-aside>
      <el-container>
        <!-- 顶部导航栏 -->
        <el-header>
          <Tabbar></Tabbar>
        </el-header>
        <!-- 主体内容去 -->
        <el-main>
          <Main></Main>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
//import {ref} from 'vue'
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
//获取用户相关的数据仓库
import useUserStore from '@/store/modules/user'
import Main from '@/layout/main/index.vue'
import Tabbar from '@/layout/tabbar/index.vue'
import useLayoutSettingStore from '@/store/modules/setting'
import { useRoute } from 'vue-router'
let $route = useRoute()
let Flod = useLayoutSettingStore()

let useStore = useUserStore()
</script>

<style scoped lang="scss">
.layout {
  // background: url(bgt.webp) center no-repeat;
  background-size: cover;
}

.el-container {
  width: 100%;
  height: 100vh;
}

.wrap {
  height: 100vh;
  width: $base_aside_width;
  border-right: 1px solid #333;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .nav {
    width: $base_aside_nav_width;
    //background: rgba(0, 0, 0, 0.8);
    //border-radius: 20px;
    //  overflow: hidden;
    transition: all;
    height: $base_aside_nav_height;

    .logo_title {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;
      //  overflow: hidden;

      h3 {
        color: aliceblue;
      }
    }

    .btn {
      width: 60px;
      height: 10px;
      display: flex;
      justify-content: space-around;
      //margin-left:
      margin-top: 5px;
    }

    .btn .btn-item {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .btn .btn-item:nth-child(1) {
      background-color: #eb5a56;
    }

    .btn .btn-item:nth-child(2) {
      background-color: #f8bc33;
    }

    .btn .btn-item:nth-child(3) {
      background-color: #62cb44;
    }

    .line {
      width: 250px;
      height: 1px;
      background-color: rgba(245, 253, 255, 0.5);
      margin: 20px 0;
    }

    .el-menu-vertical-demo {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }
  }
}

.el-header {
  height: $base_header_height;
  border-bottom: 1px solid #333;
  padding-right: 3px;
  padding-left: 5px;
  //line-height: $base_header_height;
}

.el-aside {
  overflow: hidden;
  background: rgba(0, 0, 0, 0.8);
  height: 100vh;
  width: $base_aside_width;
  transition: all 0.3s linear;

  // text-align: center;
  // line-height: base_aside_width;
  &.fold {
    width: 60px;
  }
}

.el-main {
  padding: 20px;
}

// body>.el-container {
//     margin-bottom: 40px;
// }

// .el-container .el-aside {
//     line-height: 320px;
// }
</style>
