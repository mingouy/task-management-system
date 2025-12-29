<template>
  <section class="stats-view">
    <h2 class="view-title">任务统计分析</h2>
    
    <!-- 概览统计卡片 -->
    <div class="overview-cards">
      <div class="overview-card">
        <h3 class="card-title">总任务数</h3>
        <div class="card-value">{{ totalTasks }}</div>
      </div>
      <div class="overview-card">
        <h3 class="card-title">完成率</h3>
        <div class="card-value">{{ completionRate }}%</div>
      </div>
      <div class="overview-card">
        <h3 class="card-title">今日新增</h3>
        <div class="card-value">{{ todayTasks }}</div>
      </div>
    </div>
    
    <!-- 任务状态分布 -->
    <div class="stats-section">
      <h3 class="section-title">任务状态分布</h3>
      <div class="status-distribution">
        <!-- 待办任务 -->
        <div class="status-item">
          <div class="status-header">
            <span class="status-dot todo"></span>
            <span class="status-label">待办</span>
            <span class="status-count">{{ todoTasks }} 个</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill todo" 
              :style="{ width: todoProgress + '%' }"
            ></div>
          </div>
        </div>
        
        <!-- 进行中任务 -->
        <div class="status-item">
          <div class="status-header">
            <span class="status-dot in-progress"></span>
            <span class="status-label">进行中</span>
            <span class="status-count">{{ inProgressTasks }} 个</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill in-progress" 
              :style="{ width: inProgressProgress + '%' }"
            ></div>
          </div>
        </div>
        
        <!-- 已完成任务 -->
        <div class="status-item">
          <div class="status-header">
            <span class="status-dot done"></span>
            <span class="status-label">已完成</span>
            <span class="status-count">{{ completedTasks }} 个</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill done" 
              :style="{ width: doneProgress + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 任务状态占比 -->
    <div class="stats-section">
      <h3 class="section-title">状态占比</h3>
      <div class="pie-chart-container">
        <div class="pie-chart" :style="pieChartStyle">
          <div 
            class="pie-slice todo" 
            :style="{ clipPath: todoClipPath }"
          ></div>
          <div 
            class="pie-slice in-progress" 
            :style="{ clipPath: inProgressClipPath, transform: inProgressTransform }"
          ></div>
          <div 
            class="pie-slice done" 
            :style="{ clipPath: doneClipPath, transform: doneTransform }"
          ></div>
        </div>
        <div class="pie-legend">
          <div class="legend-item">
            <span class="legend-dot todo"></span>
            <span class="legend-text">待办 ({{ todoTasks }})</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot in-progress"></span>
            <span class="legend-text">进行中 ({{ inProgressTasks }})</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot done"></span>
            <span class="legend-text">已完成 ({{ completedTasks }})</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 任务管理建议 -->
    <div class="stats-section">
      <h3 class="section-title">管理建议</h3>
      <div class="suggestions">
        <div v-if="todoTasks > 5" class="suggestion-item warning">
          ⚠️ 您有 {{ todoTasks }} 个待办任务，建议优先处理重要任务！
        </div>
        <div v-if="inProgressTasks > 3" class="suggestion-item info">
          ℹ️ 您有 {{ inProgressTasks }} 个进行中任务，建议合理分配时间！
        </div>
        <div v-if="completionRate >= 80" class="suggestion-item success">
          ✅ 太棒了！您的任务完成率达到了 {{ completionRate }}%！
        </div>
        <div v-if="totalTasks === 0" class="suggestion-item">
          📝 您还没有创建任何任务，快去首页添加第一个任务吧！
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getTasks, TASK_STATUS } from '../utils/storage';

// 任务列表
const tasks = ref([]);

// 初始化任务列表
onMounted(() => {
  tasks.value = getTasks();
});

// 总任务数
const totalTasks = computed(() => tasks.value.length);

// 已完成任务数
const completedTasks = computed(() => {
  return tasks.value.filter(task => task.status === TASK_STATUS.DONE).length;
});

// 进行中任务数
const inProgressTasks = computed(() => {
  return tasks.value.filter(task => task.status === TASK_STATUS.IN_PROGRESS).length;
});

// 待办任务数
const todoTasks = computed(() => {
  return tasks.value.filter(task => task.status === TASK_STATUS.TODO).length;
});

// 完成率
const completionRate = computed(() => {
  if (totalTasks.value === 0) return 0;
  return Math.round((completedTasks.value / totalTasks.value) * 100);
});

