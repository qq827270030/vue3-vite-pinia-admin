import request from '@/utils/request'

enum API {
  GETSKU_URL = '/admin/product/list/', //获取sku全部信息的地址
  ONSALE_URL = '/admin/product/onSale/', //sku商品上架的请求地址
  DOWNSALE_URL = '/admin/product/cancelSale/', //sku商品下架的请求地址
  FINDSKUINFO_URL = '/admin/product/getSkuInfo/', //获取sku某个商品的详细信息
  DELETESKU_URL = '/admin/product/deleteSku/', //删除sku商品的请求地址
}

//获取sku全部信息的请求方法
export const reqGetSkuInfo = (page: number, count: number) => {
  return request.get<any, any>(API.GETSKU_URL + `${page}/${count}`)
}

//上架sku商品的请求方法
export const reqOnSale = (SkuId: number) => {
  return request.get<any, any>(API.ONSALE_URL + SkuId)
}

//下架sku商品的请求方法
export const reqDownSale = (SkuId: number) => {
  return request.get<any, any>(API.DOWNSALE_URL + SkuId)
}

//获取sku某个商品的详细信息的请求方法
export const reqGetSkuDetail = (SkuId: number) => {
  return request.get<any, any>(API.FINDSKUINFO_URL + SkuId)
}

//删除sku某个商品的请求方法
export const reqRemoveSku = (SkuId: number) => {
  return request.delete<any, any>(API.DELETESKU_URL + SkuId)
}
