//封装本地存储数据和读取数据的方法

//存储
export let SET_TOKEN = (token: string) => {
  localStorage.setItem('TOKEN', token)
}

//读取
export let GET_TOKEN = () => {
  return localStorage.getItem('TOKEN')
  //console.log(888,localStorage.getItem('TOKEN'))
}

//移除
export let REMOVE_TOKEN = () => {
  localStorage.removeItem('TOKEN')
}
