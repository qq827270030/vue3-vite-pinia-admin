//品牌管理模块的api接口

import request from '@/utils/request'
import { tmResponseData, TradeMark } from './type'

//接口地址
enum API {
  //获取已有品牌的接口
  TRADEMARK_URL = '/admin/product/baseTrademark/', //获取
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save', //新增
  UPDATEMARK_URL = '/admin/product/baseTrademark/update', //更新
  DELETEMARK_URL = '/admin/product/baseTrademark/remove/',
}

//商品展示接口访问方法
export const reqTradeMark = (page: number, limit: number) =>
  request.get<any, tmResponseData>(API.TRADEMARK_URL + `${page}/${limit}`)

//新增商品接口的访问方法
export const reqAddTradeMark = (data: TradeMark) => {
  return request.post<any, any>(API.ADDTRADEMARK_URL, data)
}

//修改商品接口的访问方法
export const reqUpdateTradeMark = (data: TradeMark) => {
  return request.put<any, any>(API.UPDATEMARK_URL, data)
}

//删除商品接口的访问方法
export const reqDeleteTradeMark = (id: number) => {
  return request.delete<any, any>(API.DELETEMARK_URL + id)
}
