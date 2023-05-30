<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" v-if="flag" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import useLayoutSettingStore from '@/store/modules/setting'
let flag = ref(true)
let useSettingStore = useLayoutSettingStore()
//点击刷新按钮，监听仓库中改变的数据
watch(
  () => useSettingStore.refresh,
  () => {
    //console.log(666)
    //并给flag设置成false以销毁组件
    flag.value = false
    //销毁完组件后nextTick方法可以在响应式数据发生改变时获取新的dom
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<style lang="scss" scoped>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all linear 0.6s;
}

.fade-enter-to {
  opacity: 1;
}
</style>
