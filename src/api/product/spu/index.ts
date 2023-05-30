//商品SPU模块的API

import request from '@/utils/request'
import {
  HasSpuResponseData,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasAllBaseSaleAttrResponseData,
} from './type'
enum API {
  GETSPU_URL = '/admin/product/', //获取已有SPU的请求地址
  ALLTRADEMARKLIST = '/admin/product/baseTrademark/getTrademarkList', //获取已有品牌列表的地址
  SPUIMAGELIST = '/admin/product/spuImageList/', //获取某个品牌商品图片的地址
  SPUSALEATTRLIST = '/admin/product/spuSaleAttrList/', //获取已有SPU销售属性的地址
  BASESALEATTR = '/admin/product/baseSaleAttrList', // 所有的销售属性 尺寸，颜色，版本
  ADDSPU_URL = '/admin/product/saveSpuInfo', //新增spu的请求地址
  UPDATESPU_URL = '/admin/product/updateSpuInfo', //更新spu的请求地址
  ADDSKU_URL = '/admin/product/saveSkuInfo', //添加一个sku的请求地址
  SELECTSKUINFO_URL = '/admin/product/findBySpuId/', //查询某个sku信息的地址
  DELETESPU_URL = '/admin/product/deleteSpu/', //删除spu的请求地址
}
//获取已有SPU的请求方法
export const reqGetSPU = (
  page: number,
  limit: number,
  category3Id: number | string,
) => {
  return request.get<any, HasSpuResponseData>(
    API.GETSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )
}

//获取已有品牌列表的请求方法
export const reqGetTradeMarkList = () => {
  return request.get<any, AllTradeMark>(API.ALLTRADEMARKLIST)
}

//获取某个品牌图片的请求方法
export const reqGetSpuImageList = (SpuId: number) => {
  return request.get<any, SpuHasImg>(API.SPUIMAGELIST + SpuId)
}

//获取已有SPU销售属性的请求方法
export const reqGetSpuSaleAttrList = (SpuId: number) => {
  return request.get<any, SaleAttrResponseData>(API.SPUSALEATTRLIST + SpuId)
}

//获取所有的销售属性的请求方法
export const reqGetAllSaleAttr = () => {
  return request.get<any, HasAllBaseSaleAttrResponseData>(API.BASESALEATTR)
}

//添加一个新的spu
//更新已有的spu
//data：已有的spu对象或新增的spu对象
export const reqAddorUpdateSpu = (data: any) => {
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}

//添加一个sku的请求方法
export const reqAddSku = (data: any) => {
  return request.post<any, any>(API.ADDSKU_URL, data)
}

//查询sku信息的请求方法
export const reqSelectSkuInfo = (SpuId: number) => {
  return request.get<any, any>(API.SELECTSKUINFO_URL + SpuId)
}

//删除spu信息的请求方法
export const reqRemoveSpu = (SpuId: number) => {
  return request.delete<any, any>(API.DELETESPU_URL + SpuId)
}
