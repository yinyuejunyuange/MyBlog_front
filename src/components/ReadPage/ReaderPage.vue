
<template>
  <div class="container">
    <el-card class="blog-post" :body-style="{ padding: '20px' }">
      <h1>{{ post.title }}</h1>
      <!--    <p class="date">{{ formattedDate }}</p>-->

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
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted ,computed} from 'vue'
import { ElButton, ElInput ,ElMessage} from 'element-plus'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import axios from 'axios';

const post=ref({
  title:'',
  Introduce:'',
  context:'',
  typeList:[],
  createTime:'',
  updateTime:''
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

const typeNames = computed(() => {
  return typeLists.value.filter(type => post.value.typeList.includes(type.value));
});



onMounted(async ()=>{
  await axios.get('http://localhost:8080/myBlog/user/blog/read',{
    params:{
     //id:'1893581843467694082'
      id:'1893845854478217218'
    }
  }).then(res=>{
    if(res.data.code===200){
      ElMessage.success(res.data.msg)
      post.value.title=res.data.data.title
      post.value.context=res.data.data.context
      post.value.typeList=res.data.data.typeList

      console.log(post)
    }
  })
})

const toggleType = (value) => {
  activeType.value = value; // 设置当前活动类型
};



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
</style>
