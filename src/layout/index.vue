<template>
  <!-- logo + 搜索 -->
  <div class="common-layout">
    <el-container>
      <el-header class="border-b  border-gray-200  fixed z-10 w-full "  >
        <Header />
      </el-header>
      <el-container>
        <el-aside width="200px" class="hidden md:block md:fixed md:z-10 mt-[60px] ">
          <Aside />
        </el-aside>
        <el-main class="md:ml-[190px] mt-[40px] "  >
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<!-- 界面左侧菜单栏 -->
<script setup lang="ts">
import Header from "@/components/Header/index.vue";
import Aside from "@/components/Aside/index.vue";
</script>
