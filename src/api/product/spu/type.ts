//定义spu相关的TS数据类型

//服务器全部接口返回的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//SPU数据的ts类型:需要修改
export interface SpuData {
  category3Id: string | number
  id?: number
  spuName: string
  tmId: number | string
  description: string
  spuImageList: null | SpuImg[]
  spuSaleAttrList: null | SaleAttr[]
}
//数组:元素都是已有SPU数据类型
export type Records = SpuData[]
//定义获取已有的SPU接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

//品牌数据的TS类型
export interface TradeMark {
  id: number
  tmName: string
  logoUrl: string
}

//品牌接口返回的TS数据类型
export interface AllTradeMark extends ResponseData {
  data: TradeMark[]
}

//SPU商品图片的TS数据类型
export interface SpuImg {
  id: string | number
  createTime: string
  undateTime: string
  spuId: number | string
  imgName: string
  imgUrl: any
}

//已有的SPU的照片墙TS数据类型
export interface SpuHasImg extends ResponseData {
  date: SpuImg[]
}

//已有的销售属性值的TS数据类型
export interface SpuSaleAttrValue {
  id?: number
  createTime: string
  updateTime: string
  spuId: number
  baseSaleAttrId: number
  saleAttrValueName: string
  saleAttrName: string
  isChecked: boolean
}

//存储已有的销售属性值的数组类型
export type spuSaleAttrValueList = SpuSaleAttrValue[]

//销售属性对象的销售类型
export interface SaleAttr {
  id?: number
  createTime: string
  updateTime: string
  spuId: number
  baseSaleAttrId: number
  saleAttrName: string
  spuSaleAttrValueList: spuSaleAttrValueList
}

//SPU已有的销售属性接口返回的TS数据类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

//全部销售属性的TS数据类型
export interface AllBaseSaleAttr {
  id: number
  name: string
}
export interface HasAllBaseSaleAttrResponseData extends ResponseData {
  data: AllBaseSaleAttr[]
}
