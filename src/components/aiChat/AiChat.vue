<template>
  <div id="app">
    <div
        class="floating-button"
        @mousedown="startDragging"
        @mouseup="stopDragging"
        @mouseleave="stopDragging"
        :style="{ left: position.x + 'px', top: position.y + 'px' }"
    >
      <el-button type="primary" @click="toggleDialog">+</el-button>
    </div>

    <el-dialog :visible.sync="dialogVisible" title="对话框">
      <p>这是一个可拖动的悬浮按钮，点击后展开的对话框。</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const dialogVisible = ref(false);
const position = ref({ x: 100, y: 200 }); // 悬浮按钮的位置
let isDragging = ref(false);
let offset = ref({ x: 0, y: 0 });

const toggleDialog = () => {
  dialogVisible.value = !dialogVisible.value;
};

const startDragging = (event) => {
  isDragging.value = true;
  offset.value.x = event.clientX - position.value.x;
  offset.value.y = event.clientY - position.value.y;

  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDragging);
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
};
</script>

<style scoped>
.floating-button {
  position: fixed;
  z-index: 1000;
  cursor: grab;
}
</style>
