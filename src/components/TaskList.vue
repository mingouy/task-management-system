<template>
  <div class="task-list-container">
    <!-- 筛选器 -->
    <div class="filter-section">
      <button
        v-for="filter in filters"
        :key="filter.value"
        class="filter-btn"
        :class="{ active: activeFilter === filter.value }"
        @click="handleFilterChange(filter.value)"
      >
        {{ filter.label }}
      </button>
    </div>
    
    <!-- 任务列表 -->
    <ul class="task-list">
      <li
        v-for="task in filteredTasks"
        :key="task.id"
        class="task-item"
        :class="`status-${task.status}`"
      >
        <!-- 任务状态切换 -->
        <div class="task-status">
          <select
            v-model="task.status"
            class="status-select"
            @change="handleStatusChange(task)"
          >
            <option
              v-for="(status, key) in STATUS_TEXT"
              :key="key"
              :value="key"
            >
              {{ status }}
            </option>
          </select>
        </div>
        
        <!-- 任务标题（支持双击编辑） -->
        <div class="task-title">
          <div
            v-if="!editingId || editingId !== task.id"
            class="title-text"
            @dblclick="handleEditStart(task)"
          >
            {{ task.title }}
          </div>
          <input
            v-else
            type="text"
            class="title-input"
            v-model="editingTitle"
            @keyup.enter="handleEditSave(task)"
            @blur="handleEditSave(task)"
            @keyup.esc="handleEditCancel"
            ref="editInputRef"
          />
        </div>
        
        <!-- 任务操作按钮 -->
        <div class="task-actions">
          <button
            class="delete-btn"
            @click="handleDeleteTask(task)"
            title="删除任务"
          >
            删除
          </button>
        </div>
      </li>
      
      <!-- 空状态 -->
      <li v-if="filteredTasks.length === 0" class="empty-tasks">
        暂无任务，点击上方"添加任务"按钮创建新任务吧！
      </li>
    </ul>
    
    <!-- 删除确认模态框 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="handleCloseModal">
      <div class="modal-content">
        <h3 class="modal-title">确认删除</h3>
        <p class="modal-message">您确定要删除任务 "{{ deletingTask?.title }}" 吗？此操作不可恢复。</p>
        <div class="modal-buttons">
          <button class="cancel-btn" @click="handleCloseModal">取消</button>
          <button class="confirm-btn" @click="handleConfirmDelete">确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { updateTask, deleteTask, TASK_STATUS, STATUS_TEXT } from '../utils/storage';

// 接收任务列表
const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  }
});

// 定义事件
const emit = defineEmits(['task-updated', 'task-deleted']);

// 筛选状态
const activeFilter = ref('all');

// 编辑状态
const editingId = ref(null);
const editingTitle = ref('');
const editInputRef = ref(null);

// 删除模态框状态
const showDeleteModal = ref(false);
const deletingTask = ref(null);

// 筛选选项
const filters = [
  { label: '全部', value: 'all' },
  { label: '待办', value: TASK_STATUS.TODO },
  { label: '进行中', value: TASK_STATUS.IN_PROGRESS },
  { label: '已完成', value: TASK_STATUS.DONE }
];

// 计算属性：根据筛选条件过滤任务
const filteredTasks = computed(() => {
  if (activeFilter.value === 'all') {
    return props.tasks;
  }
  return props.tasks.filter(task => task.status === activeFilter.value);
});

/**
 * 处理筛选条件变化
 * @param {string} filterValue 筛选值
 */
const handleFilterChange = (filterValue) => {
  activeFilter.value = filterValue;
};

/**
 * 处理任务状态变化
 * @param {Object} task 任务对象
 */
const handleStatusChange = (task) => {
  // 更新任务状态
  updateTask(task.id, {
    status: task.status,
    updatedAt: new Date().toISOString()
  });
  
  // 通知父组件
  emit('task-updated', task);
};

/**
 * 开始编辑任务
 * @param {Object} task 任务对象
 */
const handleEditStart = (task) => {
  editingId.value = task.id;
  editingTitle.value = task.title;
  
  // 下一帧聚焦
  setTimeout(() => {
    editInputRef.value?.focus();
    editInputRef.value?.select();
  }, 0);
};

