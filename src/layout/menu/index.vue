<template>
  <div class="menu">
    <!-- <h3>{{menuList}}</h3> -->
    <template v-for="item in menuList" :key="item.path">
      <!-- 没有子路由的插件 -->
      <template v-if="!item.children">
        <el-menu-item
          v-if="!item.meta.hidden"
          :index="item.path"
          @click="goRoute"
        >
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          &nbsp;&nbsp;&nbsp;
          <template #title>
            <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item>
      </template>

      <!-- 只有1个子路由 -->
      <template v-if="item.children && item.children.length === 1">
        <el-menu-item
          v-if="!item.children[0].meta.hidden"
          :index="item.children[0].path"
          @click="goRoute"
        >
          <el-icon>
            <component :is="item.children[0].meta.icon"></component>
          </el-icon>
          &nbsp;&nbsp;&nbsp;
          <template #title>
            <span>{{ item.children[0].meta.title }}</span>
          </template>
        </el-menu-item>
      </template>

      <!-- 有子路由且数量大于1 -->
      <el-sub-menu
        v-if="item.children && item.children.length > 1"
        :index="item.path"
      >
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          &nbsp;&nbsp;&nbsp;
          <span>{{ item.meta.title }}</span>
        </template>
        <Menu :menuList="item.children"></Menu>
      </el-sub-menu>
    </template>
  </div>
</template>

<script setup lang="ts">
//获取路由方法
import { useRouter } from 'vue-router'
//获取父组件传过来的全部路由数
defineProps(['menuList'])
let $useRoute = useRouter()
//点击菜单的回调方法
const goRoute = (vc: any) => {
  let path = vc.index
  // console.log(vc.index)
  $useRoute.push(path)
}
</script>

<script lang="ts">
export default {
  name: 'Menu',
}
</script>

<style lang="scss" scoped>
.menu {
  background: rgba(0, 0, 0, 0.8);
  color: aliceblue;
}
// el-menu-item:hover{
//     background-color:  rgba(0, 0, 0, 0.8);
// }
// .item2:hover{
//     background-color:  rgba(0, 0, 0, 0.8);
// }
// .item3:hover{
//     background-color:  rgba(0, 0, 0, 0.8);
// }
</style>
