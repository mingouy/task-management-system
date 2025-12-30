<template>
  <div class="calendar-container">
    <h2 class="calendar-title">任务日历</h2>
    
    <!-- 日历头部 -->
    <div class="calendar-header">
      <button class="nav-btn" @click="navigateMonth(-1)">上一月</button>
      <h3 class="month-year">{{ currentMonthYear }}</h3>
      <button class="nav-btn" @click="navigateMonth(1)">下一月</button>
    </div>
    
    <!-- 日期跳转功能 -->
    <div class="calendar-jump">
      <label for="jump-date">跳转到日期：</label>
      <input
        type="date"
        id="jump-date"
        class="jump-date-input"
        v-model="jumpDate"
        :min="minDate"
      />
      <button class="jump-btn" @click="handleJump">跳转</button>
    </div>
    
    <!-- 星期标题 -->
    <div class="calendar-weekdays">
      <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
    </div>
    
    <!-- 日历主体 -->
    <div class="calendar-body">
      <div 
        class="calendar-day"
        v-for="day in calendarDays"
        :key="day.date"
        :class="{
          'other-month': !day.isCurrentMonth,
          'current-day': day.isCurrentDay,
          'has-tasks': day.taskCount > 0
        }"
        @click="handleDayClick(day)"
      >
        <div class="day-number">{{ day.day }}</div>
        <div v-if="day.taskCount > 0" class="task-count">{{ day.taskCount }}</div>
      </div>
    </div>
    
    <!-- 当天任务列表 -->
    <div v-if="selectedDay" class="selected-day-tasks">
      <h3>{{ selectedDay.fullDate }} 的任务</h3>
      <ul v-if="selectedDayTasks.length > 0" class="task-list">
        <li v-for="task in selectedDayTasks" :key="task.id" class="task-item">
          <div class="task-info">
            <div class="task-status-indicator" :class="`status-${task.status}`"></div>
            <div class="task-details">
              <div class="task-title">{{ task.title }}</div>
              <div class="task-description">{{ task.description || '（无描述）' }}</div>
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="no-tasks">当天没有任务</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// 接收任务列表
const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  }
});

// 当前日期
const currentDate = ref(new Date());
// 选中的日期
const selectedDay = ref(null);
// 跳转到的日期
const jumpDate = ref('');
// 星期标题
const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
// 最小可选日期（今天）
const minDate = ref(new Date().toISOString().split('T')[0]);

// 计算当前月份和年份的显示文本
const currentMonthYear = computed(() => {
  return `${currentDate.value.getFullYear()}年${currentDate.value.getMonth() + 1}月`;
});

// 计算当前月份的日历天数
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  // 获取当月第一天
  const firstDay = new Date(year, month, 1);
  // 获取当月第一天是星期几（0-6，0是星期日）
  const firstDayOfWeek = firstDay.getDay();
  // 获取当月天数
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // 获取上月天数
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  
  const days = [];
  
  // 添加上月的剩余天数
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(year, month - 1, day);
    days.push({
      day,
      date: date.toISOString(),
      isCurrentMonth: false,
      isCurrentDay: false,
      taskCount: getTaskCountForDate(date)
    });
  }
  
  // 添加当月天数
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const isCurrentDay = isSameDay(date, new Date());
    days.push({
      day: i,
      date: date.toISOString(),
      isCurrentMonth: true,
      isCurrentDay,
      taskCount: getTaskCountForDate(date),
      fullDate: formatDate(date)
    });
  }
  
  // 添加下月的天数，使日历完整
  const remainingDays = 42 - days.length; // 6行7列=42个格子
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      day: i,
      date: date.toISOString(),
      isCurrentMonth: false,
      isCurrentDay: false,
      taskCount: getTaskCountForDate(date)
    });
  }
  
  return days;
});

// 计算选中日期的任务列表
const selectedDayTasks = computed(() => {
  if (!selectedDay.value) return [];
  
  const selectedDate = new Date(selectedDay.value.date);
  return props.tasks.filter(task => {
    const taskDate = new Date(task.dueDate || task.createdAt);
    return isSameDay(taskDate, selectedDate);
  });
});

