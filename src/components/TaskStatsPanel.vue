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
      
      <!-- 待办任务百分比 -->
      <div class="stat-card todo">
        <div class="stat-icon">⏳</div>
        <div class="stat-info">
          <div class="stat-value">{{ todoPercentage }}%</div>
          <div class="stat-label">待办任务</div>
        </div>
      </div>
      
      <!-- 进行中任务百分比 -->
      <div class="stat-card in-progress">
        <div class="stat-icon">🔄</div>
        <div class="stat-info">
          <div class="stat-value">{{ inProgressPercentage }}%</div>
          <div class="stat-label">进行中</div>
        </div>
      </div>
      
      <!-- 已完成任务百分比 -->
      <div class="stat-card done">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <div class="stat-value">{{ completedPercentage }}%</div>
          <div class="stat-label">已完成</div>
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

// 待办任务百分比
const todoPercentage = computed(() => {
  if (totalTasks.value === 0) return 0;
  return Math.round((todoTasks.value / totalTasks.value) * 100);
});

// 进行中任务百分比
const inProgressPercentage = computed(() => {
  if (totalTasks.value === 0) return 0;
  return Math.round((inProgressTasks.value / totalTasks.value) * 100);
});

// 已完成任务百分比
const completedPercentage = computed(() => {
  if (totalTasks.value === 0) return 0;
  return Math.round((completedTasks.value / totalTasks.value) * 100);
});
</script>

<style scoped>
/* 统计面板容器 */
.stats-panel {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;
  animation: fadeIn 0.5s ease-out forwards;
}

.stats-panel:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

/* 统计标题 */
.stats-title {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
  animation: fadeIn 0.5s ease-out 0.1s forwards;
  opacity: 0;
}

/* 统计网格布局 - 12列栅格系统 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
  animation: fadeIn 0.5s ease-out 0.2s forwards;
  opacity: 0;
}

/* 统计卡片 */
.stat-card {
  grid-column: span 3; /* 每行4个卡片，每个占3列 */
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f7fa 100%);
  transition: all 0.3s ease-in-out;
  border: 1px solid #f0f2f5;
  position: relative;
  overflow: hidden;
  opacity: 0;
  animation: fadeInUp 0.4s ease-out forwards;
}

/* 卡片动画延迟 */
.stat-card:nth-child(1) { animation-delay: 0.3s; }
.stat-card:nth-child(2) { animation-delay: 0.4s; }
.stat-card:nth-child(3) { animation-delay: 0.5s; }
.stat-card:nth-child(4) { animation-delay: 0.6s; }

/* 卡片hover效果 */
.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%);
  border-color: #e4e7ed;
}

/* 不同统计项的样式 - 柔和低饱和色系 */
.stat-card.total {
  background: linear-gradient(135deg, #ecf5ff 0%, #f0f7ff 100%);
  border-color: #d9ecff;
}

.stat-card.done {
  background: linear-gradient(135deg, #f0f9eb 0%, #f6fdf2 100%);
  border-color: #e1f3d8;
}

.stat-card.in-progress {
  background: linear-gradient(135deg, #fdf6ec 0%, #fefaf0 100%);
  border-color: #faecd8;
}

.stat-card.todo {
  background: linear-gradient(135deg, #fef0f0 0%, #fef5f5 100%);
  border-color: #fbc4c4;
}

/* 统计图标 */
.stat-icon {
  font-size: 2.5rem;
  transition: all 0.3s ease-in-out;
  flex-shrink: 0;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1) rotate(5deg);
}

/* 统计信息 */
.stat-info {
  flex: 1;
  min-width: 0;
}

/* 统计数值 - 字体层级 */
.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
  margin-bottom: 4px;
  transition: all 0.3s ease-in-out;
  animation: countUp 1s ease-out forwards;
  opacity: 0;
  transform: translateY(10px);
}

.stat-card:hover .stat-value {
  transform: scale(1.05);
}

/* 统计标签 - 辅助文字 */
.stat-label {
  font-size: 13px;
  line-height: 1.4;
  color: #909399;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  animation: fadeIn 0.5s ease-out 0.3s forwards;
  opacity: 0;
}

/* 数值增长动画 */
@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 元素进入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .stat-card {
    grid-column: span 6; /* 平板端每行2个卡片，每个占6列 */
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(8, 1fr); /* 移动端8列布局 */
    gap: 16px;
  }
  
  .stat-card {
    grid-column: span 8; /* 移动端每行1个卡片，占满8列 */
    padding: 16px;
  }
  
  .stats-panel {
    padding: 16px;
    margin-bottom: 16px;
  }
  
  .stats-title {
    font-size: 18px;
    margin-bottom: 16px;
  }
  
  .stat-icon {
    font-size: 2rem;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .stat-label {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .stat-card {
    grid-column: span 1;
  }
}
</style>
