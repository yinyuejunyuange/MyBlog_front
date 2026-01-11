<!-- 界面左侧菜单栏 -->
<script setup lang="ts">
import { ref } from 'vue'; // 引入ref创建响应式变量
// 定义两个板块的菜单数据（结构化管理，方便后续扩展）
const menuSection1 = [
  { label: "首页", key: "home" },
  { label: "下载", key: "download" },
  { label: "学习", key: "study" },
  { label: "社区", key: "community" }
];

const menuSection2 = [
  { label: "关注", key: "follow" },
  { label: "收藏", key: "collect" },
  { label: "历史", key: "history" },
  { label: "创作中心", key: "create" }
];

const activeKey = ref('');

// 核心：菜单项点击事件，更新激活状态
const handleMenuItemClick = (key: string) => {
  activeKey.value = key;
};
</script>

<template>
  <!-- 左侧菜单栏外层容器 -->
  <div class="left-menu-container">
    <!-- 板块1：首页、下载、学习、社区 -->
    <div class="menu-section">
      <div
          class="menu-item"
          v-for="item in menuSection1"
          :key="item.key"
          @click="handleMenuItemClick(item.key)"
          :class="{ active: activeKey === item.key }"
      >
        <h3 > {{ item.label }}</h3>
      </div>
    </div>

    <!-- 板块分隔线（核心：实现两个板块间的线条间隔） -->
    <div class="menu-divider"></div>

    <!-- 板块2：关注、收藏、历史、创作中心 -->
    <div class="menu-section">
      <div
          class="menu-item"
          v-for="item in menuSection2"
          :key="item.key"
          @click="handleMenuItemClick(item.key)"
          :class="{ active: activeKey === item.key }"
      >
        <h4>{{ item.label }}</h4>
      </div>
    </div>
  </div>
</template>

<style scoped>
.left-menu-container{
  width: 40%;
}

.menu-item {
  margin: 0 1rem;
  padding: 1rem  0.5rem;
  /* 1. 鼠标悬浮时显示可点击手势（立即生效） */
  cursor: pointer;
  /* 2. 添加过渡延时（0.2s 顺滑过渡，实现悬浮/激活样式的延时变化） */
  transition: all 0.2s ease;
  border-radius: 15px;
}

.menu-item h3{
  margin: 0;
  padding: 0;
}

.menu-item h4{
  margin: 0;
  padding: 0;
}


/* 核心：鼠标悬浮效果（背景变黑+字体变白，带过渡延时） */
.menu-item:hover {
  background-color: #dad8d8; /* 纯黑背景，如需浅黑可改为 #2c2c2c */
}

/* 核心：点击后激活态样式（字体变色，可自定义颜色） */
.menu-item.active {
  color: #409eff; /* 激活后字体变蓝色（可改为你需要的颜色，如 #ff4949） */
  font-weight: 600; /* 可选：加粗，突出激活态 */
}
.menu-divider {
  border-top: 1px solid #d4d6dc;
}



</style>