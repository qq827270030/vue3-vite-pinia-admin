//角色相关的api

import request from '@/utils/request'

enum API {
  GETROLE_URL = '/admin/acl/role/', //获取所有角色列表的地址
  ADDNEWROLE_URL = '/admin/acl/role/save', //新增角色的地址
  UPDATEROLE_URL = '/admin/acl/role/update', //更新已有角色的地址
  DELETEROLE_URL = '/admin/acl/role/remove/', //删除已有角色的地址
  GETROLEMENU_URL = '/admin/acl/permission/toAssign/', //根据角色id获取菜单
  SETPERMISSION_URL = '/admin/acl/permission/doAssign/?', //给角色设置菜单权限的地址
}

//获取所有角色列表的请求方法
export const reqGetRole = (page: number, limit: number, roleName: string) => {
  return request.get<any, any>(
    API.GETROLE_URL + `${page}/${limit}/?roleName=${roleName}`,
  )
}

//添加或更新角色的请求方法
export const reqAddorUpdateRole = (data: any) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDNEWROLE_URL, data)
  }
}
//删除已有角色的请求方法
export const reqRemoveRole = (roleId: number) => {
  return request.delete<any, any>(API.DELETEROLE_URL + roleId)
}

//根据角色id获取菜单的请求方法
export const reqGetRoleMenu = (roleId: number) => {
  return request.get<any, any>(API.GETROLEMENU_URL + roleId)
}

//给角色设置菜单权限的请求方法
export const reqSetRolePermission = (roleId: number, permissionId: any[]) => {
  return request.post<any, any>(
    API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`,
  )
}
