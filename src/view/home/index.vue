<template>
  <div class="flex gap-2 w-full overflow-hidden">
    <el-tabs v-model="currentCategory">
      <el-tab-pane
        v-for="item in categoryList"
        :key="item.name"
        :label="item.label"
        :name="item.index"
      >
        {{ item.label }}
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from "vue";
const currentCategory = ref("0");
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
  { index: "RUST", label: "Rust" },
];
</script>

<style scoped></style>
