<template>
  <el-card>
    <div class="home">
      <img :src="useStore.avatar" alt="" />
      <div>
        <h1>{{ `${GET_TIME()},${useStore.username}` }}</h1>
        <h1>东方甄选运营平台</h1>
      </div>
    </div>
  </el-card>
  <el-card>
    <div class="background"></div>
  </el-card>
</template>

<script setup lang="ts">
// import { onMounted } from 'vue';
import useUserStore from '@/store/modules/user'
import { GET_TIME } from '@/utils/time'
let useStore = useUserStore()
// onMounted(()=>{
//     //console.log(666)
//     useStore.getUserInfo()
// })
</script>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: row;
  align-items: center;
  img {
    border-radius: 50%;
    width: 100px;
    height: 100px;
  }
  div {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;

    h1:nth-child(1) {
      margin-bottom: 12px;
    }
    h1:nth-child(2) {
      margin-top: 12px;
    }
  }
}

.background {
  width: 100vw;
  height: 542px;
  background-image: url(@/assets/images/backgroundhome.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: -200px -550px;
}
</style>
