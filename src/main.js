
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus' // 导入总的组件库
import 'element-plus/dist/index.css' // 导入样式
import router from './router/router.js'
// 导入免费图标库
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas, far, fab)

createApp(App).use(ElementPlus).use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
