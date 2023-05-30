//菜单管理相关的接口
import request from '@/utils/request'

enum API {
  GETALLMENU_URL = '/admin/acl/permission', //获取全部菜单
  ADDMENU_URL = '/admin/acl/permission/save', //新增菜单功能
  UPDATEMENU_URL = '/admin/acl/permission/update', //更新菜单
  DELETEMENU_URL = '/admin/acl/permission/remove/', //删除菜单
}

//获取全部菜单的请求方法
export const reqGetAllMenu = () => {
  return request.get<any, any>(API.GETALLMENU_URL)
}

//新增菜单功能的请求方法
export const reqAddorUpdateMenu = (data: any) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEMENU_URL, data)
  } else {
    return request.post<any, any>(API.ADDMENU_URL, data)
  }
}

//删除已有的菜单的请求方法
export const reqRemoveMenu = (id: number) => {
  return request.delete<any, any>(API.DELETEMENU_URL + id)
}
