<template>
  <div class="types-container">
    <!-- 左箭头：点击向左滚动 -->
    <div class="scroll-btn"  @click="handleScroll('left')">
      <el-button> < </el-button>
    </div>
    <!-- 滚动容器：隐藏溢出，内部横向排列 -->
    <div class="types-list"  ref="scrollContainerRef">
      <!-- 循环渲染 el-tag，替代原 el-menu-item -->
      <el-tag
          class="types-tag"
          v-for="item in categoryList"
          :key="item.index"
          :class="{ 'active-tag': activeIndex === item.index }"
          @click="handleCategorySelect(item.index)"
          type="info"
      >
        {{ item.label }}
      </el-tag>
    </div>
    <!-- 右箭头：点击向右滚动 -->
    <div  class="scroll-btn"  @click="handleScroll('right')">
      <el-button> > </el-button>
    </div>
  </div>

</template>

<script setup lang="ts">
import {ref} from 'vue'
import {ElMessage} from "element-plus";
// 获取滚动容器的ref 用于获取DOM元素实现滚动
const scrollContainerRef = ref<HTMLDivElement>(null)
const handleScroll = (direction: 'left' | 'right') =>{
  if (!scrollContainerRef.value) {
    return
  }
  // 每次滚动 距离
  const scrollStep = 150;
  // 修改实现横向滚动
  scrollContainerRef.value.scrollLeft += direction === 'left'? -scrollStep : scrollStep;
}

/**
 * 列表信息
 * @type {Ref<UnwrapRef<*[]>, UnwrapRef<*[]> | *[]>}
 */
// 1. 提取分类数据（结构化管理，替代原有的 el-menu-item，方便循环渲染）
const categoryList = [
  { index: "0", label: "综合" },
  { index: "BEFORE_END", label: "前端" },
  { index: "VUE", label: "Vue" },
  { index: "HTML", label: "HTML" },
  { index: "CSS", label: "CSS" },
  { index: "JAVASCRIPT", label: "JavaScript" },
  { index: "AFTER_END", label: "后端" },
  { index: "JAVA", label: "Java" },
  { index: "PYTHON", label: "Python" },
  { index: "C11", label: "C++" },
  { index: "C", label: "C" },
  { index: "COMPUTER", label: "计算机" },
  { index: "OS", label: "操作系统" },
  { index: "REACT", label: "React" },
  { index: "UMI", label: "Umi" },
  { index: "microservices", label: "微服务" },
  { index: "distributed", label: "分布式" },
  { index: "AI", label: "人工智能" },
  { index: "DATABASE", label: "数据库" },
  { index: "MYSQL", label: "MySQL" },
  { index: "REDIS", label: "Redis" },
  { index: "NETWORK", label: "计算机网络" },
  { index: "GIT", label: "Git" },
  { index: "TS", label: "TypeScript" },
  { index: "GO", label: "Go" },
  { index: "RUST", label: "Rust" }
];

const activeIndex = ref("0");

const type = ref("0")
// 处理分类选择
const handleCategorySelect = (index) => {
  type.value = index

}

</script>

<style scoped>
.types-container{
  background: #fff;
  display: flex;
  /* 核心补充 1：盒模型优化，保证宽度包含内边距/边框，不溢出 */
  box-sizing: border-box;
  max-width: 80vw;
  min-width: 40vh;
  gap: 1rem;
  padding-bottom: 0.5rem;
  overflow: hidden;
}

.types-list{
  overflow: hidden;
  display: flex;
  gap: 1rem;
  overflow-x: auto ; /*允许横向滚动*/
  scroll-behavior: smooth; /*平滑滚动*/
  /*隐藏原生滚动条*/
  scrollbar-width: none;  /*兼容 FIREFOX*/
  -ms-overflow-style: none; /* IE/EDGE */
}
.types-tag{
  cursor: pointer;
  /* 核心补充 3：禁止标签被 flex 压缩，保证标签宽度固定，容器仅收缩滚动区域（视觉更整洁） */
  flex-shrink: 0;
}
.scroll-btn{
  position: relative;
  top: -0.5vh;
}


</style>