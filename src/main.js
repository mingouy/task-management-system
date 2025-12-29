import { createApp } from 'vue' // 导入Vue应用创建函数
import { createRouter, createWebHistory } from 'vue-router' // 导入Vue Router
import App from './App.vue' // 导入根组件

// 导入页面视图组件
import HomeView from './views/HomeView.vue' // 首页视图
import StatsView from './views/StatsView.vue' // 统计页视图
import AboutView from './views/AboutView.vue' // 关于页视图

/**
 * 定义应用路由配置
 * 每个路由映射到一个组件
 */
const routes = [
  { path: '/', name: 'home', component: HomeView }, // 首页路由
  { path: '/stats', name: 'stats', component: StatsView }, // 统计页路由
  { path: '/about', name: 'about', component: AboutView } // 关于页路由
]

/**
 * 创建路由实例
 * 使用HTML5 History模式
 */
const router = createRouter({
  history: createWebHistory(), // 启用HTML5 History API
  routes // 注册路由配置
})

/**
 * 创建Vue应用实例
 * 并挂载到DOM元素
 */
const app = createApp(App) // 创建应用实例
app.use(router) // 注册路由插件
app.mount('#app') // 挂载到#app元素
