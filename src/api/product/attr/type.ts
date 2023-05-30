//定义属性接口返回的数据类型

export interface responeData {
  code: number
  message: string
  ok: boolean
}

export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number | string
  category2Id?: number | string
}

export interface CategoryResponseData extends responeData {
  data: CategoryObj[]
}
