//登录接口请求数据的类型

export interface loginForm {
  username: String
  password: String
}

//登录接口返回的数据类型
interface dataType {
  token: string
  message: string
}

export interface loginResponseData {
  code: number
  data: dataType
}

//定义服务器返回用户相关信息的数据类型
interface user {
  checkUser: {
    userId: number
    avatar: string
    username: string
    password: string
    desc: string
    roles: string[]
    buttons: string[]
    routes: string[]
    token: string[]
  }
}
export interface userResponseData {
  code: number
  data: user
}
