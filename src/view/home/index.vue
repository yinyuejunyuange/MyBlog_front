<template>
  <div class = "h-min-[10px]">
    <el-scrollbar>
      <div class=" flex w-fit ">
        <p v-for="item in categoryList"
           :key="item.name"
           class="flex-shrink-0 flex items-center
            justify-center w-min-[50px] h-[30px] m-[10px] pl-[5px] pr-[5px] text-center rounded
            cursor-pointer bg-gray-100  "
           :class="{
        'bg-sky-200 text-sky-600': isActive === item.index, /* 选中后固定样式：更深的浅蓝背景 + 更亮的蓝色文字 */
        'hover:bg-sky-100 hover:text-sky-500': isActive !== item.index  /* 未选中时保留悬浮效果 */
      }"
           @click="clickItem(item.index)"
        >
          {{ item.label }}
        </p>
      </div>
    </el-scrollbar>
    <el-divider />
    <div class="w-full flex items-center justify-center" >
      <div class="flex-3 items-center w-min-[500px] bg-sky-200 ">
        <div class="hot-blog" >
          <p class="font-bold" >热门头条</p>
          <div class="hot-blog-image">
            <Upload v-model=showDialog />
          </div>
          <div class="hot-blog-list">

          </div>
        </div>
        <div class="hot-project">
          <p class="font-bold">开源项目</p>
          <div class="hot-project-list">

          </div>
        </div>
        <div class="support-blogs">
          <p class="font-bold">精选博客</p>
          <div class="support-blogs-list">

          </div>
        </div>
      </div>
      <div class=" hidden   md:flex md:flex-1 md:items-center  md:bg-gray-500  md:h-[50px]   ">

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Upload from "@/components/FileUpload/index.vue"
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

const isActive = ref('0')
const clickItem = (index) => {
  console.log("index",index)
  isActive.value = index;
}

const showDialog = ref(true);

</script>

<style scoped>
.el-divider--horizontal {
  @apply mt-[4px] mb-[4px];
}

</style>
