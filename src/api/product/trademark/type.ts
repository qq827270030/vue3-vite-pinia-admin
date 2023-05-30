//定义商品列表的数据类型

export interface responeData {
  code: number
  message: string
  ok: boolean
}
//已有品牌的数据类型
export interface TradeMark {
  id: number
  tmName: string
  logoUrl: string
}

//包含全部品牌的数据类型
export type Records = TradeMark[]

//获取已有全部品牌的数据类型
export interface tmResponseData extends responeData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: number
    maxLimit: number
    searchCount: boolean
    pages: number
  }
}
