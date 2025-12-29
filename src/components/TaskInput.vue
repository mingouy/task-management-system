<template>
  <div class="task-input-container">
    <input
      type="text"
      class="task-input"
      v-model="taskTitle"
      placeholder="请输入任务标题..."
      @keyup.enter="handleAddTask"
      maxlength="100"
      ref="inputRef"
    />
    <button class="add-btn" @click="handleAddTask">添加任务</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { addTask, generateId, TASK_STATUS } from '../utils/storage';

// 定义事件
const emit = defineEmits(['task-added']);

// 任务标题
const taskTitle = ref('');
// 输入框引用
const inputRef = ref(null);

// 挂载后自动聚焦
onMounted(() => {
  inputRef.value?.focus();
});

/**
 * 处理添加任务
 */
const handleAddTask = () => {
  // 验证输入
  if (!taskTitle.value.trim()) {
    alert('任务标题不能为空！');
    inputRef.value?.focus();
    return;
  }
  
  // 创建新任务
  const newTask = {
    id: generateId(),
    title: taskTitle.value.trim(),
    status: TASK_STATUS.TODO,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // 保存任务
  addTask(newTask);
  
  // 触发事件，通知父组件更新
  emit('task-added', newTask);
  
  // 清空输入框
  taskTitle.value = '';
  
  // 重新聚焦
  inputRef.value?.focus();
};
</script>

<style scoped>
.task-input-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
}

.task-input {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s;
}

.task-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.add-btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  background-color: #409eff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.add-btn:hover {
  background-color: #66b1ff;
}

.add-btn:active {
  background-color: #3a8ee6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .task-input-container {
    flex-direction: column;
  }
  
  .add-btn {
    width: 100%;
  }
}
</style>
