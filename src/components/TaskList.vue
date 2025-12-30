<template>
  <div class="task-list-container">
    <!-- 搜索和排序区域 -->
    <div class="search-sort-section">
      <div class="search-container">
        <input
          type="text"
          class="search-input"
          v-model="searchQuery"
          placeholder="搜索任务标题或描述..."
          maxlength="100"
        />
      </div>
      <div class="sort-container">
        <label for="sort-by">排序：</label>
        <select id="sort-by" class="sort-select" v-model="sortBy">
          <option value="dueDate">截止日期</option>
          <option value="createdAt">创建时间</option>
          <option value="priority">优先级</option>
        </select>
        <button
          class="sort-order-btn"
          :class="{ active: isAscending }"
          @click="toggleSortOrder"
          title="切换排序顺序"
        >
          {{ isAscending ? '↑' : '↓' }}
        </button>
      </div>
    </div>

    <!-- 筛选器和批量操作区域 -->
    <div class="filter-batch-section">
      <div class="filter-section">
        <button
          class="filter-btn"
          :class="{ active: currentFilter === 'all' }"
          @click="setFilter('all')"
        >
          全部
        </button>
        <button
          class="filter-btn"
          :class="{ active: currentFilter === 'todo' }"
          @click="setFilter('todo')"
        >
          待办
        </button>
        <button
          class="filter-btn"
          :class="{ active: currentFilter === 'in-progress' }"
          @click="setFilter('in-progress')"
        >
          进行中
        </button>
        <button
          class="filter-btn"
          :class="{ active: currentFilter === 'done' }"
          @click="setFilter('done')"
        >
          已完成
        </button>
      </div>

      <!-- 批量操作 -->
      <div class="batch-actions" v-if="selectedTasks.length > 0">
        <span class="selected-count">已选择 {{ selectedTasks.length }} 项</span>
        <button class="batch-btn complete" @click="batchCompleteTasks">批量完成</button>
        <button class="batch-btn delete" @click="batchDeleteTasks">批量删除</button>
        <button class="batch-btn clear" @click="clearSelected">清除选择</button>
      </div>
    </div>

    <!-- 任务列表 -->
    <ul class="task-list">
      <li
        v-for="task in filteredAndSortedTasks"
        :key="task.id"
        class="task-item"
        :class="`status-${task.status}`"
      >
        <!-- 任务选择复选框 -->
        <div class="task-select">
          <input
            type="checkbox"
            class="select-checkbox"
            v-model="selectedTasks"
            :value="task.id"
          />
        </div>

        <!-- 任务状态选择器 -->
        <div class="task-status">
          <select
            class="status-select"
            v-model="task.status"
            @change="handleStatusChange(task)"
          >
            <option
              v-for="(text, value) in STATUS_TEXT"
              :key="value"
              :value="value"
            >
              {{ text }}
            </option>
          </select>
        </div>

        <!-- 任务内容 -->
        <div class="task-content">
          <!-- 任务标题 -->
          <div class="task-title-row">
            <div class="task-title">
              <template v-if="editingTaskId === task.id && editingField === 'title'">
                <input
                  type="text"
                  class="title-input"
                  v-model="editingValue"
                  @blur="saveEdit(task, 'title')"
                  @keyup.enter="saveEdit(task, 'title')"
                  @keyup.escape="cancelEdit"
                  ref="titleInputRef"
                />
              </template>
              <template v-else>
                <span
                  class="title-text"
                  @click="startEdit(task, 'title')"
                >
                  {{ task.title }}
                </span>
              </template>
            </div>
            <!-- 优先级标签 -->
            <div
              class="priority-badge"
              :style="{ backgroundColor: PRIORITY_COLOR[task.priority] }"
              v-if="editingTaskId !== task.id || editingField !== 'priority'"
            >
              {{ PRIORITY_TEXT[task.priority] }}
            </div>
            <select
              v-else
              class="priority-select"
              v-model="editingValue"
              @change="saveEdit(task, 'priority')"
              @blur="saveEdit(task, 'priority')"
              @keyup.enter="saveEdit(task, 'priority')"
              @keyup.escape="cancelEdit"
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

          <!-- 任务描述 -->
          <div class="task-description">
            <template v-if="editingTaskId === task.id && editingField === 'description'">
              <input
                type="text"
                class="description-input"
                v-model="editingValue"
                @blur="saveEdit(task, 'description')"
                @keyup.enter="saveEdit(task, 'description')"
                @keyup.escape="cancelEdit"
              />
            </template>
            <template v-else>
              <span
                class="description-text"
                @click="startEdit(task, 'description')"
              >
                {{ task.description || '无描述' }}
              </span>
            </template>
          </div>

          <!-- 任务元数据 -->
          <div class="task-meta">
            <span class="task-date-label">截止日期：</span>
            <template v-if="editingTaskId === task.id && editingField === 'dueDate'">
              <input
                type="date"
                class="date-input"
                v-model="editingDateValue"
                @blur="saveEditDate(task)"
                @change="saveEditDate(task)"
                @keyup.enter="saveEditDate(task)"
                @keyup.escape="cancelEdit"
              />
            </template>
            <template v-else>
              <span
                class="task-date"
                @click="startEdit(task, 'dueDate')"
              >
                {{ formatDate(task.dueDate) }}
              </span>
            </template>
          </div>

          <!-- 任务标签 -->
          <div class="task-tags" v-if="task.tags && task.tags.length > 0">
            <span
              class="tag-item"
              v-for="tag in task.tags"
              :key="tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- 任务操作 -->
        <div class="task-actions">
          <button
            class="delete-btn"
            @click="showDeleteConfirmModal(task.id, task.title)"
          >
            删除
          </button>
        </div>
      </li>
    </ul>

    <!-- 空任务状态 -->
    <div class="empty-tasks" v-if="filteredAndSortedTasks.length === 0">
      <p>暂无任务，点击上方添加新任务吧！</p>
    </div>

    <!-- 删除确认模态框 -->
    <div class="modal-overlay" v-if="showDeleteModal" @click.self="closeDeleteModal">
      <div class="modal-content">
        <h3 class="modal-title">删除确认</h3>
        <p class="modal-message">
          确定要删除任务 "{{ deletingTaskTitle }}" 吗？此操作不可恢复。
        </p>
        <div class="modal-buttons">
          <button class="cancel-btn" @click="closeDeleteModal">取消</button>
          <button class="confirm-btn" @click="confirmDeleteTask">确定删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
