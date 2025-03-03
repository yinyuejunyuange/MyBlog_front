<template>
  <el-menu
      :default-active="activeMenu"
      class="navbar"
      mode="horizontal"
  >

    <div class="menu-items">
      <el-menu-item index="/home" class="menu-link">
        <router-link to="/home" class="router-logo">书易网</router-link>
      </el-menu-item>
      <el-menu-item index="/editor" class="menu-link">
        <router-link to="/editor" class="router-link">撰写</router-link>
      </el-menu-item>
      <el-menu-item index="/reader" class="menu-link">
        <router-link to="/reader" class="router-link">阅读</router-link>
      </el-menu-item>
      <el-menu-item index="/userCenter/userBlogs" class="menu-link">
        <router-link to="/userCenter/userBlogs" class="router-link">用户中心</router-link>
      </el-menu-item>
    </div>

    <div class="user-area">
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
          <el-input v-model="registerForm.sex" type="password" />
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
</template>

<script setup>
import {ref} from 'vue'
import {ElMessage} from 'element-plus'
import axios from 'axios';

import { inject } from 'vue';

// 状态管理
const localToken = ref(localStorage.getItem('token'))
const activeMenu = ref('/editor')
const userAvatar = ref('path/to/avatar.jpg')
const userName = ref(localStorage.getItem('userName'))
const codeRef = ref()
const headImage=ref(localStorage.getItem('headImage'))

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
  sex: '',
  email: ''
})

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
    const checkResponse=await axios.get("http://localhost:8080/myBlog/user/verify/checkCode",{
      params: {
        code: codeRef.value
      },
      headers:{
        'verifyToken': verifyToken.value
      }
    })
    if(checkResponse.data.code===200){
      ElMessage.success('验证码验证成功')

      //ElMessage.success('验证成功')
      const loginResponse=await axios.post("http://localhost:8080/myBlog/user/login",loginForm.value)

      if(loginResponse.data.code===200){
        localStorage.setItem('token',loginResponse.data.data.token);
        ElMessage.success(localStorage.getItem('token'))
        localToken.value=localStorage.getItem('token');
        headImage.value="http://localhost:8080/myBlog/user/getHead/"+loginResponse.data.data.imageUrl;
        localStorage.setItem('headImage',headImage.value);
        userName.value=loginResponse.data.data.username
        localStorage.setItem('userName',userName.value);
        localStorage.setItem('userId',loginResponse.data.data.id)
        loginDialogVisible.value=false
        ElMessage.success("登录成功")
       // location.reload()

      }else{
        ElMessage.error("登录失败")
      }

    }else{
      ElMessage.error("验证码错误")
    }
  }
}

// 注册逻辑
const register = () => {
  // 这里添加实际的注册逻辑
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    ElMessage.error('两次密码不一致')
    return
  }

  // 模拟注册成功
  ElMessage.success('注册成功')
  switchToLogin()
}

const verifyToken = ref('')
const verifyCodeImage = ref(null)
// 获取验证码的方法
const fetchVerifyCode = async () => {
  try {
    const response = await axios.get('http://localhost:8080/myBlog/user/verify/getCode', {
      responseType: 'blob' // 对于图片验证码
    })

    // 从响应头中获取 verifyToken
    verifyToken.value= response.headers['verifytoken'] ||
        response.headers.verifytoken ||
        response.headers.get('verifytoken')

    // ElMessage.success(verifyToken.value)
    // ElMessage.success(response.headers.get('verifytoken'))

    // 创建图片URL
    const imageUrl = URL.createObjectURL(new Blob([response.data], { type: 'image/jpeg' }))
    verifyCodeImage.value = imageUrl
  } catch (error) {
    ElMessage.error('获取验证码失败')
    console.error(error)
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
</style>
