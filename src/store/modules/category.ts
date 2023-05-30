//存储分类数据的小仓库
import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type { CategoryResponseData } from '@/api/product/attr/type'
import { CategoryState } from './type'
// import { id } from "element-plus/es/locale";
let useCategoryStore = defineStore('CategoryStore', {
  state: (): CategoryState => {
    return {
      C1Arr: [],
      C1Id: '',
      C2Arr: [],
      C2Id: '',
      C3Arr: [],
      C3Id: '',
    }
  },
  actions: {
    async getC1() {
      let result: CategoryResponseData = await reqC1()
      if (result.code == 200) {
        this.C1Arr = result.data
        return 'ok'
      } else {
      }
    },

    async getC2() {
      //console.log(66,this.C1Id)
      let result: CategoryResponseData = await reqC2(this.C1Id)
      if (result.code == 200) {
        this.C2Arr = result.data
        //console.log(666, this.C2Arr)
        return 'ok'
      } else {
      }
    },
    async getC3() {
      let result: CategoryResponseData = await reqC3(this.C2Id)
      if (result.code == 200) {
        this.C3Arr = result.data
        return 'ok'
      }
    },
  },

  getters: {},
})
export default useCategoryStore
