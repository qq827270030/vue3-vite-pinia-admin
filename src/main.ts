import { createApp } from 'vue'
import App from './App.vue'
import pinia from './store'
const app = createApp(App)
app.use(pinia)
app.mount('#app')
console.log(pinia)

const a = 100
const fun = () => {
  console.log(666)
}
