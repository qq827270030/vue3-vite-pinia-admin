<template>
  <div class="login-container">
    <el-form
      class="login-form"
      :model="loginForm"
      :rules="rules"
      :status-icon="false"
      ref="loginRules"
    >
      <h1>🥰Hello</h1>
      <h2>💞欢迎来到硅谷甄选后台管理系统💞</h2>
      <div class="input">
        <el-form-item prop="username">
          <el-input
            type="text"
            class="username"
            :prefix-icon="User"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            class="password"
            :prefix-icon="Lock"
            v-model="loginForm.password"
            show-password
          ></el-input>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          class="login-btn"
          @click="login"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElNotification, ElMessage } from 'element-plus'
//引入用户数据仓库，用来发送登录请求
import useUserStore from '@/store/modules/user'
import { GET_TIME } from '@/utils/time'
let $router = useRouter()
let useStore = useUserStore()
let loading = ref(false)
let loginRules = ref()
let loginForm = reactive({
  username: 'admin',
  password: 'atguigu123',
})

const login = async () => {
  //表单校验通过后才能执行
  await loginRules.value.validate()
  //点击登录按钮让按钮样式变成加载中。。。
  loading.value = true
  //1.收集输入框的用户名和密码
  //2.通知仓库发送请求
  //3.请求成功->首页展示数据的地方
  //4.请求失败->弹出失败信息
  useStore
    .userLogin(loginForm)
    .then((_response: any) => {
      //登录成功用编程式路由导航跳转至首页
      $router.push('/')
      ElNotification({
        type: 'success',
        message: '登录成功,欢迎回来！',
        title: `Hi,${GET_TIME()}`,
      })
      //请求成功后，按钮加载样式消失。。。
      loading.value = false
    })
    .catch((err: any) => {
      //alert(err.message)
      ElMessage({
        type: 'error',
        message: err.message,
      })
      loading.value = false
    })
}

const rules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'change' },
    { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'change' },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'change' },
    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'change' },
  ],
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100vh;
  background: url('../../assets/images/05.png') no-repeat center / cover;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-form {
    width: 38vw;
    height: 40vh;
    background-color: #fff5;
    box-shadow: 0 8px 16px #0005;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;

    h1 {
      color: white;
      font-size: 40px;
      text-shadow: 0 0 20px #fff5;
    }

    h2 {
      color: white;
    }

    .username {
      width: 19vw;
    }

    .password {
      width: 19vw;
    }

    .login-btn {
      width: 100px;
      background-color: #6fcaea;
    }
  }
}
</style>
