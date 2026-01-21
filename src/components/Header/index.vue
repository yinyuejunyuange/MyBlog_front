<template>
  <div class="flex justify-between items-center h-full pr-0 md:pr-20 ">
    <img :src="logo" alt="logo" class="w-20 h-20" />
    <div class="hidden md:flex items-center gap-8">
      <el-input
        v-model="input"
        placeholder="搜索"
        size="large"
        style="width: 600px"
      >
        <template #append>
          <el-button icon="Search" />
        </template>
      </el-input>
      <el-popover placement="bottom">
        <template #reference>
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            class="cursor-pointer"
          />
        </template>
        <div class="min-w-[120px]">
          <div
            class="cursor-pointer text-center py-2.5 px-4 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-t-md"
          >
            登录
          </div>
          <div class="border-t border-gray-100"></div>
          <div
            class="cursor-pointer text-center py-2.5 px-4 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-b-md"
          >
            注册
          </div>
        </div>
      </el-popover>
    </div>
    <div
      class="flex md:hidden items-center gap-2 cursor-pointer"
      @click="handleOpenDrawer"
    >
      <el-icon><Fold /></el-icon>
    </div>
    <el-drawer v-model="drawer" title="菜单" direction="rtl" :size="300">
      <Aside />
    </el-drawer>
  </div>
</template>

<script setup>
import logo from "@/assets/images/logo.png";
import Aside from "@/components/Aside/index.vue";
import { ref } from "vue";
const input = ref("");
const drawer = ref(false);
const handleOpenDrawer = () => {
  drawer.value = true;
};
</script>

<style scoped></style>
