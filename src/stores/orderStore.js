import { computed, reactive } from 'vue'

const STORAGE_KEY = 'link-house-orders'

const state = reactive({
  orders: []
})

const isBrowser = typeof window !== 'undefined'

// 从 localStorage 加载订单
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

// 持久化到 localStorage
const persist = () => {
  if (!isBrowser) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.orders))
}

// 生成订单号
const generateOrderNo = () => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `ORD${timestamp}${random}`
}

// 创建订单
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

// 获取用户的订单列表
const getUserOrders = (userPhone) => {
  if (!userPhone) return []
  return state.orders.filter(order => order.userPhone === userPhone)
}

// 获取订单详情
const getOrderById = (orderId) => {
  return state.orders.find(order => order.id === orderId)
}

// 更新订单状态
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

// 取消订单
const cancelOrder = (orderId) => {
  return updateOrderStatus(orderId, 'cancelled')
}

// 删除订单
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

// 批量删除已取消的订单
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

// 订单状态文本映射
const statusTextMap = {
  pending: '待确认',
  confirmed: '已确认',
  processing: '服务中',
  completed: '已完成',
  cancelled: '已取消'
}

// 订单状态类型映射（Element Plus tag type）
const statusTypeMap = {
  pending: 'warning',
  confirmed: 'primary',
  processing: 'info',
  completed: 'success',
  cancelled: 'info'
}

// 获取订单状态文本
const getStatusText = (status) => statusTextMap[status] || status

// 获取订单状态类型
const getStatusType = (status) => statusTypeMap[status] || 'info'

// 统计信息
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

// 初始化加载
if (state.orders.length === 0) {
  loadFromStorage()
}

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

