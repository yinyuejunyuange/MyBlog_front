<template>
  <!-- 外层 Grid 容器：分为两行，第一行分类栏，第二行博客列表+热门排行 -->
  <div class="home_container">
    <div class="home-section">
      <div class="type-btn">
        <typeScroll/>
      </div>
    </div>


    <!-- 第二行左侧：博客列表（跨9列 = 12列的3/4） -->
    <div class="theme-container" >
      <div class="left-container">
        <div class="article-container" >
          <!-- 博客列表区域 -->
          <div class="articles-list" >
            <div class="article-item">
              <div class="articles-title">
                <h2 style="margin-bottom: 0" >精选博客</h2>
              </div>

            </div>

            <div
                class="article-item"
                v-for="article in articles"
                :key="article.id"
                @click="readArticle(article.id)"
            >
              <div >
                <h4 class = article-title>{{ article.title }}</h4>
                <p class="article-intro" >{{ article.introduce }}</p>
                <div >
                  <div >
                    <div class = "other-info">
                      <el-tag size="small" type="warning"><font-awesome-icon icon="far fa-eye" />阅读: {{ article.watch }}</el-tag>
                      <el-tag size="small" type="success"> <font-awesome-icon icon="far fa-star" />收藏: {{ article.star }}</el-tag>
                      <el-tag size="small" type="info"><font-awesome-icon icon="far fa-heart" />点赞: {{ article.kudos }}</el-tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 第二行右侧：热门文章排行（跨3列 = 12列的1/4） -->
      <div class="right-container">
        <h3 >热门文章排行</h3>
        <div>
          <el-card
              v-for="(article, index) in topArticles"
              :key="article.id"
              shadow="hover"
              @click="readArticle(article.id)"
              border="false"

          >
            <div class="flex items-center gap-3">
              <el-tag
                  :type="index === 0 ? 'danger' : index === 1 ? 'warning' : 'info'"
                  size="small"
              >
                {{ index + 1 }}
              </el-tag>
              <div >
                <h4 >{{ article.title }}</h4>
                <div >
                  <el-icon size="12"><View /></el-icon>
                  <span class="ml-1">{{ article.viewCount }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from "axios";
import router from "@/router/router.js";
import { View } from '@element-plus/icons-vue'  // 补充引入View图标
import { homeBlogs, readBlog } from '@/api/blog.js'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import typeScroll from "./components/typesScroll.vue"
import * as byPrefixAndName from "@fortawesome/free-solid-svg-icons";


// 文章列表数据
const articles = ref([])
// 阅读文章
const readArticle = async (articleId) => {
  await readBlog(articleId).then(res => {
    if (res.data.code === 200) {
      router.push({
        path: '/reader',
        query: {
          post: JSON.stringify(res.data.data)
        }
      })
    }
  })
}

// 热门文章排行
const topArticles = ref([
  { id: 1, title: 'JavaScript高级编程', viewCount: 10086 },
  { id: 2, title: 'React全栈开发', viewCount: 8888 },
  { id: 3, title: 'Node.js实战', viewCount: 6666 }
])

// 时间格式化
const formatTime = (timeString) => {
  if (!timeString) return ''  // 空值处理，避免报错
  return new Date(timeString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取博客列表
const getBlogPage = async () => {
  try {
    const res = await homeBlogs()
    if (res.data.code === 200) {
      articles.value = res.data.data
    }
  } catch (error) {
    ElMessage.error("获取博客列表失败：" + error.message)
  }
}

// 页面挂载初始化
onMounted(async () => {
  try {
    await getBlogPage()
    const response = await axios.get("http://localhost:8080/myBlog/user/blog/getHotBlog", {})
    if (response.data.code === 200) {
      topArticles.value = response.data.data
    }
    ElMessage({
      message: '博客首页加载成功',
      type: 'success'
    })
  } catch (error) {
    ElMessage.error("初始化失败：" + error.message)
  }
})
</script>

<style scoped>

.home_container{
  position: relative;
  top: 80px;
  left: 150px;
  background: #fff;
  display: flex; /*开启FLEX布局*/
  flex-wrap: wrap; /*取消自动换行*/
  width: 100%;
  gap: 0.1rem;
}

.type-btn{
  width: 100%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-section{
  flex: 1;
}

.theme-container{
  display: flex;
  padding-top: 0.5vh;
  background: #f3f2f2;
  border-radius: 15px;
  flex-wrap: nowrap; /* 取消自动换行*/
}

.left-container{
  display: flex;
  flex: 3;
  min-width: 300px;
  justify-content: flex-end;
  border-radius: 15px;
}

.articles-list{
  width: 90%;
  background: #fff;
}
.article-container{
  width: 99%;
  display: flex;
  justify-content: center;
  background: #fff;
  border-radius: 15px;
}
.right-container{
  background: #fff;
  flex: 1;
  min-width: 150px;
  margin-left: 1vh;
  margin-right: 1vh;
  padding-left: 1vh;
  border-radius: 15px;
}
.article-item {
  border-top: 1px solid #ebeef5;
  margin: 0;
  padding: 1.5rem;

}

.article-title{
  margin: 0;
}

.article-intro{
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 只有两行展示 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; /* 省略号 */
  color: #717070;
  margin: 0;
}

.other-info{
  display: flex;
  flex-wrap: nowrap;
  gap: 1rem;
  margin-top: 0.5rem;
}

@media (max-width: 800px) {
  .right-container{
    display: none;
  }
  .home_container{
    left: 50px;
  }
}

</style>
