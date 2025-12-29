# 任务管理系统

## 项目简介

这是一个基于 Vue 3 开发的任务管理系统，支持用户个性化管理任务，具备添加、编辑、删除、状态切换、筛选与统计等核心功能。该项目是高校《ASP.NET程序设计》课程期末大作业。

## 技术栈

- **前端框架**：Vue 3 (Composition API + `<script setup>`)
- **路由管理**：Vue Router 4
- **UI 设计**：HTML5 + CSS3 + JavaScript
- **数据存储**：localStorage
- **构建工具**：Vite
- **响应式布局**：Flex + Grid

## 核心功能

### 1. 任务管理
- ✅ 任务添加：输入标题，点击添加按钮
- ✅ 任务编辑：双击标题进入编辑模式
- ✅ 任务删除：带确认模态框的安全删除
- ✅ 状态切换：支持待办/进行中/已完成

### 2. 筛选与统计
- ✅ 条件筛选：按状态筛选任务
- ✅ 数据统计：实时显示任务数量和完成率
- ✅ 可视化图表：饼图展示任务分布

### 3. 响应式设计
- ✅ PC端适配：≥1920×1080
- ✅ 移动端适配：375×667
- ✅ 流畅的交互体验

## 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 公共组件
│   ├── TaskInput.vue        # 任务输入表单
│   ├── TaskList.vue         # 任务列表容器
│   └── TaskStatsPanel.vue   # 统计面板
├── views/           # 页面级组件
│   ├── HomeView.vue         # 首页 - 任务列表与操作区
│   ├── StatsView.vue        # 统计页 - 可视化任务分布
│   └── AboutView.vue        # 关于页 - 系统说明与作者信息
├── utils/           # 工具函数
│   └── storage.js           # localStorage 封装
├── App.vue          # 根组件
└── main.js          # 入口文件
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3000 启动，并自动打开浏览器。

### 3. 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录下。

## 组件说明

### TaskInput.vue
- **功能**：任务输入表单
- **交互**：输入标题，回车或点击按钮添加
- **事件**：`task-added` - 任务添加成功时触发

### TaskList.vue
- **功能**：任务列表展示与管理
- **交互**：状态切换、双击编辑、删除确认
- **事件**：`task-updated`、`task-deleted`

### TaskStatsPanel.vue
- **功能**：任务统计卡片
- **数据**：总任务数、已完成数、进行中数、待办数、完成率

## 数据结构

### 任务对象

```javascript
{
  id: string,           // 唯一标识
  title: string,        // 任务标题
  status: string,       // 状态：todo/in-progress/done
  createdAt: string,    // 创建时间
  updatedAt: string     // 更新时间
}
```

## 开发规范

### 代码规范
- **文件命名**：短横线命名法（如 `task-item.vue`）
- **CSS 规范**：组件内样式使用 `scoped`
- **JavaScript 规范**：小驼峰命名（如 `addTask`）
- **常量命名**：大写下划线（如 `TASK_STATUS`）

### 提交规范
- 提交信息清晰明了
- 遵循 Angular 提交规范
- 每次提交只包含一个功能点

## 浏览器兼容性

- Chrome (最新版)
- Edge (最新版)
- Firefox (最新版)

## 作者信息

- **学生姓名**：欧阳明
- **学号**：5720232802
- **班级**：软金231
- **课程**：ASP.NET程序设计
- **日期**：2025年12月

## 许可证

MIT License

## 致谢

感谢老师的指导和同学们的帮助！