// 导入工具函数
import { 
  updateTask, 
  deleteTask, 
  TASK_STATUS, 
  STATUS_TEXT, 
  TASK_PRIORITY, 
  PRIORITY_TEXT, 
  PRIORITY_COLOR 
} from '../utils/storage';

// 定义 props
const props = defineProps({
  tasks: {
    type: Array,
    required: true
  }
});

// 定义事件
const emit = defineEmits(['task-updated', 'task-deleted']);

// 搜索查询
const searchQuery = ref('');
// 排序字段
const sortBy = ref('dueDate');
// 排序顺序
const isAscending = ref(true);
// 当前筛选条件
const currentFilter = ref('all');
// 选中的任务ID列表
const selectedTasks = ref([]);

// 编辑状态
const editingTaskId = ref(null);
const editingField = ref(null);
const editingValue = ref('');
const editingDateValue = ref('');
const titleInputRef = ref(null);

// 删除确认模态框
const showDeleteModal = ref(false);
const deletingTaskId = ref(null);
const deletingTaskTitle = ref('');

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 计算属性：筛选和排序后的任务列表
const filteredAndSortedTasks = computed(() => {
  let result = [...props.tasks];
  
  // 筛选
  if (currentFilter.value !== 'all') {
    result = result.filter(task => task.status === currentFilter.value);
  }
  
  // 搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(task => 
      task.title.toLowerCase().includes(query) || 
      task.description.toLowerCase().includes(query)
    );
  }
  
  // 排序
  result.sort((a, b) => {
    let compareValue = 0;
    
    if (sortBy.value === 'priority') {
      // 优先级排序：高 -> 中 -> 低
      const priorityOrder = { [TASK_PRIORITY.HIGH]: 3, [TASK_PRIORITY.MEDIUM]: 2, [TASK_PRIORITY.LOW]: 1 };
      compareValue = priorityOrder[b.priority] - priorityOrder[a.priority];
    } else {
      // 日期排序
      const dateA = new Date(a[sortBy.value]);
      const dateB = new Date(b[sortBy.value]);
      compareValue = dateA - dateB;
    }
    
    return isAscending.value ? compareValue : -compareValue;
  });
  
  return result;
});

// 切换排序顺序
const toggleSortOrder = () => {
  isAscending.value = !isAscending.value;
};

// 设置筛选条件
const setFilter = (filter) => {
  currentFilter.value = filter;
};

// 开始编辑
const startEdit = (task, field) => {
  editingTaskId.value = task.id;
  editingField.value = field;
  
  if (field === 'dueDate') {
    // 处理日期字段
    const date = new Date(task[field]);
    editingDateValue.value = date.toISOString().split('T')[0];
  } else {
    editingValue.value = task[field];
  }
  
  // 下次DOM更新后聚焦输入框
  setTimeout(() => {
    if (field === 'title' && titleInputRef.value) {
      titleInputRef.value.focus();
    }
  }, 0);
};

// 保存编辑
const saveEdit = (task, field) => {
  if (!editingValue.value.trim() && field === 'title') {
    // 标题不能为空
    cancelEdit();
    return;
  }
  
  const updates = { [field]: editingValue.value.trim() };
  updateTask(task.id, updates);
  
  // 触发事件
  emit('task-updated', { ...task, ...updates });
  
  // 结束编辑状态
  cancelEdit();
};

