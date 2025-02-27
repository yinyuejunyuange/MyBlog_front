<template>
  <div class="blog-container flex p-4">
    <!-- 左侧分类列表 -->
    <div class="left-block w-64 mr-4">
      <el-menu
          class="category-menu"
      >
        <el-menu default-active="0" @select="handleCategorySelect">
          <el-menu-item index="0">
            <span>综合</span>
          </el-menu-item>
          <el-menu-item index="BEFORE_END">前端</el-menu-item>
          <el-menu-item index="VUE">Vue</el-menu-item>
          <el-menu-item index="HTML">HTML</el-menu-item>
          <el-menu-item index="CSS">CSS</el-menu-item>
          <el-menu-item index="JAVASCRIPT">JavaScript</el-menu-item>
          <el-menu-item index="AFTER_END">后端</el-menu-item>
          <el-menu-item index="JAVA">Java</el-menu-item>
          <el-menu-item index="PYTHON">Python</el-menu-item>
          <el-menu-item index="C11">C++</el-menu-item>
          <el-menu-item index="C">C</el-menu-item>
          <el-menu-item index="COMPUTER">计算机</el-menu-item>
          <el-menu-item index="OS">操作系统</el-menu-item>
        </el-menu>
      </el-menu>
    </div>

    <!-- 文章列表区域 -->
    <div class="middle-block flex-grow overflow-auto max-h-[800px]">
      <div class="articles-list space-y-4">
        <el-card
            v-for="article in articles"
            :key="article.id"
            class="article-item"
            shadow="hover"
            @click="readArticle(article.id)"
        >
          <div class="flex flex-col">
            <h2 class="title">{{ article.title }}</h2>
            <p class="summary">{{ article.introduce }}</p>

<!--            <div class="flex justify-between items-center">-->
<!--              <div class="text-sm text-gray-500 space-x-2">-->
<!--                <el-tag type="info">{{ article.userName }}</el-tag>-->
<!--                <el-tag type="info">{{ formatTime(article.createTime) }}</el-tag>-->
<!--              </div>-->

<!--              <div class="text-sm text-gray-500 space-x-2">-->
<!--              -->
<!--              </div>-->
<!--            </div>-->
            <div class="items-in-list">
              <div class="text-sm text-gray-500 space-x-2">
                <div class="artclass">
                  <el-tag type="success">Star: {{ article.star }}</el-tag>
                  <el-tag type="warning">Watch: {{ article.watch }}</el-tag>
                  <el-tag type="info">Kudos: {{ article.kudos }}</el-tag>
                </div>

                <div class="artclassTwo">
                  <el-tag type="info">{{ article.userName }}</el-tag>
                  <el-tag type="info">{{ formatTime(article.createTime) }}</el-tag>

                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 分页 -->
      <div class="page-controller flex justify-center mt-6">
        <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 右侧热门文章排行 -->
    <div class="right-block w-64 ml-4">
      <h2 class="text-xl font-bold mb-4">热门文章排行</h2>
      <el-card
          v-for="(article, index) in topArticles"
          :key="article.id"
          class="mb-3 cursor-pointer hover:bg-gray-100 transition-colors"
          shadow="hover"
          @click="viewTopArticle(article.id)"
      >
        <div class="flex items-center">
          <el-tag
              :type="index === 0 ? 'danger' : index === 1 ? 'warning' : 'info'"
              class="mr-2"
          >
            {{ index + 1 }}
          </el-tag>
          <div>
            <h4 class="text-sm font-semibold">{{ article.title }}</h4>
            <div class="flex items-center text-xs text-gray-500">
              <el-icon><View /></el-icon>
              <span class="ml-1">{{ article.viewCount }}</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios   from "axios";
import router from "@/router/router.js";


// 文章列表数据
const articles = ref([])

// 分页相关
const total = ref()  // 总文章数
const pageSize = ref()  // 每页文章数
const currentPage=ref(1) // 当前页数
const type=ref("0") // 默认综合 没有选择

