<template>
  <div class="app">
    <!-- 头部导航 -->
    <header class="app-header">
      <h1 class="app-title">任务管理系统</h1>
      <nav class="app-nav">
        <router-link to="/" class="nav-link" active-class="active">首页</router-link>
        <router-link to="/stats" class="nav-link" active-class="active">统计</router-link>
        <router-link to="/about" class="nav-link" active-class="active">关于</router-link>
      </nav>
    </header>
    
    <!-- 主内容区 -->
    <main class="app-main">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
// App.vue 根组件
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.app-header {
  background-color: #409eff;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-title {
  font-size: 1.5rem;
  font-weight: 600;
}

.app-nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover,
.nav-link.active {
  background-color: rgba(255, 255, 255, 0.2);
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

/* 响应式设计 - 移动端适配 */
@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .app-nav {
    gap: 1rem;
  }
  
  .app-main {
    padding: 1rem;
  }
}
</style>
