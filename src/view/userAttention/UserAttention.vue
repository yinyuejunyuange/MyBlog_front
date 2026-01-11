
<template>
  <div>

    <div v-if="articles.length===0">
      <h2
      :style="{color:'gray'}"> 暂无关注</h2>
    </div>

    <el-card
        v-for="article in articles"
        :key="article.id"
        class="article-item"
        shadow="hover"
        @click="readArticle(article.id)"
    >
      <div class="flex flex-col">
        <span class="user-info">
            <img :src="article.imageUrl" alt="User Avatar" class="avatar" />
            {{ article.userName }}
          </span>
        <div class="items-in-list">
          <div class="text-sm text-gray-500 space-x-2">

            <div class="artclass">
              <el-tag type="success">Star: {{ article.starNum }}</el-tag>
              <el-tag type="info">Kudos: {{ article.kudos }}</el-tag>
            </div>

            <div class="artclassTwo">
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios   from "axios";
import router from "@/router/router.js";

const articles=ref([])
const current=ref(1)
const total=ref()
const pageSize=ref(6)

// 时间格式的转变
const formatTime = (timeString) => {
  return new Date(timeString).toLocaleString()
}

const getStarBlog =async ()=>{
  if(localStorage.getItem("token")===null){
    ElMessage.warning("登录后体验完整功能")
    return
  }

  console.info(localStorage.getItem("userId")+123123)

  const response=await axios.get("http://localhost:8080/myBlog/user/blog/getUserStarAuthor",{
    params:{
      userId: localStorage.getItem('userId'),
      current:current.value
    },
    headers:{
      token:localStorage.getItem("token")
    }
  })
  if(response.data.code===200){
    if(response.data.data.pageList===null){
      articles.value=null
    }else{
      articles.value = response.data.data.pageList
    }
    total.value=response.data.data.total
    pageSize.value=response.data.data.pageSize
    current.value=response.data.data.pageNow
  }
}

onMounted(()=>{
  getStarBlog()
})


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
}

// 处理分页变化
const handlePageChange = (currentPages) => {


  current.value=currentPages

  ElMessage({
    message: `切换到第 ${currentPages} 页`,
    type: 'success'
  })
  // 这里可以添加获取新页面文章的逻辑
  getStarBlog()
}

</script>

<style scoped>

.article-item {
  transition: all 0.3s ease;
  height: 100%;
  overflow: hidden;
}

.article-item:hover {
  transform: translateY(-5px);
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

.artclass{
  display: inline-block;
  margin-right: 20px;
}

.artclassTwo{
  display: inline-block;
  float: right;
  right: 0;
}
.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

</style>
