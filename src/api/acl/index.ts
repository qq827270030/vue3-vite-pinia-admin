//用户管理模块的api地址以及请求方法

import request from '@/utils/request'

enum API {
  GETALLUSER_URL = '/admin/acl/user/', //获取用户分页列表的地址
  ADDUSER_URL = '/admin/acl/user/save', //新增管理用户的地址
  UPDATEUSER_URL = '/admin/acl/user/update', //更新用户的地址
  GETALLROLE_URL = '/admin/acl/user/toAssign/', //获取全部职位和角色列表和包含该用户已有的职位
  SETUSERROLE_URL = '/admin/acl/user/doAssignRole', //根据用户分配角色
  DELETEUSER_URL = '/admin/acl/user/remove/', //根据用户id删除管理用户
  DELETEUSERLIST_URL = '/admin/acl/user/batchRemove', //根据用户id列表批量删除管理用户
}

//获取用户分页和列表的请求方法

export const reqGetAlluser = (Page: number, Limit: number, name: string) => {
  return request.get<any, any>(
    API.GETALLUSER_URL + `${Page}/${Limit}/?name=${name}`,
  )
}

//新增管理用户的请求方法
export const reqAddOrUpdateUser = (data: any) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}

//获取全部职位和角色列表和包含该用户已有的职位请求方法
export const reqGetAllUserRole = (AdminId: number) => {
  return request.get<any, any>(API.GETALLROLE_URL + AdminId)
}

//根据用户分配角色请求方法
export const reqSetUserRoles = (data: any) => {
  return request.post<any, any>(API.SETUSERROLE_URL, data)
}

//根据用户id删除管理用户的请求方法
export const reqRemoveUser = (id: number) => {
  return request.delete<any, any>(API.DELETEUSER_URL + id)
}
//根据用户id列表批量删除管理用户请求方法
export const reqRemoveUserList = (idList: number[]) => {
  return request.delete<any, any>(API.DELETEUSERLIST_URL, { data: idList })
}
