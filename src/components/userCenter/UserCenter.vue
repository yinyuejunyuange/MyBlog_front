
<template>
  <div class="container">
    <div class="card-group">
      <el-card class="author-info">
        <!--      <img :src="" alt="Author Avatar" class="author-avatar" />-->
        <el-card>
           <span class="user-info">
              <img :src=author.userImage alt="User Avatar" class="avatar" />
              {{ author.username }}
            </span>
          <p>注册时间: {{ formatTime(author.createTime) }}</p>
          <p>总博客数: {{ author.blogNum }}</p>
          <p>总访问量: {{ author.visibleNum }}</p>
          <p>总点赞数: {{ author.kudosNum }}</p>
          <p>总粉丝数: {{ author.starNum }}</p>

        </el-card>

      </el-card>

      <el-card class="blog-post" :body-style="{ padding: '20px' }">

      </el-card>

    </div>
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { View ,StarFilled ,ChatSquare ,Pointer,ChatDotSquare} from '@element-plus/icons-vue'

import { onBeforeUnmount, ref, shallowRef, onMounted ,computed} from 'vue'
import { ElButton, ElInput ,ElMessage} from 'element-plus'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import axios from 'axios';

import router from "@/router/router.js";
import { useRoute } from 'vue-router';


const author=ref({
  id:'',
  username:'',
  userImage:'',
  createTime:'',
  introduction:'',
  blogNum:0,
  visibleNum:0,
  starNum:0,
  kudosNum:0,
  isUserStar:ref(false)
})

const showCommentDrawer = ref(false);
const comments = ref([])

const newComment = ref('')

const commentReply=ref('')
const post=ref({
  id:'',
  userId:'',
  title:'',
  Introduce:'',
  context:'',
  typeList:[],
  createTime:'',
  updateTime:'',
  star:'',
  kudos:'',
  watch:'',
  commentNum:'',
  isUserKudos: false,
  isUserStar: false
})

const typeLists=ref([
  {name:'后端',value:'AFTER_END'},
  {name:'前端',value:'BEFORE_END'},
  {name:'java',value:"JAVA"},
  {name:'c++',value:'C11'},
  {name:'C语言',value:'C'},
  {name:'python',value:'PYTHON'},
  {name:'go语言',value:'GOLANG'},
  {name:'vue',value:'VUE'},
  {name:'html',value:'HTML'},
  {name:'css',value:'CSS'},
  {name:'javascript',value:'JAVASCRIPT'},
  {name:'计算机',value:'COMPUTER'},
  {name:'操作系统',value:'OS'},
])

// 新增的状态变量，用于跟踪当前活动的按钮索引
const activeType = ref(null);

const replyIndex=ref(-1)

const replyListIndex=ref(-1) // 回复列表

const typeNames = computed(() => {
  if(post.value.typeList!==undefined){
    return typeLists.value.filter(type => post.value.typeList.includes(type.value));
  }

  return null;
});

const current=ref(1)
const total=ref()
const pageSize=ref(6)

const blogs=ref([])
const typeBlogs=ref([])

