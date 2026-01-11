<template>
  <div class="navigation" >
    <el-menu
        :default-active="activeMenu"
        class="navbar"
        mode="horizontal"
    >
      <div class="menu-items">
        <el-menu-item index="/home" class="menu-link">
          <router-link to="/home" class="router-logo">书易网</router-link>
        </el-menu-item>
        <!--      <el-menu-item index="/userCenter/userBlogs" class="menu-link">-->
        <!--        <router-link to="/userCenter/userBlogs" class="router-link">用户中心</router-link>-->
        <!--      </el-menu-item>-->
      </div>

      <div class="search-container" id="search">
        <el-input
            v-model="searchQuery"
            placeholder="搜索"
            @focus="showDropdown = true"
            clearable
        />

        <div
            v-if="showDropdown"
            class="showDrop"
        >
          <div  >
            <!-- 历史搜索 左侧 -->
            <div class="search_history ">
              <h3 class="text-gray-600 font-semibold mb-3">历史搜索   <span @click="removeAllSearch" class="remove-history"><el-icon><Delete /></el-icon></span></h3>
              <div style="overflow-y: scroll;max-height: 230px">
                <el-menu class="el-style">
                  <h4 v-if="history.length===0"> 暂无记录 </h4>
                  <el-menu-item
                      v-for="(item, index) in history"
                      :key="index"
                      class="flex items-center justify-between px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer group"
                      @mouseover="hoveredHistoryIndex = index"
                      @mouseleave="hoveredHistoryIndex = -1"
                      @click=" clickHistorySearch(index)"
                  >
                    <span class="text-gray-700">{{ item }}
                    </span>
                    <el-icon
                        v-if="hoveredHistoryIndex === index"
                        class="text-gray-400 hover:text-red-500 transition-colors absolute right-2 top-1/2 transform -translate-y-1/2"
                        @click.stop="removeHistoryItem(index)"
                    >
                      <Close />
                    </el-icon>
                  </el-menu-item>
                </el-menu>
              </div>
            </div>

            <!-- 搜索发现 右侧 -->
            <div class="search_find">
              <h3 class="text-gray-600 font-semibold mb-3">搜索发现</h3>
              <div style="overflow-y: scroll;max-height: 230px">
                <el-menu>
                  <h4 v-if="discover.length===0"> 登录后查看 </h4>
                  <el-menu-item
                      v-for="(item, index) in discover"
                      :key="index"
                      class="search_card"
                      @click="clickDiscoverSearch(index)"
                  >
                    {{item}}
                  </el-menu-item>
                </el-menu>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="search-button">
        <el-button @click="searchBlog">
          <el-icon><Search /></el-icon>
        </el-button>
      </div>

      <div class="user-area">
      <span @mouseover="notificationsVisible = true" @mouseleave="notificationsVisible = false" class="notification-icon">
        公告
        <div v-if="messageCount > 99" class="notification-badge">
          99+
        </div>
        <div v-else-if="messageCount > 0" class="notification-badge">
          {{messageCount}}
        </div>

        <div v-if="notificationsVisible" class="announcement-list"
             @scroll="handleScorll">
          <el-menu v-if="notifications.length>0"
          >
            <el-menu-item
                v-for="(notification, index) in notifications"
                :key="index"
                @click="openAnnouncement(notification)"
            >
            {{ notification.title}}
              <div v-if="!notification.isUserRead" class="notification-item-badge">

              </div>

          </el-menu-item>
          </el-menu>
          <div v-else  class="no_announcement">
            <h1 >暂无公告</h1>
          </div>
        </div>
      </span>


        <template v-if="localToken">
          <el-dropdown>
          <span class="user-info">
            <img :src="headImage" alt="User Avatar" class="avatar" />
            {{ userName }}
          </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <button>一个按钮</button>
                </el-dropdown-item>
                <el-dropdown-item>Settings</el-dropdown-item>
                <el-dropdown-item @click="logout">Logout</el-dropdown-item>
                <el-menu-item index="/editor" class="menu-link">
                  <router-link to="/editor" class="router-link">撰写</router-link>
                </el-menu-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
        <span class="auth-links">
          <a href="#" @click.prevent="openLoginModal">登录</a>
          <span class="separator">|</span>
          <a href="#" @click.prevent="openRegisterModal">注册</a>
        </span>
        </template>
      </div>

      <!-- 公告内容弹窗 -->
      <el-dialog
          v-model="announcementDialogVisible"
          title="公告内容"
          width="500px"
      >
        <div>{{ selectedAnnouncement.content }}</div>
        <el-button @click="announcementDialogVisible = false">关闭</el-button>
      </el-dialog>

      <!-- 登录弹窗 -->
      <el-dialog
          v-model="loginDialogVisible"
          title="登录"
          width="500px"
      >
        <el-form :model="loginForm" label-width="100px">
          <el-form-item label="用户名">
            <el-input v-model="loginForm.username" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="loginForm.password" type="password" />
          </el-form-item>

          <el-form-item label="验证码">
            <div class="verify-code-container">
              <el-input
                  v-model="codeRef"
                  placeholder="请输入验证码"
                  class="verify-code-input"
              />
              <el-image
                  :src="verifyCodeImage"
                  alt="验证码"
                  class="verify-code-image"
                  @click="fetchVerifyCode"
              />
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="login">登录</el-button>
            <el-button @click="switchToRegister">切换到注册</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 注册弹窗 -->
      <el-dialog
          v-model="registerDialogVisible"
          title="注册"
          width="500px"
      >
        <el-form :model="registerForm" label-width="100px">
          <el-form-item label="用户名">
            <el-input v-model="registerForm.username" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="registerForm.password" type="password" />
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input v-model="registerForm.confirmPassword" type="password" />
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="registerForm.sex" placeholder="请选择性别">
              <el-option label="男" value=1></el-option>
              <el-option label="女" value=0></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="registerForm.email"  placeholder="请输入您的个人邮件 当您忘记密码是会用到" />
          </el-form-item>
          <el-form-item label="验证码">
            <div class="verify-code-container">
              <el-input
                  v-model="codeRef"
                  placeholder="请输入验证码"
                  class="verify-code-input"
              />
              <el-image
                  :src="verifyCodeImage"
                  alt="验证码"
                  class="verify-code-image"
                  @click="fetchVerifyCode"
              />
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="register">注册</el-button>
            <el-button @click="switchToLogin">切换到登录</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-menu>
  </div>

