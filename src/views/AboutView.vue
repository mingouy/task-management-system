<template>
  <section class="about-view">
    <h2 class="view-title">关于系统</h2>
    
    <div class="about-content">
      <!-- 系统介绍 -->
      <div class="about-section">
        <h3 class="section-title">系统简介</h3>
        <p class="section-text">
          这是一个基于 Vue 3 开发的任务管理系统，旨在帮助用户高效管理个人任务。
          系统支持任务的添加、编辑、删除、状态切换、筛选与统计等核心功能，
          采用现代化的响应式设计，适配 PC 和移动端设备。
        </p>
      </div>
      
      <!-- 技术栈 -->
      <div class="about-section">
        <h3 class="section-title">技术栈</h3>
        <ul class="tech-stack">
          <li class="tech-item">
            <span class="tech-name">Vue 3</span>
            <span class="tech-desc">前端框架（Composition API + &lt;script setup&gt;）</span>
          </li>
          <li class="tech-item">
            <span class="tech-name">Vue Router</span>
            <span class="tech-desc">路由管理</span>
          </li>
          <li class="tech-item">
            <span class="tech-name">HTML5 + CSS3</span>
            <span class="tech-desc">页面结构与样式</span>
          </li>
          <li class="tech-item">
            <span class="tech-name">localStorage</span>
            <span class="tech-desc">数据持久化存储</span>
          </li>
          <li class="tech-item">
            <span class="tech-name">Flex / Grid</span>
            <span class="tech-desc">响应式布局</span>
          </li>
        </ul>
      </div>
      
      <!-- 功能特性 -->
      <div class="about-section">
        <h3 class="section-title">功能特性</h3>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">➕</div>
            <div class="feature-info">
              <h4 class="feature-title">任务添加</h4>
              <p class="feature-desc">快速创建新任务，支持回车键快捷添加</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔄</div>
            <div class="feature-info">
              <h4 class="feature-title">状态管理</h4>
              <p class="feature-desc">支持待办、进行中、已完成状态切换</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">✏️</div>
            <div class="feature-info">
              <h4 class="feature-title">任务编辑</h4>
              <p class="feature-desc">双击任务标题即可编辑，支持回车或失焦保存</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🗑️</div>
            <div class="feature-info">
              <h4 class="feature-title">安全删除</h4>
              <p class="feature-desc">删除前弹出确认模态框，防止误操作</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔍</div>
            <div class="feature-info">
              <h4 class="feature-title">智能筛选</h4>
              <p class="feature-desc">支持按状态筛选任务，快速定位所需任务</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📊</div>
            <div class="feature-info">
              <h4 class="feature-title">数据统计</h4>
              <p class="feature-desc">实时展示任务数量、完成率等统计信息</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 作者信息 -->
      <div class="about-section">
        <h3 class="section-title">作者信息</h3>
        <div class="author-info">
          <div class="author-avatar">👨‍🎓</div>
          <div class="author-details">
            <h4 class="author-name">欧阳明</h4>
            <p class="author-student-id">学号：5720232802</p>
            <p class="author-class">班级：软金231</p>
            <p class="author-course">课程：ASP.NET程序设计</p>
            <p class="author-date">日期：2025年12月</p>
          </div>
        </div>
      </div>
      
      <!-- 版权信息 -->
      <div class="about-section copyright">
        <p class="copyright-text">
          © 2025 任务管理系统 - 高校《ASP.NET程序设计》课程期末大作业
        </p>
        <p class="copyright-text">
          基于 Vue 3 开发，采用 MIT 开源协议
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
// AboutView 组件
</script>

<style scoped>
.about-view {
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

.about-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.about-section {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #ebeef5;
}

.section-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #606266;
  margin-bottom: 0;
}

/* 技术栈样式 */
.tech-stack {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tech-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f5f7fa;
  border-radius: 6px;
  border-left: 4px solid #409eff;
  transition: transform 0.2s ease;
}

.tech-item:hover {
  transform: translateX(5px);
}

.tech-name {
  font-weight: 600;
  color: #303133;
}

.tech-desc {
  font-size: 0.9rem;
  color: #909399;
}

/* 功能特性样式 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.feature-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #f5f7fa;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.feature-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #409eff;
}

.feature-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.feature-info {
  flex: 1;
}

.feature-title {
  font-size: 1rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 0.5rem;
}

.feature-desc {
  font-size: 0.9rem;
  line-height: 1.4;
  color: #606266;
  margin: 0;
}

/* 作者信息样式 */
.author-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.author-avatar {
  font-size: 4rem;
  background-color: #ecf5ff;
  padding: 1rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.author-details {
  flex: 1;
}

.author-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 0.5rem;
}

.author-details p {
  font-size: 0.95rem;
  color: #606266;
  margin: 0.25rem 0;
  line-height: 1.5;
}

/* 版权信息样式 */
.copyright {
  text-align: center;
  background-color: #f5f7fa;
  border: none;
}

.copyright-text {
  font-size: 0.9rem;
  color: #909399;
  margin: 0.5rem 0;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .tech-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .author-info {
    flex-direction: column;
    text-align: center;
  }
}
</style>