onMounted(async ()=>{
  const route = useRoute();
  // 首先尝试从路由参数中获取
  if (route.query.post) {
    //post.value = route.query.post

    const parse = JSON.parse(route.query.post);

    post.value.id=parse.id
    post.value.title=parse.title;
    post.value.context=parse.context;
    post.value.typeList=parse.typeList;
    post.value.Introduce=parse.introduce;
    post.value.createTime=parse.createTime;
    post.value.updateTime=parse.updateTime
    post.value.star=parse.star;
    post.value.kudos=parse.kudos;
    post.value.commentNum=parse.commentNum;
    post.value.watch=parse.watch;
    post.value.isUserKudos=parse.isUserKudos;
    post.value.isUserStar=parse.isUserStar;
    post.value.userId=parse.userId

    console.log(parse)

    // 向后端查询所有评论
    try {
      if(localStorage.getItem("token")!==null){
        const response = await axios.get('http://localhost:8080/myBlog/user/blog/getComment', {
          params: {
            blogId: parse.id
          },
          headers: {
            token: localStorage.getItem('token')
          }
        })
        comments.value = response.data.data // 假设后端返回的数据结构中有 data 字段存储评论列表
      }else{
        const response = await axios.get('http://localhost:8080/myBlog/user/blog/getComment', {
          params: {
            blogId: parse.id
          },
        })
        comments.value = response.data.data // 假设后端返回的数据结构中有 data 字段存储评论列表

      }
      //ElMessage.success(response.data.data)
    } catch (error) {
      ElMessage.error('获取评论失败')
    }

  }else{
    ElMessage.error()
  }

  // 通过userId 获取作者信息

  if(localStorage.getItem("token")!==null){
    const response=await axios.get('http://localhost:8080/myBlog/user/getBlogUserInfo',{
      params:{
        userId:post.value.userId
      },
      headers:{
        token:localStorage.getItem('token')
      }
    })

    if(response.data.code===200){
      author.value.id=response.data.data.userId
      author.value.username=response.data.data.userName
      author.value.userImage=response.data.data.imageUrl
      author.value.createTime=response.data.data.createTime
      author.value.introduction=response.data.data.introduction
      author.value.blogNum=response.data.data.blogNum
      author.value.visibleNum=response.data.data.visitedNum
      author.value.starNum=response.data.data.starNum
      author.value.isUserStar=response.data.data.isUserStar
      author.value.kudosNum=response.data.data.kudosNum
    }

    // 查询此作者的作品
    const blogResponse=await axios.get('http://localhost:8080/myBlog/user/blog/getBlogByUserId',{
      params:{
        userId:post.value.userId,
        current:current.value
      }
    })

    if(blogResponse.data.code===200){

      total.value=blogResponse.data.data.total
      blogs.value=blogResponse.data.data.pageList
    }

    console.info(blogs.value)



  }else{
    const response=await axios.get('http://localhost:8080/myBlog/user/getBlogUserInfo',{
      params:{
        userId:post.value.userId
      }
    })

    if(response.data.code===200){
      author.value.id=response.data.data.userId
      author.value.username=response.data.data.userName
      author.value.userImage=response.data.data.imageUrl
      author.value.createTime=response.data.data.createTime
      author.value.introduction=response.data.data.introduction
      author.value.blogNum=response.data.data.blogNum
      author.value.visibleNum=response.data.data.visitedNum
      author.value.starNum=response.data.data.starNum
      author.value.isUserStar=response.data.data.isUserStar
      author.value.kudosNum=response.data.data.kudosNum
    }
    // 查询此作者的作品
    const blogResponse=await axios.get('http://localhost:8080/myBlog/user/blog/getBlogByUserId',{
      params:{
        userId:post.value.userId,
        current:current.value
      }
    })

    if(blogResponse.data.code===200){
      current.value=blogResponse.data.date.pageNow
      total.value=blogResponse.data.data.total
      blogs.value=blogResponse.data.data.pageList
    }
  }


  const blogResponse=await axios.get('http://localhost:8080/myBlog/user/blog/getBlogByTypeList',{
    params:{
      typeList:post.value.typeList.join(','),
      current:current.value
    }
  })

  if(blogResponse.data.code===200){

    typeBlogs.value=blogResponse.data.data.pageList
  }




})

const toggleType = (value) => {
  activeType.value = value; // 设置当前活动类型
};

const kudosBlog=async ()=>{

  if(post.value.isUserKudos){
    // 如果用户点了赞 就取消点赞
    if(localStorage.getItem("token")===null){
      ElMessage.warning("出现错误请重新登录")
    }else{
      ElMessage.warning(post.value.id)

      const response=await axios.put("http://localhost:8080/myBlog/user/blog/cancelKudos",null,{
        params:{
          blogId:post.value.id
        },
        headers:{
          token: localStorage.getItem("token")
        }
      })

      if(response.data.code===200){
        post.value.isUserKudos=false;
        post.value.kudos--;
      }
    }
  }else{
    // 反之 就点赞
    if(localStorage.getItem("token")===null){
      ElMessage.warning("登录后体验完整功能")
    }else{
      ElMessage.warning(post.value.id)

      const response=await axios.put("http://localhost:8080/myBlog/user/blog//kudos",null,{
        params:{
          blogId:post.value.id
        },
        headers:{
          token: localStorage.getItem("token")
        }
      })

      if(response.data.code===200){
        post.value.isUserKudos=true;
        post.value.kudos++;
      }
    }
  }
}

