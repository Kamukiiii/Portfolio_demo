<template>
  <el-page-header icon="" @back="goBack">
    <template #content>
      <div class="flex items-center">
        <el-avatar
          :size="32"
          class="mr-3"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
        <span class="text-large font-600 mr-3"> Monkey </span>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button>
          <RouterLink to="/">Home</RouterLink>
        </el-button>
        <el-button type="primary" class="ml-2">
          <RouterLink to="/assistant">Ai助手</RouterLink>
        </el-button>
        <el-button type="primary" class="ml-2">
          <RouterLink to="/add">Add</RouterLink>
        </el-button>
        <el-button type="primary" class="ml-2">
          <MenuCom></MenuCom>
        </el-button>
      </div>
    </template>
  </el-page-header>
  <router-view></router-view>
</template>

<script setup lang="ts">
import MenuCom from "@/components/MenuCom.vue";
const goBack = () => {
  window.history.back();
};
</script>