</template>


<script setup>
import {onMounted, ref} from 'vue'
import {ElMessage} from 'element-plus'
import {Close, Delete, Search} from '@element-plus/icons-vue'
import axios from 'axios';
import router from "@/router/router.js";
import {getCode, userLogin, userRegister, verifyCode} from "@/api/user/auth.js";
import {RequestHeadItems, X_VERIFY_TOKEN} from "@/utils/headItem/headItem.js"

// 状态管理
const localToken = ref(localStorage.getItem('token'))
const activeMenu = ref('/editor')
const userAvatar = ref('path/to/avatar.jpg')
const userName = ref(localStorage.getItem('userName'))
const codeRef = ref()
const headImage=ref(localStorage.getItem('headImage'))

const notificationsVisible =ref(false)
const notifications=ref([])
const announcementDialogVisible=ref(false)
const selectedAnnouncement=ref({})




const searchQuery = ref('')
const showDropdown = ref(false)
const hoveredHistoryIndex = ref(-1)
const history= ref([])
const discover=ref([])
const searchWord=ref('')
const messageCount=ref(0)

let eventSource = null;
// 登录表单
const loginForm = ref({
  username: '',
  password: ''
})



// 注册表单
const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
  sex: 0,
  email: ''
})

onMounted(async ()=>{
  window.addEventListener('click', handleClick)
  // 绑定全局监听器

  if(localStorage.getItem('token')===null){
    history.value=localStorage.getItem('history')
  }else{
    const historyResponse=await axios.get('http://localhost:8080/myBlog/user/getUserSearch',{
      headers:{
        token:localStorage.getItem('token'),
      }
    })

    if(historyResponse.data.code===200){
      history.value=historyResponse.data.data
    }

    const response=await axios.get('http://localhost:8080/myBlog/user/getHotSearch',{
      headers:{
        token:localStorage.getItem('token'),
      }
    })

    if(response.data.code===200){
      discover.value=response.data.data
    }
  }
  connectToSSE(localStorage.getItem('userId'))

  await getAnnouncement()

})

const openAnnouncement=async (select)=>{
  selectedAnnouncement.value=select
  announcementDialogVisible.value=true

  //todo  实现消除红点
  const response=await axios.put("http://localhost:8080/myBlog/user/readAnnouncement", {}, {
    headers: {
      token: localStorage.getItem('token')
    },
    params: {
      announcementId: select.id
    }
  })

  if(response.data.code===200){
    select.isUserRead=true
    messageCount.value--;
  }else{
    ElMessage.error(response.data.msg)
  }

}

let currentIndex=ref(1)
// 获取公告
const getAnnouncement=async ()=>{
  const response=await axios.get('http://localhost:8080/myBlog/user/getAnnouncement', {
    headers: {
    token: localStorage.getItem('token')
    },
    params:{
      currentIndex:currentIndex.value,
    }
  })

  if(response.data.code===200){
    notifications.value.push(...response.data.data);
  }else{
    ElMessage.error(response.data.msg)
  }

}