// 保存日期编辑
const saveEditDate = (task) => {
  const updates = { dueDate: new Date(editingDateValue.value).toISOString() };
  updateTask(task.id, updates);
  
  // 触发事件
  emit('task-updated', { ...task, ...updates });
  
  // 结束编辑状态
  cancelEdit();
};

// 取消编辑
const cancelEdit = () => {
  editingTaskId.value = null;
  editingField.value = null;
  editingValue.value = '';
  editingDateValue.value = '';
};

// 处理状态变更
const handleStatusChange = (task) => {
  updateTask(task.id, { status: task.status });
  emit('task-updated', task);
};

// 显示删除确认模态框
const showDeleteConfirmModal = (taskId, taskTitle) => {
  deletingTaskId.value = taskId;
  deletingTaskTitle.value = taskTitle;
  showDeleteModal.value = true;
};

// 关闭删除确认模态框
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  deletingTaskId.value = null;
  deletingTaskTitle.value = '';
};

// 确认删除任务
const confirmDeleteTask = () => {
  if (deletingTaskId.value) {
    deleteTask(deletingTaskId.value);
    emit('task-deleted', deletingTaskId.value);
  }
  closeDeleteModal();
};

// 批量完成任务
const batchCompleteTasks = () => {
  selectedTasks.value.forEach(taskId => {
    updateTask(taskId, { status: TASK_STATUS.DONE });
  });
  // 触发事件
  emit('task-updated');
  // 清空选择
  selectedTasks.value = [];
};

// 批量删除任务
const batchDeleteTasks = () => {
  selectedTasks.value.forEach(taskId => {
    deleteTask(taskId);
    emit('task-deleted', taskId);
  });
  // 清空选择
  selectedTasks.value = [];
};

// 清除选择
const clearSelected = () => {
  selectedTasks.value = [];
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

/* 搜索和排序区域 */
.search-sort-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-container {
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.sort-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-container label {
  font-size: 0.9rem;
  color: #606266;
  font-weight: 500;
}

.sort-select {
  padding: 0.5rem;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s;
  min-width: 120px;
}

.sort-select:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.sort-order-btn {
  padding: 0.5rem;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sort-order-btn:hover {
  background-color: #ecf5ff;
  border-color: #409eff;
}

.sort-order-btn.active {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}

/* 筛选器和批量操作区域 */
.filter-batch-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f7fa;
  padding: 0.5rem;
  border-bottom: 1px solid #ebeef5;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
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

/* 批量操作 */
.batch-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.selected-count {
  font-size: 0.9rem;
  color: #606266;
  font-weight: 500;
}

.batch-btn {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.85rem;
  font-weight: 500;
}

.batch-btn.delete {
  background-color: #f56c6c;
  color: white;
}

.batch-btn.complete {
  background-color: #67c23a;
  color: white;
}

.batch-btn.clear {
  background-color: #909399;
  color: white;
}

.batch-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  display: flex;
  align-items: flex-start;
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

/* 任务选择复选框 */
.task-select {
  margin-right: 1rem;
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.select-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #409eff;
}

.task-status {
  margin-right: 1rem;
  flex-shrink: 0;
  margin-top: 0.25rem;
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

.task-content {
  flex: 1;
  min-width: 0;
}

.task-title-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
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
  font-weight: 500;
}

.title-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #409eff;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  margin-bottom: 0.5rem;
}

/* 优先级样式 */
.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

.priority-select {
  padding: 0.4rem;
  border: 1px solid #409eff;
  border-radius: 4px;
  font-size: 0.85rem;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  min-width: 100px;
}

.task-description {
  margin-top: 0.25rem;
}

.description-text {
  font-size: 0.85rem;
  color: #606266;
  word-break: break-word;
  cursor: pointer;
  padding: 0.2rem 0;
  line-height: 1.4;
  font-style: italic;
}

.description-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #409eff;
  border-radius: 4px;
  font-size: 0.85rem;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  color: #606266;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  flex-wrap: wrap;
}

.task-date-label {
  color: #909399;
  font-weight: 500;
}

.task-date {
  color: #409eff;
  cursor: pointer;
  padding: 0.2rem 0;
}

.task-date:hover {
  text-decoration: underline;
}

.date-input {
  padding: 0.4rem;
  border: 1px solid #409eff;
  border-radius: 4px;
  font-size: 0.85rem;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  min-width: 140px;
}

/* 标签样式 */
.task-tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.tag-item {
  padding: 0.25rem 0.75rem;
  background-color: #ecf5ff;
  color: #409eff;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

.task-actions {
  margin-left: 1rem;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
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
  
  .task-status,
  .task-select,
  .task-actions {
    margin-right: 0;
    margin-left: 0;
  }
  
  .task-actions {
    justify-content: flex-end;
  }
  
  .filter-section {
    flex-wrap: wrap;
  }
  
  .filter-btn {
    margin-bottom: 0.5rem;
  }
  
  .search-sort-section,
  .filter-batch-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .batch-actions {
    justify-content: flex-start;
  }
  
  .task-title-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
}
</style>