// 今日新增任务数
const todayTasks = computed(() => {
  const today = new Date().toDateString();
  return tasks.value.filter(task => {
    const taskDate = new Date(task.createdAt).toDateString();
    return taskDate === today;
  }).length;
});

// 各状态进度百分比
const todoProgress = computed(() => {
  if (totalTasks.value === 0) return 0;
  return Math.round((todoTasks.value / totalTasks.value) * 100);
});

const inProgressProgress = computed(() => {
  if (totalTasks.value === 0) return 0;
  return Math.round((inProgressTasks.value / totalTasks.value) * 100);
});

const doneProgress = computed(() => {
  if (totalTasks.value === 0) return 0;
  return Math.round((completedTasks.value / totalTasks.value) * 100);
});

// 饼图样式计算
const pieChartStyle = computed(() => {
  return {
    width: '200px',
    height: '200px'
  };
});

// 计算饼图切片的clipPath和transform
const todoClipPath = computed(() => {
  if (todoTasks.value === 0) return 'circle(0% at 50% 50%)';
  const angle = (todoTasks.value / totalTasks.value) * 360;
  if (angle >= 360) return 'circle(50% at 50% 50%)';
  return `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((angle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle - 90) * Math.PI / 180)}%)`;
});

const inProgressClipPath = computed(() => {
  if (inProgressTasks.value === 0) return 'circle(0% at 50% 50%)';
  return 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)';
});

const inProgressTransform = computed(() => {
  const todoAngle = (todoTasks.value / totalTasks.value) * 360;
  return `rotate(${todoAngle}deg)`;
});

const doneClipPath = computed(() => {
  if (completedTasks.value === 0) return 'circle(0% at 50% 50%)';
  return 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)';
});

const doneTransform = computed(() => {
  const todoAngle = (todoTasks.value / totalTasks.value) * 360;
  const inProgressAngle = (inProgressTasks.value / totalTasks.value) * 360;
  return `rotate(${todoAngle + inProgressAngle}deg)`;
});
</script>

<style scoped>
.stats-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.view-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 0.5rem;
}

/* 概览卡片 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.overview-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s;
}

.overview-card:hover {
  transform: translateY(-2px);
}

.card-title {
  font-size: 0.9rem;
  color: #606266;
  margin-bottom: 0.75rem;
}

.card-value {
  font-size: 2.5rem;
  font-weight: 600;
  color: #409eff;
}

/* 统计区块 */
.stats-section {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #ebeef5;
}

/* 状态分布 */
.status-distribution {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-dot.todo {
  background-color: #f56c6c;
}

.status-dot.in-progress {
  background-color: #e6a23c;
}

.status-dot.done {
  background-color: #67c23a;
}

.status-label {
  flex: 1;
  font-weight: 500;
}

.status-count {
  color: #909399;
  font-size: 0.85rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-fill.todo {
  background-color: #f56c6c;
}

.progress-fill.in-progress {
  background-color: #e6a23c;
}

.progress-fill.done {
  background-color: #67c23a;
}

/* 饼图样式 */
.pie-chart-container {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.pie-chart {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  background-color: #f5f7fa;
}

.pie-slice {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-origin: center;
  transition: all 0.3s ease;
}

.pie-slice.todo {
  background-color: #f56c6c;
}

.pie-slice.in-progress {
  background-color: #e6a23c;
}

.pie-slice.done {
  background-color: #67c23a;
}

.pie-legend {
  flex: 1;
  min-width: 200px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.legend-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.legend-dot.todo {
  background-color: #f56c6c;
}

.legend-dot.in-progress {
  background-color: #e6a23c;
}

.legend-dot.done {
  background-color: #67c23a;
}

/* 建议样式 */
.suggestions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.suggestion-item {
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.95rem;
  line-height: 1.5;
}

.suggestion-item.success {
  background-color: #f0f9eb;
  color: #67c23a;
  border: 1px solid #c2e7b0;
}

.suggestion-item.info {
  background-color: #ecf5ff;
  color: #409eff;
  border: 1px solid #90caf9;
}

.suggestion-item.warning {
  background-color: #fdf6ec;
  color: #e6a23c;
  border: 1px solid #f3d19e;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .overview-cards {
    grid-template-columns: 1fr;
  }
  
  .pie-chart-container {
    flex-direction: column;
    align-items: center;
  }
  
  .pie-chart {
    width: 150px;
    height: 150px;
  }
  
  .card-value {
    font-size: 2rem;
  }
}
</style>