const connectToSSE = (userId) => {
  eventSource = new EventSource(`http://localhost:8080/task/sse/connect?userId=${userId}`);

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (typeof data === 'boolean' && data === true) {
    } else {
      // 处理实际数据
      if(messageCount.value !==data){
        messageCount.value = data;
        ElMessage.success(`您有 ${data} 条新公告`)
      }
    }
  };

  eventSource.onerror = (error) => {
    if (retryCount < maxRetries) {
      // 增加重试计数器
      retryCount++;
      // 计算延迟时间，每次重试增加一倍的延迟
      const delay = initialDelay * (2 ** (retryCount - 1));
      setTimeout(() => {
        connectToSSE(userId);
      }, delay);
    } else {
      // 达到最大重连次数，关闭连接
      eventSource.close();
    }
  };
};

const clickHistorySearch=(index)=>{
  const valueElement = history.value[index];
  showDropdown.value=false

  router.push({
    path:'/searchPage',
    query:{
      post: valueElement
    }
  })

}

const clickDiscoverSearch=(index)=>{
  const valueElement = discover.value[index];
  showDropdown.value=false
  router.push({
    path:'/searchPage',
    query:{
      post: valueElement
    }
  })
}

const handleScorll=async (e)=>{
  const {scrollTop,clientHeight,scrollHeight}=e.target

  if(scrollTop+clientHeight===scrollHeight){
    currentIndex.value+=1;
    await getAnnouncement()
  }
}


const handleBlur = () => {
  // 稍微延迟隐藏，让点击事件有机会触发
  showDropdown.value = false
}

const handleClick=(event)=> {

  const div = document.getElementById("search")
  const x=event.clientX
  const y=event.clientY
  const divx1 = div.offsetLeft
  const divy1 = div.offsetTop
  const divx2 = div.offsetLeft + div.offsetWidth
  const divy2 = div.offsetTop + div.offsetHeight
  if( x < divx1 || x > divx2 || y < divy1 || y > divy2){
    handleBlur()
  }

}


const removeHistoryItem = async (index) => {
  if(localStorage.getItem('token')===null){
    history.value.splice(index, 1)
    localStorage.setItem('history',history.value)
  }else{
    const response=await axios.delete('http://localhost:8080/myBlog/user/deleteUserSearchByName',{

      params:{
        name: history.value[index]
      },
      headers:{
        token:localStorage.getItem('token'),
      }
    })

    if(response.data.code===200){
      ElMessage.success("删除成功")
      history.value.splice(index, 1)
    }else{
      ElMessage.error("删除失败")
    }
  }
}

const showAnnouncement= async()=>{
  notificationsVisible.value=true

}

const removeAllSearch= async ()=>{

  if(history.value.length===0){
    ElMessage.warning("无记录可删除")
    return
  }

  if(localStorage.getItem('token')!==null){
    const response=await axios.delete('http://localhost:8080/myBlog/user/deleteUserAllSearch',{
      headers:{
        token:localStorage.getItem('token'),
      }
    })

    if(response.data.code===200){
      ElMessage.success("删除成功")
    }else{
      ElMessage.error("删除失败")
    }
  }else{
    history.value=[];
    localStorage.setItem('history',history.value);
  }
}

// 弹窗控制
const loginDialogVisible = ref(false)
const registerDialogVisible = ref(false)

// 打开登录弹窗
const openLoginModal = () => {
  fetchVerifyCode()
  loginDialogVisible.value = true
  registerDialogVisible.value = false
}

// 打开注册弹窗
const openRegisterModal = () => {
  fetchVerifyCode()
  registerDialogVisible.value = true
  loginDialogVisible.value = false
}

// 切换到登录
const switchToLogin = () => {
  registerDialogVisible.value = false
  loginDialogVisible.value = true
}

// 切换到注册
const switchToRegister = () => {
  loginDialogVisible.value = false
  registerDialogVisible.value = true
}

// 通过关键字搜索博客
const searchBlog= ()=>{

  history.value.push(searchQuery.value)
  localStorage.setItem('history',history.value)

  router.push({
    path:'/searchPage',
    query:{
      post: searchQuery.value
    }
  })
}

// 登录逻辑
const login = async () => {
  // 这里添加实际的登录逻辑
  if(loginForm.value.password===''){
    ElMessage.warning("密码不可为空")
  }else if(loginForm.value.username===''){
    ElMessage.warning("用户名不可为空")
  }else if(codeRef.value===null){
    ElMessage.warning("验证码不可为空")
  }else{
   verifyCode(codeRef.value,verifyToken.value).then(res=>{
     if(res.data.code===200){
       ElMessage.success('验证码验证成功')
       userLogin(loginForm.value).then(res=>{
         if(res.data.code===200){
           localStorage.setItem('token',res.data.data.token);
           ElMessage.success(localStorage.getItem('token'))
           localToken.value=localStorage.getItem('token');
           headImage.value="http://localhost:8080/myBlog/user/getHead/"+res.data.data.imageUrl;
           localStorage.setItem('headImage',headImage.value);
           userName.value=res.data.data.username
           localStorage.setItem('userName',userName.value);
           localStorage.setItem('userId',res.data.data.id)
           loginDialogVisible.value=false
           ElMessage.success("登录成功")
           // location.reload()

         }else{
           ElMessage.error("登录失败")
         }
       })
     }else{
       ElMessage.error("验证码错误")
     }
   })
  }
}

