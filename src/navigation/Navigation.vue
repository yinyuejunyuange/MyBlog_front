

<!--<template>-->
<!--  <div>-->
<!--    <router-link to="/editor">editor</router-link>-->
<!--    <router-link to="/reader">reader</router-link>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->

<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
<template>
  <el-menu
      :default-active="activeMenu"
      class="navbar"
      mode="horizontal"
  >
<!--          mode="horizontal"-->
    <el-menu-item index="/editor">
      <router-link to="/editor">Editor</router-link>
    </el-menu-item>
    <el-menu-item index="/reader">
      <router-link to="/reader">Reader</router-link>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue';

const activeMenu = ref('/editor'); // 默认激活的菜单项
</script>

<style scoped>
.navbar {
  margin-bottom: 20px;
  width: 100%; /* 或者设置为一个合适的固定宽度 */
  overflow: hidden; /* 防止溢出 */
}
</style>
