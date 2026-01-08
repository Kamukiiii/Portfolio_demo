<template>
  <div>
    <ul>
      <li class="item" v-for="file in files" :key="file.fileName" @click="goToHome(file)">
        {{ file.fileName }}
      </li>
    </ul>
  </div>
</template>
files
<script setup lang="ts">
//定义文件对象结构
interface FileItem {
  fileName: string;
}
import router from '@/router';
import { ref } from 'vue';
const files = ref([
  { fileName:'test' },
  { fileName:'文件一' },
])
//为参数指定类型
const goToHome = (file: FileItem) => {
  router.push({
    path:'/',
    query: {
      fileName: file.fileName
    }
  })
}
</script>

<style lang="scss" scoped>
.item {
  cursor: pointer;
  list-style: none;
}
</style>
