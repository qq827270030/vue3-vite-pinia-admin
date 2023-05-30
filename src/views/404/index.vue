<template>
  <div class="out">
    <div class="noFound"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.out {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: orangered;
}
.noFound {
  width: 1014px;
  height: 556px;
  background: url(@/assets/images/error_images/404.png) no-repeat;
}
</style>