// 获取指定日期的任务数量
const getTaskCountForDate = (date) => {
  return props.tasks.filter(task => {
    const taskDate = new Date(task.dueDate || task.createdAt);
    return isSameDay(taskDate, date);
  }).length;
};

// 判断两个日期是否为同一天
const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// 格式化日期为 YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 月份导航
const navigateMonth = (direction) => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + direction,
    1
  );
};

// 点击日期处理
const handleDayClick = (day) => {
  selectedDay.value = day;
};

// 处理日期跳转
const handleJump = () => {
  if (jumpDate.value) {
    const targetDate = new Date(jumpDate.value);
    currentDate.value = targetDate;
    
    // 查找并选中跳转日期
    const targetDay = calendarDays.value.find(day => {
      const dayDate = new Date(day.date);
      return isSameDay(dayDate, targetDate);
    });
    
    if (targetDay) {
      selectedDay.value = targetDay;
    }
  }
};

// 监听任务变化，重新计算任务数量
watch(
  () => props.tasks,
  () => {
    // 任务变化时，日历会自动重新计算
  },
  { deep: true }
);
</script>

<style scoped>
.calendar-container {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.calendar-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #ebeef5;
  text-align: center;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.nav-btn {
  padding: 0.5rem 1rem;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 0.9rem;
}

.nav-btn:hover {
  background-color: #66b1ff;
}

.month-year {
  font-size: 1.2rem;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

/* 日期跳转功能样式 */
.calendar-jump {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1rem 0;
  justify-content: center;
  flex-wrap: wrap;
}

.calendar-jump label {
  font-size: 0.9rem;
  color: #606266;
  font-weight: 500;
}

.jump-date-input {
  padding: 0.5rem;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.3s;
}

.jump-date-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.jump-btn {
  padding: 0.5rem 1rem;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 0.9rem;
}

.jump-btn:hover {
  background-color: #66b1ff;
}

.jump-btn:active {
  background-color: #3a8ee6;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #ebeef5;
  margin-bottom: 1px;
}

.weekday {
  background-color: #f5f7fa;
  padding: 0.75rem;
  text-align: center;
  font-weight: 600;
  color: #606266;
  font-size: 0.9rem;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #ebeef5;
}

.calendar-day {
  background-color: white;
  padding: 1rem 0.5rem;
  text-align: center;
  min-height: 80px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calendar-day:hover {
  background-color: #ecf5ff;
}

.other-month {
  color: #c0c4cc;
  background-color: #fafafa;
}

.current-day {
  background-color: #409eff;
  color: white;
}

.has-tasks {
  background-color: #f0f9eb;
}

.has-tasks:hover {
  background-color: #e1f3d8;
}

.current-day.has-tasks {
  background-color: #67c23a;
}

.day-number {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.task-count {
  background-color: #f56c6c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.selected-day-tasks {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #ebeef5;
}

.selected-day-tasks h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 1rem;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  background-color: #f5f7fa;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
}

.task-info {
  display: flex;
  align-items: center;
  width: 100%;
}

.task-status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.task-status-indicator.status-todo {
  background-color: #e6a23c;
}

.task-status-indicator.status-in-progress {
  background-color: #409eff;
}

.task-status-indicator.status-done {
  background-color: #67c23a;
}

.task-details {
  flex: 1;
}

.task-details .task-title {
  font-weight: 500;
  color: #303133;
  margin-bottom: 0.25rem;
}

.task-details .task-description {
  font-size: 0.85rem;
  color: #606266;
  font-style: italic;
}

.no-tasks {
  text-align: center;
  padding: 2rem;
  color: #909399;
  font-style: italic;
  background-color: #fafafa;
  border-radius: 6px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .calendar-container {
    padding: 1rem;
  }
  
  .calendar-day {
    padding: 0.5rem 0.25rem;
    min-height: 60px;
  }
  
  .day-number {
    font-size: 0.9rem;
  }
  
  .task-count {
    width: 16px;
    height: 16px;
    font-size: 0.7rem;
  }
}
</style>