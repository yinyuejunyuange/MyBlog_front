
<template>
  <div class="container">
    <el-card class="blog-post" :body-style="{ padding: '20px' }">
      <h1>{{ post.title }}</h1>
      <!--    <p class="date">{{ formattedDate }}</p>-->

      <div class="items-in-list">
        <div class="text-sm text-gray-500 space-x-2">
          <div >
            <el-icon class="icon-class" ><View/></el-icon>
            <span class="icon-span">{{ post.watch }}</span>
            <el-icon class="icon-class"
                      :style="{color:post.isUserStar? '#1E90FF': 'gray'}"
                      @click="StarBlog"><StarFilled /></el-icon>
            <span class="icon-span">{{ post.star }}</span>
            <el-icon class="icon-class"
                      @click="changeCommentDrawer"><ChatSquare /></el-icon>
            <span class="icon-span">{{ post.commentNum }}</span>
            <el-icon class="icon-class"
                     :style="{color: post.isUserKudos? '#1E90FF': 'gray'}"
                     @click="kudosBlog"><Pointer /></el-icon>
            <span class="icon-span">{{ post.kudos }}</span>
          </div>
        </div>
      </div>
      <div class="types">
        <h4>博客类型</h4>
        <button
            class="but1"
            v-for="(type, index) in typeNames"
            :key="index"
            :class="{ active: activeType === type.value }"
            @click="toggleType(type.value)"
        >{{  type.name}}</button>
      </div>
      <div class="contextClass">
        <div v-html="post.context"></div>
      </div>
    </el-card>

    <el-drawer
        title="评论列表"
        v-model="showCommentDrawer"
        direction="rtl"
        size="30%"
    >
      <template #default> <!--没有# 后面的东西 就没法显示-->
        <div v-if="comments!=null" >
          <div v-for="(comment, index) in comments" :key="index" class="comment-item">
            <span class="user-info">
              <img :src=comment.userImage alt="User Avatar" class="avatar" />
              {{ comment.userName }}
              <span>{{formatTime(comment.updateTime)}}</span>

            </span>
            <div class="context" >
              {{ comment.context }}
            </div>
            <div class="action-buttons">
              <span class="icons">
                 <el-icon class="icon-comment"
                          :style="{color: comment.isUserKudos?'#1E90FF': 'gray'}"
                          @click="kudosComment(comment)"><Pointer /></el-icon>
                <span class="comment-kudos">{{ comment.kudos }}</span>
                <span @click="replyClick(index)">
                  <el-icon icon-comment ><ChatDotSquare /></el-icon>
                <span class="comment-kudos"
                >{{ comment.replyList.length }}</span>
                </span>
              <span
                  class="icon-reply"
                  @click="toggleReplyInput(index)">回复</span>
              </span>
            </div>
            <div v-if="replyIndex===index">
              <el-input class="textarea-reply"
                        type="textarea"
                        v-model="commentReply"
                        placeholder="请输入回复内容"
                        :autosize="{minRows:3,maxRows:8}"></el-input>
<!--              <textarea class="textarea-reply" ></textarea>-->
              <el-button @click="submitReply(comment)">提交回复</el-button>
            </div>

            <div v-if="replyListIndex===index&&comment.replyList.length>0">
              <div v-for="(reply, index) in comment.replyList" :key="index" class="reply-item">
                <span class="user-info">
              <img :src=reply.userImage alt="User Avatar" class="avatar" />
              {{ reply.userName }}
              <span>{{formatTime(reply.updateTime)}}</span>

            </span>
                <div class="context" >
                  {{ reply.context }}
                </div>
                <div class="action-buttons">
                  <span class="icons">
                    <el-icon class="icon-comment"
                          :style="{color: reply.isUserKudos?'#1E90FF':'gray'}"
                          @click="kudosReply(reply)"><Pointer /></el-icon>
                    <span class="comment-kudos">{{ reply.kudos }}</span>
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div v-else>
          暂无评论
        </div>

      </template>
      <template #footer>
        <el-input v-model="newComment" placeholder="请输入评论内容" />
        <el-button @click="submitComment">发布评论</el-button>
      </template>
    </el-drawer>

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



const showCommentDrawer = ref(false);
const comments = ref([])

const newComment = ref('')

const commentReply=ref('')
const post=ref({
  id:'',
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

    console.log(parse)

    // 向后端查询所有评论
    try {
      const response = await axios.get('http://localhost:8080/myBlog/user/blog/getComment', {
        params: {
          blogId: parse.id
        },
        headers: {
          token: localStorage.getItem('token')
        }
      })
      comments.value = response.data.data // 假设后端返回的数据结构中有 data 字段存储评论列表

      //ElMessage.success(response.data.data)
    } catch (error) {
      ElMessage.error('获取评论失败')
    }

  }else{
    ElMessage.error()
  }

  // await axios.get('http://localhost:8080/myBlog/user/blog/read',{
  //   params:{
  //    //id:'1893581843467694082'
  //     id:'1893845854478217218'
  //   }
  // }).then(res=>{
  //   if(res.data.code===200){
  //     ElMessage.success(res.data.msg)
  //     post.value.title=res.data.data.title
  //     post.value.context=res.data.data.context
  //     post.value.typeList=res.data.data.typeList
  //
  //     console.log(post)
  //   }
  // })
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



</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中 */
  padding-left: 400px; /* 添加一些内边距 */
  padding-right: 400px; /* 添加一些内边距 */
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

</style>
