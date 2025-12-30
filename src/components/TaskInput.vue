<template>
  <div class="task-input-container">
    <input
      type="text"
      class="task-input"
      v-model="taskTitle"
      placeholder="请输入任务标题..."
      maxlength="100"
      ref="titleInputRef"
    />
    <input
      type="text"
      class="task-input task-description"
      v-model="taskDescription"
      placeholder="请输入任务描述...（可选）"
      maxlength="200"
    />
    <div class="input-row">
      <div class="priority-container">
        <label for="task-priority">优先级：</label>
        <select
          id="task-priority"
          class="task-priority"
          v-model="taskPriority"
        >
          <option
            v-for="(text, value) in PRIORITY_TEXT"
            :key="value"
            :value="value"
          >
            {{ text }}
          </option>
        </select>
      </div>
      <div class="date-picker-container">
        <label for="task-date">选择日期：</label>
        <input
          type="date"
          id="task-date"
          class="task-date-picker"
          v-model="taskDate"
          :min="minDate"
        />
      </div>
    </div>
    <div class="tags-container">
      <label for="task-tags">标签（用逗号分隔）：</label>
      <input
        type="text"
        id="task-tags"
        class="task-tags"
        v-model="taskTagsInput"
        placeholder="例如：工作,学习,重要"
        maxlength="100"
      />
    </div>
    <button class="add-btn" @click="handleAddTask">添加任务</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { addTask, generateId, TASK_STATUS, TASK_PRIORITY, PRIORITY_TEXT } from '../utils/storage';

// 定义事件
const emit = defineEmits(['task-added']);

// 任务标题
const taskTitle = ref('');
// 任务描述
const taskDescription = ref('');
// 任务优先级
const taskPriority = ref(TASK_PRIORITY.MEDIUM);
// 任务日期
const taskDate = ref('');
// 任务标签输入
const taskTagsInput = ref('');
// 输入框引用
const titleInputRef = ref(null);

// 最小可选日期（今天）
const minDate = ref('');

// 挂载后自动聚焦
onMounted(() => {
  titleInputRef.value?.focus();
  // 设置最小日期为今天
  minDate.value = new Date().toISOString().split('T')[0];
  // 默认日期为今天
  taskDate.value = minDate.value;
});

/**
 * 处理添加任务
 */
const handleAddTask = () => {
  // 验证输入
  if (!taskTitle.value.trim()) {
    alert('任务标题不能为空！');
    titleInputRef.value?.focus();
    return;
  }
  
  // 处理标签，去除空格并过滤空标签
  const tags = taskTagsInput.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag !== '');
  
  // 创建新任务
  const newTask = {
    id: generateId(),
    title: taskTitle.value.trim(),
    description: taskDescription.value.trim() || '',
    priority: taskPriority.value,
    dueDate: taskDate.value ? new Date(taskDate.value).toISOString() : new Date().toISOString(),
    tags,
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
  taskDescription.value = '';
  taskPriority.value = TASK_PRIORITY.MEDIUM;
  taskTagsInput.value = '';
  // 重置日期为今天
  taskDate.value = minDate.value;
  
  // 重新聚焦
  titleInputRef.value?.focus();
};
</script>

<style scoped>
/* 任务输入容器 */
.task-input-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
  width: 100%;
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;
  animation: fadeIn 0.5s ease-out forwards;
}

.task-input-container:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

/* 任务输入框 */
.task-input {
  flex: 1;
  padding: 12px 16px;
  font-size: 15px;
  line-height: 1.5;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease-in-out;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.task-input::placeholder {
  color: #c0c4cc;
}

.task-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
  transform: translateY(-1px);
}

/* 任务描述输入框 */
.task-input.task-description {
  font-size: 14px;
  color: #606266;
  background-color: #fafafa;
}

/* 输入行布局 */
.input-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  align-items: center;
}

/* 优先级和日期容器 */
.priority-container,
.date-picker-container,
.tags-container {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* 标签样式 */
.priority-container label,
.date-picker-container label,
.tags-container label {
  font-size: 13px;
  font-weight: 600;
  color: #606266;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 选择框样式 */
.task-priority,
.task-date-picker {
  padding: 10px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease-in-out;
  min-width: 140px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.task-priority:focus,
.task-date-picker:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
  transform: translateY(-1px);
}

/* 标签输入样式 */
.tags-container {
  margin-top: 8px;
}

.task-tags {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease-in-out;
  min-width: 200px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.task-tags::placeholder {
  color: #c0c4cc;
  font-style: italic;
}

.task-tags:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
  transform: translateY(-1px);
}

/* 添加按钮 */
.add-btn {
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  white-space: nowrap;
  align-self: flex-start;
  margin-top: 8px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.add-btn:hover {
  background: linear-gradient(135deg, #66b1ff 0%, #409eff 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.3);
}

.add-btn:active {
  transform: scale(0.95) translateY(-1px);
  transition: transform 0.1s ease;
}

.add-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .task-input-container {
    padding: 16px;
    gap: 16px;
  }
  
  .input-row {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .priority-container,
  .date-picker-container,
  .tags-container {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .task-priority,
  .task-date-picker,
  .task-tags {
    width: 100%;
    min-width: auto;
  }
  
  .add-btn {
    width: 100%;
    align-self: stretch;
  }
}

/* 动画关键帧 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
