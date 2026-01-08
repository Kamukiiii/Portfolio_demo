<template>
  <div class="post-page">
    <header class="post-header">
      <div class="header-content">
        <h1 class="post-title">{{ title }}</h1>
        <div class="post-meta" v-if="attributes">
          <el-tag v-if="attributes.date" size="small" effect="plain">
            {{ attributes.date }}
          </el-tag>
          <el-tag v-if="attributes.author" size="small" type="success" effect="plain">
            {{ attributes.author }}
          </el-tag>
        </div>
      </div>
    </header>

    <main class="post-container">
      <aside class="file-index-aside">
        <div class="index-card">
          <div class="index-title">📂 文件列表</div>
          <ul class="file-list">
            <li
              v-for="file in fileList"
              :key="file"
              :class="{ active: currentFileName === file }"
              @click="switchFile(file)"
            >
              <span class="icon">📄</span> {{ file }}.md
            </li>
          </ul>
        </div>
      </aside>
      <article class="post-content">
        <MdPreview class="showMD" :id="id" :modelValue="pureText" :previewTheme="state.theme" />
      </article>

      <aside class="post-aside" v-if="showCatalog">
        <div class="catalog-card">
          <div class="catalog-title">目录</div>
          <MdCatalog :editorId="id" :scrollElement="scrollElement!" />
        </div>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, computed, watch } from "vue";
import { MdPreview, MdCatalog } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";
import { useThemeStore } from "@/stores/themeStore";
import { useRoute } from "vue-router";
import fm from "front-matter";
import router from "@/router";
import { ElMessage } from "element-plus";

const id = "preview-only";
const rawText = ref(""); // 原始文本
const attributes = ref<BlogAttributes | null>(null); // 元数据
const ThemeStore = useThemeStore();
const route = useRoute();
const scrollElement = ref<HTMLElement | null>(null);
const currentFileName = ref("");
const fileList = ref<string[]>([
  "test",
  "我的第一篇文章",
  "Vue3进阶指南",
  "整数溢出判断",
  "算法总结笔记",
]);
interface BlogAttributes {
  title: string;
  date?: string;
  author?: string;
  cover?: string;
}

const state = reactive({
  theme: computed(() => ThemeStore.theme),
});

//切换文件逻辑
const switchFile = (fileName: string) => {
  currentFileName.value = fileName;
  router.push({
    path: "/",
    query: {
      fileName: fileName,
    },
  });
};

// 计算属性：剔除 Front-matter 后的正文内容
const pureText = computed(() => {
  const result = fm(rawText.value);
  return result.body;
});

const title = computed(() => attributes.value?.title || "未命名文章");
const showCatalog = ref(true);

// onMounted(async () => {
//   scrollElement.value = document.documentElement;
//   const file_name = route.query.fileName;
//   try {
//     const response = await fetch(`/files/${file_name}.md`);
//     if (response.ok) {
//       const content = await response.text();
//       rawText.value = content;
//       const result = fm<BlogAttributes>(content);
//       attributes.value = result.attributes;
//     }
//   } catch (error) {
//     console.error("读取失败:", error);
//   }
// });
// 监听文件名变化，重新加载内容
watch(
  () => currentFileName.value,
  async (newName) => {
    if (!newName) return;
    try {
      const response = await fetch(`/files/${newName}.md`);
      if (response.ok) {
        const content = await response.text();
        rawText.value = content;
        const result = fm<BlogAttributes>(content);
        attributes.value = result.attributes;
      }
    } catch (error) {
      ElMessage.error("切换文件失败");
      console.error("切换文件失败:", error);
    }
  },
  { immediate: true },
);

onMounted(() => {
  // 初始化：优先读取 URL 中的 fileName，否则默认选第一个
  const nameFromUrl = route.query.fileName;
  if (typeof nameFromUrl === "string") {
    currentFileName.value = nameFromUrl;
  } else {
    currentFileName.value = fileList.value[0] || "";
  }
});
</script>

<style lang="scss" scoped>
.post-page {
  background-color: #fcfcfc;
  min-height: 100vh;
}

/* 头部样式：保留你原本的艺术字风格并升级 */
.post-header {
  height: 35vh;
  background-color: #f0f2f5;
  background-image: radial-gradient(#d1d1d1 1px, transparent 1px);
  background-size: 20px 20px;
  /* 简约的点状背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #eee;

  .header-content {
    text-align: center;

    .post-title {
      font-size: 48px;
      font-weight: 800;
      margin-bottom: 20px;
      // 保留你原本的特殊填充效果
      -webkit-text-fill-color: transparent;
      -webkit-background-clip: text;
      background-clip: text;
      background-image: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAHklEQVQImWNkYGBgYGD4//8/A5wF5SBYyAr+//8PAPOCFO0Q2zq7AAAAAElFTkSuQmCC);
      text-shadow:
        4px -4px #000,
        3px -3px #fff;
    }

    .post-meta {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
  }
}

/* 正文容器：控制阅读宽度 */
.post-container {
  max-width: 1400px;
  margin: -40px auto 40px;
  /* 向上偏移，产生重叠感 */
  display: flex;
  gap: 20px;
  padding: 0 20px;
  /* 左侧索引样式 */
  .file-index-aside {
    width: 240px;
    .index-card {
      position: sticky;
      top: 20px;
      background: #fff;
      padding: 15px;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);

      .index-title {
        font-weight: bold;
        padding-bottom: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid #f0f0f0;
      }

      .file-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          padding: 10px 12px;
          margin-bottom: 4px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
          color: #606266;

          &:hover {
            background-color: #f5f7fa;
            color: #409eff;
          }

          &.active {
            background-color: #ecf5ff;
            color: #409eff;
            font-weight: bold;
          }

          .icon {
            margin-right: 6px;
          }
        }
      }
    }
  }
  .post-content {
    flex: 1;
    background: #fff;
    padding: 20px 40px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    min-width: 0; // 防止代码块撑破布局
  }

  .post-aside {
    width: 280px;

    @media (max-width: 992px) {
      display: none; // 窄屏隐藏目录
    }

    .catalog-card {
      position: sticky;
      top: 20px;
      background: #fff;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
      max-height: 80vh;
      overflow-y: auto;

      .catalog-title {
        font-weight: bold;
        margin-bottom: 15px;
        padding-left: 10px;
        border-left: 4px solid #409eff;
      }
    }
  }
}

:deep(.showMD) {
  background: transparent !important;

  .md-editor-preview {
    word-break: break-word;
  }
}
</style>
