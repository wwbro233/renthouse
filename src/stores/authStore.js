import { computed, reactive } from 'vue'
import { assetUrl } from '../utils/assets'

const STORAGE_KEY = 'link-house-auth'

const defaultUsers = [
  {
    id: 'seed-1',
    phone: '18512345678',
    name: '小谷粒',
    nickname: '谷粒会员',
    avatar: assetUrl('avatars/avatar-default.jpg'),
    points: 15
  }
]

const state = reactive({
  users: [],
  currentPhone: null,
  pending: {
    phone: '',
    code: '',
    expires: 0
  }
})

const isBrowser = typeof window !== 'undefined'

const loadFromStorage = () => {
  if (!isBrowser) {
    state.users = [...defaultUsers]
    state.currentPhone = null
    return
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      state.users = [...defaultUsers]
      state.currentPhone = null
      return
    }
    const parsed = JSON.parse(raw)
    state.users = Array.isArray(parsed.users) && parsed.users.length ? parsed.users : [...defaultUsers]
    state.currentPhone = parsed.currentPhone || null
  } catch (error) {
    console.warn('authStore: failed to load from storage', error)
    state.users = [...defaultUsers]
    state.currentPhone = null
  }
}

const persist = () => {
  if (!isBrowser) return
  const payload = {
    users: state.users,
    currentPhone: state.currentPhone
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

const avatarPool = [
  'avatars/avatar-default.jpg',
  'avatars/avatar-review-1.jpg',
  'avatars/avatar-review-2.jpg',
  'avatars/avatar-landlord.jpg'
]

const generateAvatar = (phone = '') => {
  const hash = [...phone].reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const key = avatarPool[hash % avatarPool.length]
  return assetUrl(key)
}

const generateCode = () => `${Math.floor(100000 + Math.random() * 900000)}`

const findUser = (phone) => state.users.find((user) => user.phone === phone)

const registerUser = ({ phone, name }) => {
  const trimmedPhone = phone?.trim()
  if (!trimmedPhone) {
    return { success: false, message: '请输入手机号' }
  }
  if (!/^1\d{10}$/.test(trimmedPhone)) {
    return { success: false, message: '请输入正确的 11 位手机号' }
  }
  if (findUser(trimmedPhone)) {
    return { success: false, message: '该手机号已注册，请直接登录' }
  }
  const user = {
    id: `user-${Date.now()}`,
    phone: trimmedPhone,
    name: name?.trim() || `谷粒用户${trimmedPhone.slice(-4)}`,
    nickname: '谷粒计划新成员',
    avatar: generateAvatar(trimmedPhone),
    points: 0
  }
  state.users.push(user)
  persist()
  return { success: true, user }
}

const requestVerifyCode = (phone) => {
  const trimmedPhone = phone?.trim()
  if (!trimmedPhone) {
    return { success: false, message: '请输入手机号' }
  }
  const user = findUser(trimmedPhone)
  if (!user) {
    return { success: false, reason: 'not_registered', message: '手机号尚未注册' }
  }
  const code = generateCode()
  state.pending = {
    phone: trimmedPhone,
    code,
    expires: Date.now() + 2 * 60 * 1000
  }
  return { success: true, code }
}

const verifyCode = (phone, code) => {
  const trimmedPhone = phone?.trim()
  const trimmedCode = code?.trim()
  if (!trimmedPhone || !trimmedCode) {
    return { success: false, message: '请输入验证码' }
  }
  if (!/^1\d{10}$/.test(trimmedPhone)) {
    return { success: false, message: '手机号格式错误' }
  }
  if (state.pending.phone !== trimmedPhone) {
    return { success: false, message: '请重新获取验证码' }
  }
  if (Date.now() > state.pending.expires) {
    state.pending = { phone: '', code: '', expires: 0 }
    return { success: false, message: '验证码已过期，请重新获取' }
  }
  if (state.pending.code !== trimmedCode) {
    return { success: false, message: '验证码不正确' }
  }
  const user = findUser(trimmedPhone)
  if (!user) {
    return { success: false, message: '账号不存在，请先注册' }
  }
  state.currentPhone = trimmedPhone
  state.pending = { phone: '', code: '', expires: 0 }
  persist()
  return { success: true, user }
}

const logout = () => {
  state.currentPhone = null
  persist()
}

const currentUser = computed(() => {
  if (!state.currentPhone) return null
  return findUser(state.currentPhone) || null
})

const isAuthenticated = computed(() => !!currentUser.value)

const resetPending = () => {
  state.pending = { phone: '', code: '', expires: 0 }
}

if (state.users.length === 0) {
  loadFromStorage()
}

export const useAuthStore = () => ({
  state,
  currentUser,
  isAuthenticated,
  registerUser,
  requestVerifyCode,
  verifyCode,
  logout,
  resetPending
})
