// 任务存储工具函数

// 存储键名
const TASK_STORAGE_KEY = 'task_management_system_tasks';

/**
 * 获取所有任务
 * @returns {Array} 任务列表
 */
export const getTasks = () => {
  try {
    const tasks = localStorage.getItem(TASK_STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('读取任务失败:', error);
    return [];
  }
};

/**
 * 保存任务列表
 * @param {Array} tasks 任务列表
 */
export const saveTasks = (tasks) => {
  try {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('保存任务失败:', error);
  }
};

/**
 * 添加新任务
 * @param {Object} task 任务对象
 * @returns {Array} 更新后的任务列表
 */
export const addTask = (task) => {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
  return tasks;
};

/**
 * 更新任务
 * @param {string} id 任务ID
 * @param {Object} updates 更新内容
 * @returns {Array} 更新后的任务列表
 */
export const updateTask = (id, updates) => {
  const tasks = getTasks();
  const index = tasks.findIndex(task => task.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates };
    saveTasks(tasks);
  }
  return tasks;
};

/**
 * 删除任务
 * @param {string} id 任务ID
 * @returns {Array} 更新后的任务列表
 */
export const deleteTask = (id) => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);
  saveTasks(filteredTasks);
  return filteredTasks;
};

/**
 * 生成唯一ID
 * @returns {string} 唯一ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * 任务状态枚举
 */
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done'
};

/**
 * 状态显示文本映射
 */
export const STATUS_TEXT = {
  [TASK_STATUS.TODO]: '待办',
  [TASK_STATUS.IN_PROGRESS]: '进行中',
  [TASK_STATUS.DONE]: '已完成'
};

/**
 * 任务优先级枚举
 */
export const TASK_PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

/**
 * 优先级显示文本映射
 */
export const PRIORITY_TEXT = {
  [TASK_PRIORITY.HIGH]: '高',
  [TASK_PRIORITY.MEDIUM]: '中',
  [TASK_PRIORITY.LOW]: '低'
};

/**
 * 优先级颜色映射
 */
export const PRIORITY_COLOR = {
  [TASK_PRIORITY.HIGH]: '#f56c6c',
  [TASK_PRIORITY.MEDIUM]: '#e6a23c',
  [TASK_PRIORITY.LOW]: '#67c23a'
};
