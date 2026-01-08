<template>
  <!-- <MdCatalog :editorId="id" :scrollElement="scrollElement" /> -->
  <div class="head">
    <h1>{{ title }}</h1>
  </div>
  <div>
    <MdPreview class="showMD" :id="id" :modelValue="text" :previewTheme="state.theme"  />
  </div>
</template>

<script setup lang="ts">
import { reactive,onMounted, ref, computed } from 'vue';
import { MdPreview } from 'md-editor-v3';
// preview.css相比style.css少了编辑器那部分样式
import 'md-editor-v3/lib/preview.css';
import 'md-editor-v3/lib/style.css';
import { useThemeStore } from '@/stores/themeStore';
import { useRoute } from 'vue-router';
import fm from 'front-matter';
const id = 'preview-only';
const text = ref('');
const ThemeStore = useThemeStore();

// 1. 定义博客元数据的结构
interface BlogAttributes {
  title: string
  date?: string;  // 问号表示这个字段是可选的
  author?: string;
  cover?: string;
}

// const scrollElement = document.documentElement;
const state = reactive({
  text: '',
  theme:computed(() => ThemeStore.theme),
});



const route = useRoute();

const title = ref('')

onMounted(async () => {
  const file_name = route.query.fileName
  try {
    // 浏览器会发起 HTTP 请求读取 public 目录下的文件
    const response = await fetch(`/files/${file_name}.md`);
    if (response.ok) {
      text.value = await response.text();
      const result = fm<BlogAttributes>(text.value)
      const attributes = result.attributes
      title.value = attributes.title


    }
  } catch (error) {
    console.error('读取 Markdown 文件失败:', error);
  }
console.log(title.value)

});

</script>

<style scoped>
.showMD{
  margin: 20px;
  background-color: transparent !important;
}
.head{

  h1 {
      text-align: center;
      line-height: 25vh;
      background: #EEE url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAHklEQVQImWNkYGBgYGD4//8/A5wF5SBYyAr+//8PAPOCFO0Q2zq7AAAAAElFTkSuQmCC) repeat;
      text-shadow: 5px -5px black, 4px -4px white;
      font-weight: bold;
      -webkit-text-fill-color: transparent;
      -webkit-background-clip: text;
      background-clip: text;
      font-size: 50px;
      padding-bottom: 0px;
    }

}

</style>
