//商品属性相关的API接口文档

import request from '@/utils/request'
import { CategoryResponseData } from './type'

enum API {
  C1_URL = '/admin/product/getCategory1',
  C2_URL = '/admin/product/getCategory2/',
  C3_URL = '/admin/product/getCategory3/',
  ATTR_URL = '/admin/product/attrInfoList/',
  ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
  DELETEATTR_URL = '/admin/product/deleteAttr/',
}

//获取一级分类数据的请求方法
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)

//获取二级分类数据的请求方法
export const reqC2 = (id: number | string) =>
  request.get<any, CategoryResponseData>(API.C2_URL + id)

//获取三级分类数据的请求方法
export const reqC3 = (id: number | string) =>
  request.get<any, CategoryResponseData>(API.C3_URL + id)

//获取商品基本属性的请求方法
export const reqAttr = (
  id1: number | string,
  id2: number | string,
  id3: number | string,
) => {
  return request.get<any, any>(API.ATTR_URL + `${id1}/${id2}/${id3}`)
}

//新增或修改商品属性和属性值的请求方法
export const reqAddorUpdateAttr = (data: any) => {
  return request.post<any, any>(API.ADDORUPDATEATTR_URL, data)
}

//删除已有属性的请求方法
export const reqDeleteAttr = (id: number) => {
  return request.delete<any, any>(API.DELETEATTR_URL + id)
}
