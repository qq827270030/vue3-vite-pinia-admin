//封装一个判断时间的函数
export const GET_TIME = () => {
  let message = ''
  let hours: any = new Date().getHours()
  if (hours > 5 && hours < 9) {
    message = '早上好'
  } else if (hours >= 9 && hours < 12) {
    message = '上午好'
  } else if (hours >= 12 && hours < 14) {
    message = '中午好'
  } else if (hours >= 14 && hours < 19) {
    message = '下午好'
  } else {
    message = '晚上好'
  }

  return message
}
