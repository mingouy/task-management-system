<template>
  <div class="stats-panel">
    <h2 class="stats-title">任务统计</h2>
    <div class="stats-grid">
      <!-- 总任务数 -->
      <div class="stat-card total">
        <div class="stat-icon">📋</div>
        <div class="stat-info">
          <div class="stat-value">{{ totalTasks }}</div>
          <div class="stat-label">总任务数</div>
        </div>
      </div>
      
      <!-- 已完成任务数 -->
      <div class="stat-card done">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <div class="stat-value">{{ completedTasks }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>
      
      <!-- 进行中任务数 -->
      <div class="stat-card in-progress">
        <div class="stat-icon">🔄</div>
        <div class="stat-info">
          <div class="stat-value">{{ inProgressTasks }}</div>
          <div class="stat-label">进行中</div>
        </div>
      </div>
      
      <!-- 待办任务数 -->
      <div class="stat-card todo">
        <div class="stat-icon">⏳</div>
        <div class="stat-info">
          <div class="stat-value">{{ todoTasks }}</div>
          <div class="stat-label">待办</div>
        </div>
      </div>
      
      <!-- 完成率 -->
      <div class="stat-card completion-rate">
        <div class="stat-icon">📊</div>
        <div class="stat-info">
          <div class="stat-value">{{ completionRate }}%</div>
          <div class="stat-label">完成率</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { TASK_STATUS } from '../utils/storage';

// 接收任务列表
const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  }
});

// 总任务数
const totalTasks = computed(() => props.tasks.length);

// 已完成任务数
const completedTasks = computed(() => {
  return props.tasks.filter(task => task.status === TASK_STATUS.DONE).length;
});

// 进行中任务数
const inProgressTasks = computed(() => {
  return props.tasks.filter(task => task.status === TASK_STATUS.IN_PROGRESS).length;
});

// 待办任务数
const todoTasks = computed(() => {
  return props.tasks.filter(task => task.status === TASK_STATUS.TODO).length;
});

// 完成率
const completionRate = computed(() => {
  if (totalTasks.value === 0) return 0;
  return Math.round((completedTasks.value / totalTasks.value) * 100);
});
</script>

<style scoped>
.stats-panel {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stats-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #ebeef5;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 8px;
  background-color: #f5f7fa;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 不同统计项的样式 */
.stat-card.total {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.stat-card.done {
  border-color: #67c23a;
  background-color: #f0f9eb;
}

.stat-card.in-progress {
  border-color: #e6a23c;
  background-color: #fdf6ec;
}

.stat-card.todo {
  border-color: #f56c6c;
  background-color: #fef0f0;
}

.stat-card.completion-rate {
  border-color: #909399;
  background-color: #f5f7fa;
}

.stat-icon {
  font-size: 2rem;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 600;
  color: #303133;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #606266;
  margin-top: 0.25rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.75rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-icon {
    font-size: 1.5rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