const StarBlog=async ()=>{

  if(post.value.isUserStar){
    // 如果用户点了赞 就取消点赞
    if(localStorage.getItem("token")===null){
      ElMessage.warning("出现错误请重新登录")
    }else{
      ElMessage.warning(post.value.id)

      const response=await axios.put("http://localhost:8080/myBlog/user/blog/cancelStar",null,{
        params:{
          blogId:post.value.id
        },
        headers:{
          token: localStorage.getItem("token")
        }
      })

      if(response.data.code===200){
        post.value.isUserStar=false;
        post.value.star--;
      }
    }
  }else{
    // 反之 就点赞
    if(localStorage.getItem("token")===null){
      ElMessage.warning("登录后体验完整功能")
    }else{
      ElMessage.warning(post.value.id)

      const response=await axios.put("http://localhost:8080/myBlog/user/blog/userStar",null,{
        params:{
          blogId:post.value.id
        },
        headers:{
          token: localStorage.getItem("token")
        }
      })

      if(response.data.code===200){
        post.value.isUserStar=true;
        post.value.star++;
      }
    }
  }
}
const submitComment = async () => {
  if (newComment.value.trim() === '') {
    ElMessage.warning('请输入评论内容')
    return
  }
  try {
    const response = await axios.post('http://localhost:8080/myBlog/user/blog/addComment', {
      blogId: post.value.id,
      context: newComment.value
    }, {
      headers: {
        token: localStorage.getItem('token')
      }
    })
    if (response.data.code === 200) {
      ElMessage.success('评论发布成功')
      comments.value.push({
        context: newComment.value ,
        replyList:[],
        userId:localStorage.getItem("userId"),
        userImage:localStorage.getItem("headImage"),
        userName:localStorage.getItem("userName"),
        kudos:0,
        isUserStar:false,
        id:response.data.data
      })
      newComment.value = ''
      post.value.commentNum++
    } else {
      ElMessage.error('评论发布失败')
    }
  } catch (error) {
    ElMessage.error('评论发布失败')
  }
}

const changeCommentDrawer =() => {
  showCommentDrawer.value = !showCommentDrawer.value;
  console.info(comments.value)

}

const toggleReplyInput=(index)=>{
  commentReply.value=''
  if(replyIndex.value===index){
    replyIndex.value=-1
  }else{
    replyIndex.value=index
  }

}

// 时间格式的转变
const formatTime = (timeString) => {
  return new Date(timeString).toLocaleString()
}

const replyClick=(index)=>{
  ElMessage.info(index)
  if(replyListIndex.value===index){
    replyListIndex.value=-1
  }else{
    replyListIndex.value=index
  }
}

// 回复评论
const submitReply=async (comment)=>{
  if(localStorage.getItem("token")===null){
    ElMessage.warning("登录后体验完整功能")
  }else{
    if (commentReply.value.trim() === '') {
      ElMessage.warning('请输入评论内容')
      return
    }

    ElMessage.warning(comment.id)

    const response=await axios.post('http://localhost:8080/myBlog/user/blog/replyComment',{
      commentId: comment.id,
      context: commentReply.value
    },{
      headers: {
        token: localStorage.getItem('token')
      }
    })

    if (response.data.code === 200) {
      ElMessage.success('回复发布成功')
      comment.replyList.push({
        context: commentReply.value ,
        userId:localStorage.getItem("userId"),
        userImage:localStorage.getItem("headImage"),
        userName:localStorage.getItem("userName"),
        isUserKudos:false,
        kudos:0,
        id:response.data.data
      })
      commentReply.value = ''
      post.value.commentNum++
    } else {
      ElMessage.error('评论发布失败')
    }
  }
}

const kudosComment=async (comment)=>{

  if(comment.isUserKudos){
    // 如果用户点了赞 就取消点赞
    if(localStorage.getItem("token")===null){
      ElMessage.warning("出现错误请重新登录")
    }else{
      ElMessage.warning(post.value.id)

      const response=await axios.get("http://localhost:8080/myBlog/user/blog/kudosComment",{
        params:{
          commentId:comment.id,
          bytes:2
        },
        headers:{
          token: localStorage.getItem("token")
        }
      })

      if(response.data.code===200){
        comment.isUserKudos=false;
        comment.kudos --;
      }
    }
  }else{
    // 反之 就点赞
    if(localStorage.getItem("token")===null){
      ElMessage.warning("登录后体验完整功能")
    }else{
      ElMessage.warning(post.value.id)

      const response=await axios.get("http://localhost:8080/myBlog/user/blog/kudosComment",{
        params:{
          commentId:comment.id,
          bytes:1
        },
        headers:{
          token: localStorage.getItem("token")
        }
      })

      if(response.data.code===200){
        comment.isUserKudos=true;
        comment.kudos ++;
      }
    }
  }
}

