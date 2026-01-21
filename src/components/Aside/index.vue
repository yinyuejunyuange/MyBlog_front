<template>
  <div class="h-screen">
    <el-menu
      class="h-full"
      :default-active="activeIndex"
      @select="handleSelect"
      :router="true"
    >
      <el-menu-item v-for="item in menu_one" :key="item.key" :index="item.key">
        <el-icon><component :is="item.icon" /></el-icon>
        <span>{{ item.label }}</span>
      </el-menu-item>
      <el-divider/>
      <el-menu-item v-for="item in menu_two" :key="item.key" :index="item.key">
        <el-icon><component :is="item.icon" /></el-icon>
        <span>{{ item.label }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { ref } from "vue";
const activeIndex = ref("home");

const menu_one = [
  { label: "首页", key: "/home", icon: "Menu" },
  { label: "下载", key: "/download", icon: "Menu" },
  { label: "学习", key: "study", icon: "Menu" },
  { label: "社区", key: "community", icon: "Menu" },
];

const menu_two = [
  { label: "关注", key: "follow", icon: "Menu" },
  { label: "收藏", key: "collect", icon: "Menu" },
  { label: "历史", key: "history", icon: "Menu" },
  { label: "创作中心", key: "create", icon: "Menu" },
];

const handleSelect = (key) => {
  activeIndex.value = key;
};
</script>

<style scoped></style>