/**
 * 保存编辑
 * @param {Object} task 任务对象
 */
const handleEditSave = (task) => {
  // 验证输入
  if (!editingTitle.value.trim()) {
    alert('任务标题不能为空！');
    editInputRef.value?.focus();
    return;
  }
  
  // 更新任务
  updateTask(task.id, {
    title: editingTitle.value.trim(),
    updatedAt: new Date().toISOString()
  });
  
  // 通知父组件
  emit('task-updated', {
    ...task,
    title: editingTitle.value.trim(),
    updatedAt: new Date().toISOString()
  });
  
  // 结束编辑
  editingId.value = null;
};

/**
 * 取消编辑
 */
const handleEditCancel = () => {
  editingId.value = null;
};

/**
 * 打开删除确认模态框
 * @param {Object} task 任务对象
 */
const handleDeleteTask = (task) => {
  deletingTask.value = task;
  showDeleteModal.value = true;
};

/**
 * 关闭模态框
 */
const handleCloseModal = () => {
  showDeleteModal.value = false;
  deletingTask.value = null;
};

/**
 * 确认删除
 */
const handleConfirmDelete = () => {
  if (deletingTask.value) {
    // 删除任务
    deleteTask(deletingTask.value.id);
    
    // 通知父组件
    emit('task-deleted', deletingTask.value.id);
    
    // 关闭模态框
    handleCloseModal();
  }
};
</script>

<style scoped>
.task-list-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
}

.filter-section {
  display: flex;
  background-color: #f5f7fa;
  padding: 0.5rem;
  border-bottom: 1px solid #ebeef5;
}

.filter-btn {
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  color: #606266;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn:hover {
  background-color: #ecf5ff;
  color: #409eff;
}

.filter-btn.active {
  background-color: #409eff;
  color: white;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ebeef5;
  transition: all 0.3s;
}

.task-item:last-child {
  border-bottom: none;
}

.task-item:hover {
  background-color: #fafafa;
}

/* 不同状态样式 */
.task-item.status-todo {
  border-left: 4px solid #e6a23c;
}

.task-item.status-in-progress {
  border-left: 4px solid #409eff;
}

.task-item.status-done {
  border-left: 4px solid #67c23a;
  opacity: 0.7;
}

.task-item.status-done .title-text {
  text-decoration: line-through;
  color: #909399;
}

.task-status {
  margin-right: 1rem;
  flex-shrink: 0;
}

.status-select {
  padding: 0.4rem 0.6rem;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.3s;
}

.status-select:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.task-title {
  flex: 1;
  min-width: 0;
}

.title-text {
  font-size: 1rem;
  color: #303133;
  word-break: break-word;
  cursor: pointer;
  padding: 0.2rem 0;
}

.title-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #409eff;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.task-actions {
  margin-left: 1rem;
  flex-shrink: 0;
}

.delete-btn {
  padding: 0.4rem 0.8rem;
  background-color: #f56c6c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-btn:hover {
  background-color: #f78989;
}

.delete-btn:active {
  background-color: #dd6161;
}

.empty-tasks {
  text-align: center;
  padding: 2rem;
  color: #909399;
  font-style: italic;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-title {
  margin-bottom: 1rem;
  color: #303133;
  font-size: 1.2rem;
  font-weight: 600;
}

.modal-message {
  margin-bottom: 1.5rem;
  color: #606266;
  line-height: 1.5;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn {
  padding: 0.5rem 1rem;
  background-color: #fff;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background-color: #f5f7fa;
  border-color: #c6e2ff;
}

.confirm-btn {
  padding: 0.5rem 1rem;
  background-color: #f56c6c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.confirm-btn:hover {
  background-color: #f78989;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .task-item {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .task-status {
    margin-right: 0;
  }
  
  .task-actions {
    margin-left: 0;
    display: flex;
    justify-content: flex-end;
  }
  
  .filter-section {
    flex-wrap: wrap;
  }
  
  .filter-btn {
    margin-bottom: 0.5rem;
  }
}
</style>