const kudosReply=async (reply)=>{

  if(reply.isUserKudos){
    // 如果用户点了赞 就取消点赞
    if(localStorage.getItem("token")===null){
      ElMessage.warning("出现错误请重新登录")
    }else{
      ElMessage.warning(post.value.id)

      const response=await axios.get("http://localhost:8080/myBlog/user/blog/kudosReply",{
        params:{
          replyId:reply.id,
          bytes:2
        },
        headers:{
          token: localStorage.getItem("token")
        }
      })

      if(response.data.code===200){
        reply.isUserKudos=false;
        reply.kudos --;
      }
    }
  }else{
    // 反之 就点赞
    if(localStorage.getItem("token")===null){
      ElMessage.warning("登录后体验完整功能")
    }else{
      ElMessage.warning(post.value.id)

      const response=await axios.get("http://localhost:8080/myBlog/user/blog/kudosReply",{
        params:{
          replyId:reply.id,
          bytes:1
        },
        headers:{
          token: localStorage.getItem("token")
        }
      })

      if(response.data.code===200){
        reply.isUserKudos=true;
        reply.kudos ++;
      }
    }
  }
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
      window.location.reload()

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
      window.location.reload()
    }
  }
}

const statBlogAuthor=async ()=>{

  if(localStorage.getItem('token')===null){
    ElMessage.warning("登陆后体验完整功能")
  }else{

    const response=await axios.put('http://localhost:8080/myBlog/user/starBlogAuthor',null,{
      params:{
        authorId:author.value.id
      },
      headers:{
        token:localStorage.getItem("token")
      }
    })

    if(response===200){
      author.value.isUserStar=true;
      author.value.kudosNum++;
    }
  }
}

const cancelStatBlogAuthor=async ()=>{
  const response=await axios.put('http://localhost:8080/myBlog/user/cancelStarBlogAuthor',null,{
    params:{
      authorId:author.value.id
    },
    headers:{
      token:localStorage.getItem("token")
    }
  })

  if(response===200){
    author.value.isUserStar=false;
    author.value.kudosNum--;
  }
}


</script>


<style scoped>

.container {
  display: inline-block;
  flex-direction: column;
  justify-content: center; /* 垂直居中 */

}



.but1 {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

.but1.active {
  background-color: blue; /* 蓝色 */
  color: white; /* 按钮文字颜色 */
}

.types h4{
  color: #9c9999;
}

.contextClass{
  margin: 10px;
  border: #9c9999 solid 1px;
}

.contextClass div{
  margin: 10px;
}

.artclass{
  margin-right: 10px;
}

.icon-class{
  font-size:20px;

}

.icon-span{
  font-size: 20px;
  margin-right: 30px;
}

.comment-item {
  margin-bottom: 30px;
  word-break:normal;
  width:auto;
  display:block;
  white-space:pre-wrap;
  word-wrap : break-word ;
  overflow: hidden ;
}

.reply-item{
  margin-bottom: 30px;
  word-break:normal;
  width:auto;
  display:block;
  white-space:pre-wrap;
  word-wrap : break-word ;
  overflow: hidden ;
  margin-left: 40px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
  object-fit: cover;
}
.context{
  margin-top: 10px;
  margin-left: 40px;
}
.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-info span{
  margin-left: 40px;
}

.icon-comment{

  font-size:20px;

}

.comment-kudos{
  margin-right: 40px;
}

.icon-comment span{
  display: inline-block;
  margin-left: 5px;
  font-size:20px;
}

.icon-reply{
  font-size:15px;
  margin-right: 40px;
  color: #636161;
}

.icon-reply span{
  display: inline-block;
  margin-left: 5px;
  font-size:20px;
}

.icons{
  display: flex;
  align-items: center;
  cursor: pointer;
}
.textarea-reply{
  width:500px;
  margin-top: 10px;
  margin-bottom: 10px;

}

.author-info {
  width: 250px; /* 设置作者信息框宽度 */
  margin-right: 20px; /* 添加右边距 */
  margin-left: 100px;
  padding: 20px;
  border: 1px solid #ccc; /* 添加边框 */
  border-radius: 8px; /* 圆角 */
  background-color: #f9f9f9; /* 背景色 */
  height: 100%;
;
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.author-info h3 {
  margin: 10px 0;
}

.author-info p {
  margin: 5px 0;
}

.blog-post{
  width:1000px
}

.card-group{
  display: flex;
  gap: 20px
}

.blogList{
  margin-top: 50px;
}

.title{
  text-overflow:ellipsis;/*超出部分省略号表示*/
  overflow:hidden;/*超出部分隐藏*/
}
.same-blog{
  width: 300px;
  height: 100%;

}

</style>