// 处理分类选择
const handleCategorySelect = (index) => {

  type.value=index

  ElMessage({
    message: `选中分类：${index}`,
    type: 'info'
  })

  getBlogPage()

  // 这里可以添加根据分类筛选文章的逻辑
}

// 处理分页变化
const handlePageChange = (currentPages) => {


  currentPage.value=currentPages

  ElMessage({
    message: `切换到第 ${currentPages} 页`,
    type: 'success'
  })
  // 这里可以添加获取新页面文章的逻辑
  getBlogPage()
}



// 阅读文章
const readArticle = async (articleId) => {

  if(localStorage.getItem("token")===null){
    const response=await axios.get('http://localhost:8080/myBlog/user/blog/read',{
      params:{
        id: articleId,
      }
    })
    if(response.data.code===200){
      console.log(response.data.data)
      console.log(JSON.stringify(response.data.data))
      await router.push({
        path:'/reader',
        query: {
          post: JSON.stringify(response.data.data)  // 或者使用query传递数据
        }
      })
    }
  }else{
    const response=await axios.get('http://localhost:8080/myBlog/user/blog/read',{
      params:{
        id: articleId,
      },
      headers:{
        token:localStorage.getItem("token")
      }
    })
    if(response.data.code===200){
      console.log(response.data.data)
      console.log(JSON.stringify(response.data.data))
      await router.push({
        path:'/reader',
        query: {
          post: JSON.stringify(response.data.data)  // 或者使用query传递数据
        }
      })
    }
  }
  // ElMessage({
  //   message: `查看文章详情：${articleId}`,
  //   type: 'success'
  // })
  // 这里可以添加跳转到文章详情页的逻辑
}

// 热门文章排行
const topArticles = ref([
  { id: 1, title: 'JavaScript高级编程', viewCount: 10086 },
  { id: 2, title: 'React全栈开发', viewCount: 8888 },
  { id: 3, title: 'Node.js实战', viewCount: 6666 }
])

// 查看热门文章
const viewTopArticle = (articleId) => {
  ElMessage({
    message: `查看热门文章：${articleId}`,
    type: 'success'
  })
}



// 时间格式的转变
const formatTime = (timeString) => {
  return new Date(timeString).toLocaleString()
}

// 获取 首页博客 方法
const getBlogPage=async ()=>{
  if(type.value==="0"){
    const response=await axios.get("http://localhost:8080/myBlog/user/blog/getBlogList",{
      params:{
        pageNow: currentPage.value
      }
    })
    if(response.data.code===200){
      articles.value=response.data.data.pageList
      total.value=response.data.data.total
      pageSize.value=response.data.data.pageSize
      currentPage.value=response.data.data.pageNow
    }
  }else{
    const response=await axios.get("http://localhost:8080/myBlog/user/blog/getBlogList",{
      params:{
        pageNow: currentPage.value,
        type: type.value
      }
    })
    if(response.data.code===200){
      articles.value=response.data.data.pageList
      total.value=response.data.data.total
      pageSize.value=response.data.data.pageSize
      currentPage.value=response.data.data.pageNow
    }
  }
}

// 页面加载时的初始操作
onMounted(() => {
  getBlogPage()

  ElMessage({
    message: '博客首页加载成功',
    type: 'success'
  })
})
</script>

<style scoped>
.blog-container {
  display: flex;
  height: 85vh;
  overflow: hidden;
}

.article-item {
  transition: all 0.3s ease;
  height: 120px;
  overflow: hidden;
}

.article-item:hover {
  transform: translateY(-5px);
}

.category-menu {
  border-right: 1px solid #ebeef5;
}

.article-item .title {
  margin-top: -10px;
  margin-bottom: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.article-item .summary {
  margin-top: 5px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.left-block{
  margin-left: 200px;
}

.middle-block{
  width: 1200px;
}
.right-block{
  margin-left: 10px;
}

.artclass{
  display: inline-block;
  margin-right: 20px;
}

.artclassTwo{
  display: inline-block;
  float: right;
  right: 0;
}
</style>
