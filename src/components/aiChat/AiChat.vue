<template>
  <div id="app">
    <div
        ref="floatingButtonRef"
        class="floating-button"
        @mousedown="startDragging"
        @mouseup="stopDragging"
        :style="{ left: position.x + 'px', top: position.y + 'px' }"
    >
      <el-button type="primary">+</el-button>
    </div>

    <div
        class="side-panel"
        :class="{ 'panel-open': dialogVisible }"
    >
      <div class="panel-header">
        <span>书易AI</span>
              <span v-if="visible" class="dots">waiting {{ dots }}</span>
        <el-button
            type="text"
            class="close-button"
            @click="dialogVisible = false"
        >
          <i class="el-icon-close"></i>
        </el-button>
      </div>
      <div class="panel-content">
        <div
            v-for="(item, index) in chatList"
            :key="index"
            :class="item.role === 'user' ? 'message user' : 'message ai'"
            v-html="md.render(item.context)"
        >
        </div>
        <!--          <span>{{ item.context }}</span>-->


      </div>
      <div class="panel-footer">
        <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="textAreaContent"
            rows="4"
        ></el-input>
        <el-button @click="sendToAi">发送</el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>

      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import axios from 'axios'
import 'animate.css'
import {ElMessage} from "element-plus";
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt();
// var result = md.render('# markdown-it rulezz!'); //传入文本

const dialogVisible = ref(false);
const position = ref({ x: window.innerWidth - 80, y: 200 }); // 设置初始位置在右侧
const position_copy = ref({ x: window.innerWidth - 80, y: 200 });
const floatingButtonRef = ref(null);
const isDragging = ref(false);
const offset = ref({ x: 0, y: 0 });

const toggleDialog = () => {
  dialogVisible.value = !dialogVisible.value;
};

const chatList=ref([])
const textAreaContent=ref('')

let eventSource=null
const aiResponse=ref('')

const startDragging = (event) => {
  isDragging.value = true;
  offset.value.x = event.clientX - position.value.x;
  offset.value.y = event.clientY - position.value.y;

  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDragging);
  event.preventDefault();
};

const drag = (event) => {
  if (isDragging.value) {
    position.value.x = event.clientX - offset.value.x;
    position.value.y = event.clientY - offset.value.y;
  }
};

const stopDragging = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDragging);

  if(position_copy.value.x === position.value.x && position_copy.value.y === position.value.y){
    toggleDialog();
  }

  position_copy.value.x = position.value.x;
  position_copy.value.y = position.value.y;
};

// const sendToAi = async ()=>{
//
//   const userParam={}
//   userParam.role='user'
//   userParam.context=textAreaContent.value
//   chatList.value.push(userParam)
//   console.info(chatList)
//
//   const aiParam={}
//   aiParam.role='ai'
//   aiParam.context=aiResponse.value
//   chatList.value.push(aiParam)
//
//   if(eventSource){
//     eventSource.close()
//   }
//   aiResponse.value='';
//   eventSource=new EventSource(`http://localhost:8080/llm/streamChat?message=${encodeURIComponent(textAreaContent.value)}&slug=myllm`)
//
//   visible.value=true;
//   startAnimation()
//
//   eventSource.onmessage=(event)=>{
//     stopAnimation()
//     aiResponse.value+=event.data
//     console.info('1:'+event.data)
//   };
//
//   eventSource.onclose=()=>{
//
//   }
//
//   eventSource.onerror=(error)=>{
//     console.error('SSE Error',error);
//     stopAnimation()
//     ElMessage.error("异常："+error)
//     if(eventSource){
//       eventSource.close()
//     }
//   };
//
//   eventSource.onopen=()=>{
//     console.log('SSE connection opened')
//   }
//
//
//
// }
const sendToAi = async () => {
  const userParam = {};
  userParam.role = 'user';
  userParam.context = textAreaContent.value;
  chatList.value.push(userParam);

  const aiParam = {};
  aiParam.role = 'ai';
  aiParam.context = '';
  chatList.value.push(aiParam);

  if (eventSource) {
    eventSource.close();
  }
  aiResponse.value = '';
  eventSource = new EventSource(`http://localhost:8080/llm/streamChat?message=${encodeURIComponent(textAreaContent.value)}&slug=myllm`);

  visible.value = true;
  startAnimation();

  eventSource.onmessage = (event) => {
    stopAnimation();
    aiResponse.value += event.data;
    // 更新 chatList 中最后一个 AI 消息的 context
    const lastAiMessageIndex = chatList.value.length - 1;
    chatList.value[lastAiMessageIndex].context = aiResponse.value;
    // 强制更新 chatList，确保视图更新
    chatList.value = [...chatList.value];
    console.info('1:' + event.data);
  };

  eventSource.onclose = () => {

  };

  eventSource.onerror = (error) => {
    console.error('SSE Error', error);
    stopAnimation();
    if (eventSource) {
      eventSource.close();
    }
  };

  eventSource.onopen = () => {
    console.log('SSE connection opened');
  };
};


const visible = ref(false);
const dots = ref('');
let interval;

const updateDots = () => {
  if (dots.value.length < 3) {
    dots.value += '.';
  } else {
    clearInterval(interval);
    setTimeout(() => {
      dots.value = '';
      startAnimation();
    }, 500); // 0.5秒后重新开始
  }
};

const startAnimation = () => {
  dots.value = '';
  visible.value = true;
  interval = setInterval(updateDots, 500); // 每0.5秒更新
};

const stopAnimation = () => {
  visible.value=false
  clearInterval(interval);
}



</script>

<style scoped>
.floating-button {
  position: fixed;
  z-index: 1000;
  cursor: grab;
}

.floating-button:active {
  cursor: grabbing;
}

.side-panel {
  position: fixed;
  top: 0;
  right: -400px; /* 初始状态在屏幕右侧外部 */
  width: 400px;
  height: 100vh;
  background-color: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  transition: right 0.3s ease;
  z-index: 999;
  display: flex;
  flex-direction: column;
}

.panel-open {
  right: 0; /* 展开状态 */
}

.panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.panel-footer {
  padding: 16px 20px;
  border-top: 1px solid #eee;
  text-align: right;
}

.close-button {
  padding: 0;
  font-size: 20px;
}

.message {
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
  max-width: 70%;
}

.message.user {
  align-self: flex-end; /* 右侧对齐 */
  background-color: #d1e7dd; /* 用户消息背景色 */
  right:0;
}

.message.ai {
  align-self: flex-start; /* 左侧对齐 */
  background-color: #f8d7da; /* AI消息背景色 */
  left: 0;
}

.panel-footer {
  padding: 16px 20px;
  border-top: 1px solid #eee;
  text-align: right;
}

.close-button {
  padding: 0;
  font-size: 20px;
}

.dots {
  font-size: 2rem;
  color: #409EFF; /* Element Plus primary color */
}

</style>

