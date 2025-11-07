/**
 * 预约/约看状态管理 Store
 * 负责房源约看、活动报名等预约记录的管理
 * 使用种子数据（mockData）初始化
 */
import { reactive } from 'vue'
import { myAppointments as seedAppointments } from '../data/mockData'
import { assetUrl } from '../utils/assets'

/**
 * 预约状态对象
 * - bookings: 预约记录列表
 * - dialogVisible: 预约对话框是否可见
 * - preset: 预设的预约信息（用于预填表单）
 */
const state = reactive({
  bookings: seedAppointments.map((item, index) => ({
    id: `seed-${index}`,
    title: item.title,
    type: item.type || '约看',
    time: item.time,
    status: item.status || '待确认',
    cover: item.cover,
    address: item.address || '地址待确认',
    contactName: item.contactName || '平台客服',
    contactPhone: item.contactPhone || '',
    remark: item.remark || ''
  })),
  dialogVisible: false,
  preset: null
})

/**
 * 添加预约记录
 * @param {Object} booking - 预约信息对象
 * @param {string} booking.title - 标题
 * @param {string} booking.type - 类型（约看/报名等）
 * @param {string} booking.time - 预约时间
 * @param {string} booking.status - 状态
 * @param {string} booking.cover - 封面图
 * @param {string} booking.address - 地址
 * @param {string} booking.contactName - 联系人
 * @param {string} booking.contactPhone - 联系电话
 * @param {string} booking.remark - 备注
 */
const addBooking = (booking) => {
  state.bookings.unshift({
    id: `bk-${Date.now()}`,
    title: booking.title,
    type: booking.type || '约看',
    time: booking.time,
    status: booking.status || '待确认',
    cover: booking.cover || assetUrl('booking-default.jpg'),
    address: booking.address || '地址待确认',
    contactName: booking.contactName,
    contactPhone: booking.contactPhone,
    remark: booking.remark || ''
  })
  state.dialogVisible = false
  state.preset = null
}

/**
 * 打开预约对话框
 * @param {Object} preset - 预设的预约信息（可选）
 */
const openBookingDialog = (preset) => {
  state.preset = preset || null
  state.dialogVisible = true
}

/**
 * 关闭预约对话框
 */
const closeBookingDialog = () => {
  state.dialogVisible = false
}

/**
 * 更新预约状态
 * @param {string} id - 预约记录ID
 * @param {string} status - 新的状态
 */
const updateBookingStatus = (id, status) => {
  const target = state.bookings.find((item) => item.id === id)
  if (target) target.status = status
}

/**
 * 删除预约记录
 * @param {string} id - 预约记录ID
 */
const removeBooking = (id) => {
  const index = state.bookings.findIndex((item) => item.id === id)
  if (index !== -1) state.bookings.splice(index, 1)
}

/**
 * 导出 bookingStore 实例
 * 提供预约相关的所有方法和状态
 */
export const useBookingStore = () => ({
  state,
  addBooking,
  openBookingDialog,
  closeBookingDialog,
  updateBookingStatus,
  removeBooking
})
