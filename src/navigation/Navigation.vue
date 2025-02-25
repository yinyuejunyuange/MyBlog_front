<template>
  <el-menu
      :default-active="activeMenu"
      class="navbar"
      mode="horizontal"
  >
    <div class="menu-items">
      <el-menu-item index="/editor" class="menu-link">
        <router-link to="/editor" class="router-link">Editor</router-link>
      </el-menu-item>
      <el-menu-item index="/reader" class="menu-link">
        <router-link to="/reader" class="router-link">Reader</router-link>
      </el-menu-item>
    </div>

    <div class="user-area">
      <template v-if="token">
        <el-dropdown>
          <span class="user-info">
            <img :src="userAvatar" alt="User Avatar" class="avatar" />
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
                v-model="VerifyCode"
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
                v-model="VerifyCode"
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios';

// 状态管理
const token = ref(localStorage.getItem('token'))
const activeMenu = ref('/editor')
const userAvatar = ref('path/to/avatar.jpg')
const userName = ref('Username')

// 登录表单
const loginForm = ref({
  username: '',
  password: ''
})

const VerifyCode=ref()

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
const login = () => {
  // 这里添加实际的登录逻辑
  if (loginForm.value.username && loginForm.value.password) {
    // 模拟登录成功
    token.value = 'your-token'
    localStorage.setItem('token', token.value)
    loginDialogVisible.value = false
    ElMessage.success('登录成功')
  } else {
    ElMessage.error('请输入用户名和密码')
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

const verifyToken = ref(null)
const verifyCodeImage = ref(null)
// 获取验证码的方法
const fetchVerifyCode = async () => {
  try {
    const response = await axios.get('http://localhost:8080/myBlog/user/verify/getCode', {
      responseType: 'blob' // 对于图片验证码
    })

    // 从响应头中获取 verifyToken
    const token = response.headers['verifyToken']
    verifyToken.value = token

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
  token.value = null
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
