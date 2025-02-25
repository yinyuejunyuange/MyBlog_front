
<template>

  <div class="container">
    <div class="title_work">
      <h2>标题</h2>
      <input class="input-title" v-model="title" type="text" placeholder="输入标题">

      <h3>简介</h3>
      <textarea class="textarea-intro" v-model="introduce" placeholder="输入简介 可以更快的让大家看到你的作品"></textarea>
    </div>

    <div>
      <h3>选择您的博客类型</h3>
      <button
          class="but1"
          v-for="(type, index) in typeLists"
          :key="index"
          :class="{ 'active': typeList.includes(type.value) }"
          @click="toggleType(type.value)"
      >{{ type.name }}</button>
    </div>

    <div style="border: 1px solid #ccc" class="editor" >
      <h3>正文</h3>
      <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          :mode="mode"
      />
      <Editor
          style="height: 500px; overflow-y: hidden;"
          v-model="valueHtml"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="handleCreated"
      />
    </div>
    <div>
      <button @click="clickButton">展示</button>
      <div>{{context}}</div>
    </div>

    <div>
<!--      <button @click="submitBlog">保存</button>-->
      <el-button @click="submitBlog">保存</el-button>
    </div>

    <div v-html="context"></div>
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { ElButton, ElInput } from 'element-plus'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import axios from 'axios';






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

const typeList=ref([

])

const blog=ref({
  title:'',
  context:'',
  introduce:'',
  userId:1,
  status:1,
  typeList:[]
})

// 编辑器实例 用shallowRdf
const editorRef = shallowRef()

// 内容html
const valueHtml = ref('<p>hello</p>')

const title=ref('')

const introduce=ref('')

const context=ref('')

const toolbarConfig = {}
const editorConfig = {placeholder:'输入内容', MENU_CONF: {}}

// 配置上传图片的地址与信息
editorConfig.MENU_CONF['uploadImage'] = {
  server: 'http://localhost:8080/myBlog/user/blog/file/upload',
  fieldName: 'image',// 对应后端的参数
  // 继续写其他配置...
  base64LimitSize: 5*1024
  // 小于5kb的图片 就直接用base64的格式去存储 而不是传递给后端
}

function clickButton(){
  context.value=valueHtml.value
}

const submitBlog=async()=>{
  blog.value.title=title.value
  blog.value.context=valueHtml.value
  blog.value.typeList=typeList.value
  blog.value.introduce=introduce.value

  console.log(blog.value)

  const response=await axios.post("http://localhost:8080/myBlog/user/blog/write",blog.value);
  if(response.code===200){
    this.message.info(response.msg)
  }

}



// 切换选中的类型
const toggleType = (value) => {
  const index = typeList.value.indexOf(value);
  if (index === -1) {
    typeList.value.push(value); // 添加类型
    console.log(typeList)
  } else {
    typeList.value.splice(index, 1); // 移除类型
    console.log(typeList)
  }
}

// 组件销毁 销毁编辑器
onBeforeUnmount(() => {
  const editor=editorRef.value
  if(editor==null) return
  editor.destroy()
})

const handleCreated = (editor)=>{
  editorRef.value=editor
}

const mode=ref('default')

</script>

<style scoped >

  .container {
    display: flex;
    flex-direction: column;
    justify-content: center; /* 垂直居中 */
    padding-left: 200px; /* 添加一些内边距 */
    padding-right: 200px; /* 添加一些内边距 */
  }

  .editor{

  }

  .title_work input, .title_work textarea {
    width: 100% ; /* 设置宽度为 100% */
    max-width: 800px; /* 设置最大宽度 */
    margin-bottom: 16px; /* 添加下边距 */
  }

  .input-title{
    height: 20px;
  }

  .title_work textarea {
    height: 100px; /* 设置文本区域的高度 */
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
</style>
