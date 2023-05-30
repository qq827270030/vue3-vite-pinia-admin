<template>
  <el-icon style="margin-right: 10px" @click="changIcon">
    <component :is="Fold.fold ? 'Expand' : 'Fold'"></component>
  </el-icon>
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index">
      <el-icon style="vertical-align: middle">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span style="margin-left: 5px; vertical-align: middle">
        {{ item.meta.title }}
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
//import {ref} from 'vue'
import useLayoutSettingStore from '@/store/modules/setting'
import { useRoute } from 'vue-router'
let $route = useRoute()
let Fold = useLayoutSettingStore()
const changIcon = () => {
  Fold.fold = !Fold.fold
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  vertical-align: middle;
}

.el-icon:hover {
  cursor: pointer;
}
</style>
