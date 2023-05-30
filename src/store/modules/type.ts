//定义用户数据仓库的state类型
import type { RouteRecordRaw } from 'vue-router'
import { CategoryObj } from '@/api/product/attr/type'
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
  // buttons: string[]
}

export interface CategoryState {
  C1Id: string | number
  C2Id: string | number
  C3Id: string | number
  C1Arr: CategoryObj[]
  C2Arr: CategoryObj[]
  C3Arr: CategoryObj[]
}
