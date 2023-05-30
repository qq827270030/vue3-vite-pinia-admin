<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <BreadCrumb></BreadCrumb>
    </div>
    <div class="tabbar_right">
      <Setting></Setting>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadCrumb from '@/layout/tabbar/breadcrumb/index.vue'
import Setting from '@/layout/tabbar/setting/index.vue'
</script>

<style lang="scss" scoped>
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .tabbar_left {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .tabbar_right {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>
