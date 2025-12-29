<template>
  <section class="home-view">
    <h2 class="view-title">任务管理</h2>
    
    <!-- 任务统计面板 -->
    <TaskStatsPanel :tasks="tasks" />
    
    <!-- 任务输入组件 -->
    <TaskInput @task-added="handleTaskAdded" />
    
    <!-- 任务列表组件 -->
    <TaskList 
      :tasks="tasks" 
      @task-updated="handleTaskUpdated"
      @task-deleted="handleTaskDeleted"
    />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// 导入组件
import TaskStatsPanel from '../components/TaskStatsPanel.vue'; // 任务统计面板
import TaskInput from '../components/TaskInput.vue'; // 任务输入组件
import TaskList from '../components/TaskList.vue'; // 任务列表组件
// 导入工具函数
import { getTasks } from '../utils/storage'; // 获取任务列表的工具函数

/**
 * 任务列表状态管理
 * 使用ref创建响应式数据，存储所有任务
 */
const tasks = ref([]);

/**
 * 组件挂载生命周期钩子
 * 页面加载时，初始化任务列表
 */
onMounted(() => {
  loadTasks(); // 调用加载任务函数
});

/**
 * 加载任务列表
 * 从localStorage中读取任务数据并更新到响应式状态
 */
const loadTasks = () => {
  tasks.value = getTasks(); // 调用工具函数获取任务
};

/**
 * 处理任务添加事件
 * 当任务输入组件添加新任务时触发
 * @param {Object} newTask 新添加的任务对象
 */
const handleTaskAdded = (newTask) => {
  loadTasks(); // 重新加载任务列表，更新视图
};

/**
 * 处理任务更新事件
 * 当任务列表组件中的任务状态或标题更新时触发
 * @param {Object} updatedTask 更新后的任务对象
 */
const handleTaskUpdated = (updatedTask) => {
  loadTasks(); // 重新加载任务列表，更新视图
};

/**
 * 处理任务删除事件
 * 当任务列表组件删除任务时触发
 * @param {string} taskId 删除的任务ID
 */
const handleTaskDeleted = (taskId) => {
  loadTasks(); // 重新加载任务列表，更新视图
};
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.view-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 0.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .view-title {
    font-size: 1.25rem;
  }
}
</style>
