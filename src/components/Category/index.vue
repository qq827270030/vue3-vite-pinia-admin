<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          v-model="useCatgory.C1Id"
          @change="handler"
          :disabled="show == 0 ? false : true"
        >
          <!-- label为下拉菜单显示的数据， value为下拉菜单收集到的数据 -->
          <el-option
            v-for="c1 in useCatgory.C1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="useCatgory.C2Id"
          @change="handler2"
          :disabled="show == 0 ? false : true"
        >
          <el-option
            v-for="c2 in useCatgory.C2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="useCatgory.C3Id"
          :disabled="show == 0 ? false : true"
        >
          <el-option
            v-for="c3 in useCatgory.C3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/modules/category'
import { onMounted } from 'vue'
let useCatgory = useCategoryStore()

//获取一级下拉菜单的数据
const getC1 = async () => {
  await useCatgory.getC1()
}
//一级菜单的改变事件，（选中某个值会触发）
const handler = () => {
  //点击第一个下拉菜单要清除2，3个下拉菜单的数据
  useCatgory.C3Id = ''
  useCatgory.C3Arr = []
  useCatgory.C2Id = ''
  useCatgory.getC2()
}
//二级菜单改变数值，发送请求获取三级菜单数据
const handler2 = () => {
  useCatgory.C3Id = ''
  useCatgory.getC3()
}
onMounted(() => {
  getC1()
})

//接收父组件传过来的show值，用于控制顶部三个下拉菜单是否禁用
defineProps(['show'])
</script>

<style lang="scss" scoped></style>