// 注册逻辑
const register = async() => {
  // 这里添加实际的注册逻辑
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    ElMessage.error('两次密码不一致')
    return
  }

  if(registerForm.value.username===''){
    ElMessage.error('用户名不可为空')
    return
  }

  if(registerForm.value.email===''){
    ElMessage.error("邮箱不可为空")
  }else{
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(registerForm.value.email)) {
      ElMessage.error("邮箱格式u不正确");
      return
    }
  }

  userRegister(registerForm.value).then(res=>{
    console.info(res)
    if(res.data.code===200){
      localStorage.setItem('token',res.data.data.token);
      ElMessage.success(localStorage.getItem('token'))
      localToken.value=localStorage.getItem('token');
      // headImage.value="http://localhost:8080/myBlog/user/getHead/"+response.data.data.imageUrl;
      localStorage.setItem('headImage',headImage.value);
      userName.value=res.data.data.username
      localStorage.setItem('userName',userName.value);
      localStorage.setItem('userId',res.data.data.id)
      registerDialogVisible.value=false
      ElMessage.success("注册成功")
    }else{
      ElMessage.error("注册失败")
    }
  })
  // 模拟注册成功
  ElMessage.success('注册成功')
  switchToLogin()
}

const verifyToken = ref('')
const verifyCodeImage = ref(null)
// 获取验证码的方法
const fetchVerifyCode = async () => {
  try {
    getCode().then(res=>{

      const X_token = RequestHeadItems.X_VERIFY_TOKEN
      // 从响应头中获取 verifyToken
      verifyToken.value= res.headers.get(X_token);


      // 创建图片URL
      verifyCodeImage.value = URL.createObjectURL(new Blob([res.data], {type: 'image/jpeg'}))
    })
  } catch (error) {
    ElMessage.error('获取验证码失败')

  }
}


// 登出逻辑
const logout = () => {
  localToken.value = null
  localStorage.removeItem('token')
  ElMessage.success('已退出登录')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  padding: 10px;
}

.menu-items {
  display: flex;
  align-items: center;
}

.router-link {
  text-decoration: none;
  color: blue;
}

.router-logo{
  text-decoration: none;
  color: #5b5bed;
  font-size:30px;
}

.menu-link {
  border-bottom: none !important;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
  object-fit: cover;
}

.auth-links {
  display: flex;
  align-items: center;
}

.auth-links a {
  text-decoration: none;
  color: blue;
  margin: 0 5px;
}

.separator {
  color: #999;
}

:deep(.el-dropdown-menu) {
  min-width: 120px;
}

:deep(.el-dropdown-menu__item) {
  padding: 8px 16px;
}

.verify-code-container {
  display: flex;
  align-items: center;
}

.verify-code-input {
  flex-grow: 1;
  margin-right: 10px;
}

.verify-code-image {
  width: 200px;  /* 根据需要调整宽度 */
  height: 80px;
  cursor: pointer;
  border-radius: 4px;
}

.search-container {
  position: absolute;
  width: 50%; /* 约1/3宽度 */
  margin: 0 1rem;
  top: 15px;
  left: 400px;
}

.showDrop{
  display: flex;
  position: relative; /*// 位置相对于父目录*/
  top:0;
  z-index: 99;
  background: #fff;
  border: #6fb2dd solid 1px;
  height: 300px;

}

.search_find {
  position: absolute;
  top:0;
  left: 480px;
  display: inline-block;
  width: 450px;
}

.search_history{
  position: relative;
  top:0;
  display: inline-block;
  width: 450px;
  margin-left: 15px;
}

.remove-history{
  float: right;
}

h4{
  color: #717171;
}

.search-button{
  position: absolute;
  right: 490px;
}

.notification-icon {
  color: #636161;
  position: relative;
  top:5px;
  right: 50px;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-item-badge {
  height: 8px;
  position: absolute;
  top: -5px;
  right: 0;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.announcement-list {
  position: absolute;
  background: white;
  border: 1px solid #d3d3d3;
  z-index: 1000;
  right: -100px;
  top:18px;
  width: 500px; /* 可以根据需要调整宽度 */
  height: 500px;
  overflow-y: auto; /* 启用垂直滚动 */
}

.no_announcement{
  color: #636161;
  text-align: center; /* 文本水平居中 */
  padding: 10px; /* 添加内边距以增加可读性 */
}

</style>
