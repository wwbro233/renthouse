/**
 * 订单状态管理 Store
 * 负责服务订单的创建、查询、状态更新、删除等功能
 * 数据持久化到 localStorage
 */
import { computed, reactive } from 'vue'

// localStorage 存储键名
const STORAGE_KEY = 'link-house-orders'

/**
 * 订单状态对象
 * orders: 所有订单列表
 */
const state = reactive({
  orders: []
})

// 判断是否在浏览器环境
const isBrowser = typeof window !== 'undefined'

/**
 * 从 localStorage 加载订单数据
 */
const loadFromStorage = () => {
  if (!isBrowser) {
    state.orders = []
    return
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      state.orders = []
      return
    }
    const parsed = JSON.parse(raw)
    state.orders = Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn('orderStore: failed to load from storage', error)
    state.orders = []
  }
}

/**
 * 持久化订单数据到 localStorage
 */
const persist = () => {
  if (!isBrowser) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.orders))
}

/**
 * 生成唯一的订单号
 * 格式：ORD + 时间戳 + 4位随机数
 * @returns {string} 订单号
 */
const generateOrderNo = () => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `ORD${timestamp}${random}`
}

/**
 * 创建新订单
 * @param {Object} orderData - 订单数据对象
 * @param {string} orderData.serviceTitle - 服务标题
 * @param {string} orderData.serviceCover - 服务封面图
 * @param {string} orderData.packageName - 套餐名称
 * @param {number} orderData.packagePrice - 套餐价格
 * @param {string} orderData.date - 预约日期
 * @param {string} orderData.time - 预约时间
 * @param {string} orderData.address - 服务地址
 * @param {string} orderData.contact - 联系人
 * @param {string} orderData.phone - 联系电话
 * @param {string} orderData.remark - 备注
 * @param {string} userPhone - 用户手机号
 * @returns {Object} 包含 success 和 message/order 的结果对象
 */
const createOrder = (orderData, userPhone) => {
  if (!userPhone) {
    return { success: false, message: '请先登录' }
  }

  const order = {
    id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    orderNo: generateOrderNo(),
    userPhone: userPhone,
    serviceTitle: orderData.serviceTitle,
    serviceCover: orderData.serviceCover,
    packageName: orderData.packageName,
    packagePrice: orderData.packagePrice,
    date: orderData.date,
    time: orderData.time,
    address: orderData.address,
    contact: orderData.contact,
    phone: orderData.phone,
    remark: orderData.remark || '',
    status: 'pending', // pending: 待确认, confirmed: 已确认, processing: 服务中, completed: 已完成, cancelled: 已取消
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  state.orders.unshift(order) // 添加到开头
  persist()

  return { success: true, order }
}

/**
 * 获取指定用户的订单列表
 * @param {string} userPhone - 用户手机号
 * @returns {Array} 订单列表数组
 */
const getUserOrders = (userPhone) => {
  if (!userPhone) return []
  return state.orders.filter(order => order.userPhone === userPhone)
}

/**
 * 根据订单ID获取订单详情
 * @param {string} orderId - 订单ID
 * @returns {Object|undefined} 订单对象或undefined
 */
const getOrderById = (orderId) => {
  return state.orders.find(order => order.id === orderId)
}

/**
 * 更新订单状态
 * @param {string} orderId - 订单ID
 * @param {string} status - 新的状态（pending/confirmed/processing/completed/cancelled）
 * @returns {Object} 包含 success 和 message/order 的结果对象
 */
const updateOrderStatus = (orderId, status) => {
  const order = state.orders.find(order => order.id === orderId)
  if (!order) {
    return { success: false, message: '订单不存在' }
  }

  order.status = status
  order.updatedAt = new Date().toISOString()
  persist()

  return { success: true, order }
}

/**
 * 取消订单
 * 将订单状态更新为 cancelled
 * @param {string} orderId - 订单ID
 * @returns {Object} 包含 success 和 message/order 的结果对象
 */
const cancelOrder = (orderId) => {
  return updateOrderStatus(orderId, 'cancelled')
}

/**
 * 删除订单
 * 只能删除已取消的订单
 * @param {string} orderId - 订单ID
 * @returns {Object} 包含 success 和 message 的结果对象
 */
const deleteOrder = (orderId) => {
  const orderIndex = state.orders.findIndex(order => order.id === orderId)
  if (orderIndex === -1) {
    return { success: false, message: '订单不存在' }
  }

  const order = state.orders[orderIndex]

  // 只允许删除已取消的订单
  if (order.status !== 'cancelled') {
    return { success: false, message: '只能删除已取消的订单' }
  }

  state.orders.splice(orderIndex, 1)
  persist()

  return { success: true, message: '订单已删除' }
}

/**
 * 批量删除指定用户的所有已取消订单
 * @param {string} userPhone - 用户手机号
 * @returns {Object} 包含 success、message 和 count 的结果对象
 */
const deleteCancelledOrders = (userPhone) => {
  if (!userPhone) {
    return { success: false, message: '请先登录' }
  }

  const beforeCount = state.orders.length
  state.orders = state.orders.filter(
    order => !(order.userPhone === userPhone && order.status === 'cancelled')
  )
  const afterCount = state.orders.length
  const deletedCount = beforeCount - afterCount

  if (deletedCount > 0) {
    persist()
    return { success: true, message: `已删除 ${deletedCount} 个已取消的订单`, count: deletedCount }
  }

  return { success: false, message: '没有可删除的已取消订单' }
}

/**
 * 订单状态文本映射表
 */
const statusTextMap = {
  pending: '待确认',
  confirmed: '已确认',
  processing: '服务中',
  completed: '已完成',
  cancelled: '已取消'
}

/**
 * 订单状态类型映射表（用于 Element Plus Tag 组件）
 */
const statusTypeMap = {
  pending: 'warning',
  confirmed: 'primary',
  processing: 'info',
  completed: 'success',
  cancelled: 'info'
}

/**
 * 获取订单状态的中文文本
 * @param {string} status - 订单状态
 * @returns {string} 中文文本
 */
const getStatusText = (status) => statusTextMap[status] || status

/**
 * 获取订单状态对应的标签类型
 * @param {string} status - 订单状态
 * @returns {string} Element Plus Tag 类型
 */
const getStatusType = (status) => statusTypeMap[status] || 'info'

/**
 * 订单统计数据计算属性
 * 统计各种状态的订单数量
 * @returns {Object} 包含各状态订单数量的统计对象
 */
const orderStats = computed(() => {
  return {
    total: state.orders.length,
    pending: state.orders.filter(o => o.status === 'pending').length,
    confirmed: state.orders.filter(o => o.status === 'confirmed').length,
    processing: state.orders.filter(o => o.status === 'processing').length,
    completed: state.orders.filter(o => o.status === 'completed').length,
    cancelled: state.orders.filter(o => o.status === 'cancelled').length
  }
})

// 初始化时从 localStorage 加载数据
if (state.orders.length === 0) {
  loadFromStorage()
}

/**
 * 导出 orderStore 实例
 * 提供订单相关的所有方法和状态
 */
export const useOrderStore = () => ({
  state,
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  deleteCancelledOrders,
  getStatusText,
  getStatusType,
  orderStats
})

