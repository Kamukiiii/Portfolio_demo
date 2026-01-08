<template>
    <el-dropdown>
      <span class="el-dropdown-link">
        主题
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="theme in themeList" :key="theme.themename"
            @click="handleSelect(theme.themename)">{{ theme.themename }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
</template>

<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { ref } from 'vue';
import { useThemeStore } from '@/stores/themeStore';
const themeList = ref([
  {themename:'default'},
  {themename:'github'},
  {themename:'vuepress'},
  {themename:'mk-cute'},
  {themename:'smart-blue'},
  {themename:'cyanosis'},
])
const ThemeStore = useThemeStore()
const handleSelect = (value: string) => {
  ThemeStore.setTheme(value)
}



</script>

<style scoped lang="scss">
.el-dropdown-link{
  color:white;
}
</style>
