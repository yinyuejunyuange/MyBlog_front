<template>
  <!-- 左侧菜单栏外层容器 -->
  <div class="left-menu-container" v-if="isHomePage">

    <!-- 板块1：首页、下载、学习、社区 -->
    <div class="menu-section">
      <div
          class="menu-item"
          v-for="item in menuSection1"
          :key="item.key"
          @click="handleMenuItemClick(item.key)"
          :class="{ active: activeKey === item.key }"
      >

       <div>
         <h3>
           <FontAwesomeIcon :icon="item.icon" />
           <span class="menu-item-label" >{{ item.label }}</span>
         </h3>
       </div>
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
        <div>
          <h3><font-awesome-icon :icon="item.icon" />
            <span class="menu-item-label" >{{ item.label }}</span>
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- 界面左侧菜单栏 -->
<script setup lang="ts">
import {computed, ref} from 'vue';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import * as byPrefixAndName from "@fortawesome/free-solid-svg-icons";
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router"; // 引入ref创建响应式变量
// 获取当前路由对象，判断是否为Home页面
const route = useRoute();
// 定义两个板块的菜单数据（结构化管理，方便后续扩展）
const menuSection1 = [
  { label: "首页", key: "home" ,icon: "fa-solid fa-house" },
  { label: "下载", key: "download" ,icon:"fa-solid fa-download"},
  { label: "学习", key: "study" , icon: "fa-solid fa-layer-group"},
  { label: "社区", key: "community", icon: "fa-regular fa-building" },
];

const menuSection2 = [
  { label: "关注", key: "follow" ,icon: "far fa-heart" },
  { label: "收藏", key: "collect" ,icon: "far fa-star"},
  { label: "历史", key: "history" ,icon: "fa-solid fa-clock-rotate-left"},
  { label: "创作中心", key: "create" ,icon: "fa-solid fa-pencil"},
];

const activeKey = ref('');

// 核心：菜单项点击事件，更新激活状态
const handleMenuItemClick = (key: string) => {
  activeKey.value = key;
};

const isHomePage = computed(() => {  // 每次执行都会重新计算
  return route.path === "/home"; // 你的核心逻辑保留，正确无误
});
</script>
<style scoped>
.left-menu-container{
  width: 50%;
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
@media (max-width: 800px) {
  .menu-item-label{
    display: none;
  }
}
/* 针对 某项容器的响应式修改该 */
.menu-section{
  min-width: 60px;
  container-type: inline-size; /* 开启容器查询，基于板块自身宽度 */
  container-name: menu-section; /* 给容器命名，方便后续查询 */
}

@container menu-section (max-width: 120px) {
  .menu-item-label{
    display: none;
  }
}

</style>