
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus' // 导入总的组件库
import 'element-plus/dist/index.css' // 导入样式
import '@/common/css/index.css'
import router from './router/router.js'
// 导入免费图标库
import { library } from '@fortawesome/fontawesome-svg-core'
import {faBookOpen, faHistory, faPen, fas} from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 4. 将图标添加到 library 中（注册可用图标）
library.add( fas, far, fab, faBookOpen,  faHistory, faPen)

createApp(App).use(ElementPlus).use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
