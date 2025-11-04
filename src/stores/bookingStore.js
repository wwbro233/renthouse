import { reactive } from 'vue'
import { myAppointments as seedAppointments } from '../data/mockData'

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

const addBooking = (booking) => {
  state.bookings.unshift({
    id: `bk-${Date.now()}`,
    title: booking.title,
    type: booking.type || '约看',
    time: booking.time,
    status: booking.status || '待确认',
    cover: booking.cover || 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=420&q=80',
    address: booking.address || '地址待确认',
    contactName: booking.contactName,
    contactPhone: booking.contactPhone,
    remark: booking.remark || ''
  })
  state.dialogVisible = false
  state.preset = null
}

const openBookingDialog = (preset) => {
  state.preset = preset || null
  state.dialogVisible = true
}

const closeBookingDialog = () => {
  state.dialogVisible = false
}

const updateBookingStatus = (id, status) => {
  const target = state.bookings.find((item) => item.id === id)
  if (target) target.status = status
}

const removeBooking = (id) => {
  const index = state.bookings.findIndex((item) => item.id === id)
  if (index !== -1) state.bookings.splice(index, 1)
}

export const useBookingStore = () => ({
  state,
  addBooking,
  openBookingDialog,
  closeBookingDialog,
  updateBookingStatus,
  removeBooking
})
