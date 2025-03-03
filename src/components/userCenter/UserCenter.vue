<template>
  <div class="container">
    <h2 class="userSpace">用户{{userName}}的空间</h2>
    <div class="card-group">
      <el-card class="author-info">
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
          <el-button type="primary" @click="openSettings">设置</el-button> <!-- 设置按钮 -->
        </el-card>

      </el-card>

      <el-card class="blog-post" :body-style="{ padding: '20px' }">
        <el-menu
            default-active="/userCenter/userBlogs"
            class="navbar"
            mode="horizontal"
            router
        >
          <el-menu-item index="/userCenter/userBlogs">
            <span>我的博客</span>
          </el-menu-item>
          <el-menu-item index="/userCenter/userAttention">
            <span>我的关注</span>
          </el-menu-item>
          <el-menu-item index="/userCenter/userStar">
            <span>我的收藏</span>
          </el-menu-item>
        </el-menu>
        <div>
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </div>
      </el-card>
    </div>

    <el-dialog v-model="dialogVisible" title="用户设置">
      <el-form :model="form" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" :error="emailError">
          <el-input v-model="form.email" @blur="validateEmail"></el-input>
        </el-form-item>
        <el-form-item label="用户头像">
          <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :before-upload="beforeUpload"
              @change="handleAvatarChange"
              :headers='uploadHeaders'
          >
            <el-button size="small" type="primary">上传头像</el-button>
          </el-upload>
          <img v-if="avatarUrl" :src="avatarUrl" class="avatar-preview" alt="Avatar Preview" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option label="男" value=1></el-option>
            <el-option label="女" value=0></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input type="textarea" v-model="form.introduce"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSettings">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted ,computed} from 'vue'
import { ElButton, ElInput ,ElMessage} from 'element-plus'
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router' // 添加这行


const dialogVisible = ref(false);
const form = ref({
  username: '',
  email: '',
  sex: 0,
  introduce: '',
});

const avatarUrl = ref('');
let avatarFile = ref(null);

const openSettings = () => {
  dialogVisible.value = true;
};

const emailError = ref('');

const validateEmail = () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(form.value.email)) {
    emailError.value = '请输入有效的邮箱地址';
  } else {
    emailError.value = '';
  }
};

const saveSettings = async () => {

  const formParams={
    userName: form.value.username,
    email: form.value.email,
    sex:form.value.sex,
    introduce:form.value.introduce
  }
  const response=await axios.post("http://localhost:8080/myBlog/user/changeUserInfo",formParams,{
    headers:{
      token:localStorage.getItem('token')
    }
  })

  if(response.data.code===200){
    localStorage.setItem('userName',form.value.username)
    await init()
  }


  dialogVisible.value = false; // 关闭弹窗
};

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    this.$message.error('只能上传图片文件！');
  }
  return isImage;
};

const handleAvatarChange = async (file) => {
  const formData = new FormData();
  formData.append('file', file.raw);
  // 这里可以进一步处理文件上传
  const response=await axios.post("http://localhost:8080/myBlog/user/makeHead",formData,{

    headers:{
      'Content-Type': 'multipart/form-data',
      token: localStorage.getItem("token")
    }
  })

  if(response.data.code===200){
    ElMessage.success("头像上传成功")
    localStorage.setItem('headImage',response.data.data)
    author.value.userImage=response.data.data
  }

  avatarUrl.value = URL.createObjectURL(file.raw); // 预览头像
};

const router = useRouter()
const route = useRoute()

// 添加 activeRoute 计算属性
const activeRoute = ref('')

// 添加路由跳转处理函数
const handleSelect = (path) => {
  activeRoute.value=path
}

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

const userName=ref(localStorage.getItem('userName'))

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

onMounted(async ()=>{
  await init()
})

const init=async ()=>{
  const response=await axios.get('http://localhost:8080/myBlog/user/getBlogUserInfo',{
    params:{
      userId:localStorage.getItem('userId'),
    },
    headers:{
      token:localStorage.getItem('token'),
    }
  })

  if(response.data.code===200){
    author.value.id=response.data.data.id
    author.value.username=response.data.data.userName
    author.value.userImage=response.data.data.imageUrl
    author.value.createTime=response.data.data.createTime
    author.value.introduction=response.data.data.introduction
    author.value.blogNum=response.data.data.blogNum
    author.value.visibleNum=response.data.data.visitedNum
    author.value.starNum=response.data.data.starNum
    author.value.kudosNum=response.data.data.kudosNum
    author.value.isUserStar=response.data.data.isUserStar


  }
}

// 时间格式的转变
const formatTime = (timeString) => {
  return new Date(timeString).toLocaleString()
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

// 设置自定义请求头
const uploadHeaders = computed(() => ({
  'token':localStorage.getItem('token'),
}));

</script>


<style scoped>

.container {
  display: inline-block;
  flex-direction: column;
  justify-content: center; /* 垂直居中 */

}

.types h4{
  color: #9c9999;
}



.contextClass div{
  margin: 10px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
  object-fit: cover;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-info span{
  margin-left: 40px;
}

.icon-comment span{
  display: inline-block;
  margin-left: 5px;
  font-size:20px;
}


.icon-reply span{
  display: inline-block;
  margin-left: 5px;
  font-size:20px;
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
.author-info h3 {
  margin: 10px 0;
}

.author-info p {
  margin: 5px 0;
}

.blog-post{
  width:1300px;
  height: 100%;
}

.card-group{
  display: flex;
  gap: 20px
}

.userSpace{
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */

}

.avatar-preview {
  width: 50px; /* 调整预览头像的大小 */
  height: 50px;
  border-radius: 50%;
  margin-top: 10px;
}
</style>
