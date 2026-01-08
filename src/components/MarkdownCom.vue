<!-- App.vue -->
<template>
  <div class="container">
    <MdEditor class="md-editor" v-model="text" theme="light" previewTheme="github" codeTheme="github" @onSave="handleSave"
      :onUploadImg="onUploadImg" />
  </div>
  <el-button class="sButton" @click="downloadFile" type="success">下载</el-button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {MdEditor} from 'md-editor-v3'


const text = ref(`
---
title: 我的标题
date: 2025 - 12 - 26
---
# 正文内容
`)





function handleSave(v: string, html: string) {
  console.log('保存内容：', v)
  console.log('渲染 HTML：', html)
  localStorage.setItem('post.md', v)
}

const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
  // 示例：本地预览；生产中应将 files 上传到服务器后返回可访问的 URL 列表
  const urls = files.map((f) => URL.createObjectURL(f))
  callback(urls)
}

const downloadFile = () => {
  //1.创建一个 Blob 对象，将数据写入其中
  const blob = new Blob([text.value], { type: 'text/plain' })
  //2.创建一个 URL 对象，将 Blob 对象作为参数
  const url = URL.createObjectURL(blob)
  //3.创建一个 a 标签，将 URL 对象作为 href 属性值
  const link = document.createElement('a')
  link.href = url
  //4.设置下载文件名
  link.download = 'post.md'
  //5.模拟点击 a 标签，实现下载
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  //6.释放 URL 对象
  URL.revokeObjectURL(url)
}

onMounted(() => {
  const cached = localStorage.getItem('post.md')
  if (cached) text.value = cached
})
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.sButton {
  margin-top: 20px;
}

</style>
