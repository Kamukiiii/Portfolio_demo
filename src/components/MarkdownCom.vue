<template>
  <div class="editor-wrapper">
    <header class="editor-header">
      <div class="left">
        <span class="title">文章编辑器</span>
      </div>
      <div class="right">
        <el-button type="info" plain @click="clearCache">清空缓存</el-button>
        <el-button type="success" @click="downloadFile">导出 .md</el-button>
        <el-button type="primary" @click="handleManualSave">保存草稿</el-button>
      </div>
    </header>

    <main class="editor-main">
      <MdEditor
        class="md-editor"
        v-model="text"
        theme="light"
        previewTheme="github"
        codeTheme="github"
        @onSave="handleSave"
        :onUploadImg="onUploadImg"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { ElMessage, ElMessageBox } from "element-plus";

const text = ref(`---
title: 我的标题
date: 2025-12-26
---
# 请开始你的创作...
`);

// 保存逻辑封装
const handleSave = (v: string) => {
  localStorage.setItem("post.md", v);
  console.log("自动保存成功");
};

// 手动保存按钮回调
const handleManualSave = () => {
  handleSave(text.value);
  ElMessage.success("草稿已保存至本地");
};

// 清空缓存
const clearCache = () => {
  ElMessageBox.confirm("确定要清空所有内容吗？", "提示", { type: "warning" }).then(() => {
    text.value = "";
    localStorage.removeItem("post.md");
  });
};

const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
  const urls = files.map((f) => URL.createObjectURL(f));
  callback(urls);
  ElMessage.info("图片已暂存（预览模式）");
};

const downloadFile = () => {
  const blob = new Blob([text.value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "post.md";
  link.click();
  URL.revokeObjectURL(url);
  ElMessage.success("文件下载成功");
};

onMounted(() => {
  const cached = localStorage.getItem("post.md");
  if (cached) text.value = cached;
});
</script>

<style lang="scss" scoped>
.editor-wrapper {
  display: flex;
  flex-direction: column;
  height: 98vh; // 占据视口高度，留一点边距
  background-color: #f5f7fa;
  padding: 10px;
  box-sizing: border-box;

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    background: #fff;
    border-bottom: 1px solid #e4e7ed;
    border-radius: 8px 8px 0 0;

    .title {
      font-weight: 600;
      font-size: 18px;
      color: #303133;
    }
  }

  .editor-main {
    flex: 1; // 自动充满剩余高度
    overflow: hidden;

    :deep(.md-editor) {
      height: 100% !important; // 强制编辑器充满容器
      border-radius: 0 0 8px 8px;
      border: none;
    }
  }
}
</style>
