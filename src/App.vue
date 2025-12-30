<template>
  <div class="app" :class="{ 'dark-theme': isDarkMode }">
    <!-- 头部导航 -->
    <header class="app-header" :class="{ scrolled: isHeaderScrolled }">
      <h1 class="app-title">任务管理系统</h1>
      <div class="header-right">
        <nav class="app-nav">
          <router-link to="/" class="nav-link" active-class="active">首页</router-link>
          <router-link to="/stats" class="nav-link" active-class="active">统计</router-link>
          <router-link to="/about" class="nav-link" active-class="active">关于</router-link>
        </nav>
        <!-- 主题切换按钮 -->
        <button 
          class="theme-toggle-btn" 
          @click="toggleTheme"
          title="切换主题"
        >
          {{ isDarkMode ? '🌞' : '🌙' }}
        </button>
      </div>
    </header>
    
    <!-- 主内容区 -->
    <main class="app-main">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 深色模式状态
const isDarkMode = ref(false);
// 导航栏滚动状态
const isHeaderScrolled = ref(false);

// 初始化主题和滚动监听
onMounted(() => {
  // 从本地存储读取主题偏好
  const savedTheme = localStorage.getItem('task_manager_theme');
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark';
  } else {
    // 检测系统主题偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDarkMode.value = prefersDark;
  }
  
  // 应用主题
  applyTheme();
  
  // 添加滚动事件监听
  window.addEventListener('scroll', handleScroll);
});

// 组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

/**
 * 处理滚动事件
 */
const handleScroll = () => {
  isHeaderScrolled.value = window.scrollY > 50;
};

/**
 * 切换主题
 */
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  applyTheme();
  // 保存主题偏好到本地存储
  localStorage.setItem('task_manager_theme', isDarkMode.value ? 'dark' : 'light');
};

/**
 * 应用主题
 */
const applyTheme = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
  }
};
</script>

<style scoped>
/* 全局布局 */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecf1 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 导航栏样式 */
.app-header {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: headerSlideDown 0.5s ease-out forwards;
  position: sticky;
  top: 0;
  z-index: 100;
  height: 70px;
  transition: all 0.3s ease-in-out;
}

/* 导航栏滚动收缩效果 */
.app-header.scrolled {
  height: 50px;
  padding: 0.5rem 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

@keyframes headerSlideDown {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.app-title {
  font-size: 1.8rem;
  font-weight: 700;
  animation: titleFadeIn 0.5s ease-out 0.2s forwards;
  opacity: 0;
  transition: all 0.3s ease-in-out;
  white-space: nowrap;
}

/* 导航栏滚动时标题缩小 */
.app-header.scrolled .app-title {
  font-size: 1.4rem;
}

@keyframes titleFadeIn {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.app-nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  border-radius: 0;
  transition: all 0.3s ease-in-out;
  animation: navLinkFadeIn 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(-10px);
  position: relative;
  overflow: hidden;
  font-size: 15px;
  line-height: 1.2;
}

.nav-link:nth-child(1) {
  animation-delay: 0.3s;
}

.nav-link:nth-child(2) {
  animation-delay: 0.4s;
}

.nav-link:nth-child(3) {
  animation-delay: 0.5s;
}

@keyframes navLinkFadeIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 导航链接hover效果：文字颜色渐变 + 底部下划线展开 */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: white;
  transition: width 0.3s ease-in-out;
}

.nav-link:hover {
  color: rgba(255, 255, 255, 0.9);
  transform: translateY(0);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

.nav-link.active {
  font-weight: 600;
  color: white;
}

/* 主题切换按钮 */
.theme-toggle-btn {
  padding: 0.75rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  font-size: 1.2rem;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.theme-toggle-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.theme-toggle-btn:active {
  transform: scale(0.95);
  transition: transform 0.1s ease;
}

/* 主内容区 */
.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

/* 页面切换动画 */
.router-view-enter-active,
.router-view-leave-active {
  transition: all 0.4s ease-in-out;
}

.router-view-enter-from,
.router-view-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 元素进入动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 卡片悬停动画 */
.card-hover {
  transition: all 0.3s ease-in-out;
}

.card-hover:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 - 移动端适配 */
@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    height: auto;
  }
  
  .app-header.scrolled {
    height: auto;
    padding: 0.75rem 1rem;
  }
  
  .header-right {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
  
  .app-nav {
    gap: 1.5rem;
    width: 100%;
    justify-content: center;
  }
  
  .app-title {
    font-size: 1.5rem;
  }
  
  .app-header.scrolled .app-title {
    font-size: 1.3rem;
  }
  
  .app-main {
    padding: 1rem;
    gap: 16px;
  }
}
</style>

<style>
/* 全局样式重置 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #303133;
  background-color: #f5f7fa;
}

/* 12列栅格系统 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

/* 黄金分割比例布局 */
.main-content {
  grid-column: span 8; /* 主内容区占比约66.7% */
}

.sidebar {
  grid-column: span 4; /* 侧边栏占比约33.3% */
  width: 240px;
}

/* 卡片基础样式 */
.card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 24px;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

/* 文字排版层级 */
h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 16px;
}

h1 {
  font-size: 24px;
}

h2 {
  font-size: 20px;
}

h3 {
  font-size: 18px;
}

/* 正文样式 */
p, span, div {
  font-size: 15px;
  line-height: 1.5;
  color: #303133;
}

/* 辅助文字 */
.text-helper {
  font-size: 13px;
  line-height: 1.4;
  color: #909399;
}

/* 为所有卡片添加悬停效果 */
.stat-card,
.overview-card,
.task-item,
.task-input-container,
.stats-panel {
  transition: all 0.3s ease-in-out;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-card:hover,
.overview-card:hover,
.task-item:hover,
.task-input-container:hover,
.stats-panel:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

/* 按钮基础样式 */
button {
  transition: all 0.3s ease-in-out;
  font-size: 15px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  background-color: #409eff;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

button:active {
  transform: scale(0.95);
  transition: transform 0.1s ease;
}

/* 按钮变体 */
button.secondary {
  background-color: #f5f7fa;
  color: #606266;
  border: 1px solid #dcdfe6;
}

button.danger {
  background-color: #f56c6c;
}

/* 输入框样式 */
input,
select,
textarea {
  transition: all 0.3s ease-in-out;
  font-size: 15px;
  padding: 10px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  outline: none;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

input:focus,
select:focus,
textarea:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
  transform: translateY(-1px);
}

/* 图片样式 */
img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}

/* 页面元素淡入动画 */
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 列表项动画 */
.list-item {
  animation: listItemFadeIn 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes listItemFadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 骨架屏样式 */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeletonLoading 1.5s infinite;
  border-radius: 8px;
}

@keyframes skeletonLoading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 弹窗动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease-in-out;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 0.2s ease;
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
  transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

/* 动画延迟类 */
.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}

.delay-300 {
  animation-delay: 0.3s;
}

.delay-400 {
  animation-delay: 0.4s;
}

.delay-500 {
  animation-delay: 0.5s;
}
</style>
