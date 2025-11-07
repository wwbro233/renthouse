/**
 * 用户认证状态管理 Store
 * 负责用户注册、登录、登出、用户信息管理等功能
 * 数据持久化到 localStorage
 */
import { computed, reactive } from 'vue'
import { assetUrl } from '../utils/assets'
import { useWalletStore } from './walletStore'

// localStorage 存储键名
const STORAGE_KEY = 'link-house-auth'

/**
 * 默认用户数据（种子数据）
 * 用于演示和测试
 */
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

/**
 * 认证状态对象
 * - users: 所有注册用户列表
 * - currentPhone: 当前登录用户的手机号
 * - pending: 待验证的验证码信息
 */
const state = reactive({
  users: [],
  currentPhone: null,
  pending: {
    phone: '',
    code: '',
    expires: 0
  }
})

// 判断是否在浏览器环境
const isBrowser = typeof window !== 'undefined'

/**
 * 从 localStorage 加载认证数据
 * 如果加载失败或无数据，使用默认用户数据
 */
const loadFromStorage = () => {
  // 非浏览器环境，使用默认数据
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

/**
 * 持久化认证数据到 localStorage
 */
const persist = () => {
  if (!isBrowser) return
  const payload = {
    users: state.users,
    currentPhone: state.currentPhone
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

/**
 * 头像池
 * 用于为新注册用户随机分配头像
 */
const avatarPool = [
  'avatars/avatar-default.jpg',
  'avatars/avatar-review-1.jpg',
  'avatars/avatar-review-2.jpg',
  'avatars/avatar-landlord.jpg'
]

/**
 * 根据手机号生成头像
 * 通过手机号哈希值从头像池中选择一个头像
 * @param {string} phone - 手机号
 * @returns {string} 头像URL
 */
const generateAvatar = (phone = '') => {
  const hash = [...phone].reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const key = avatarPool[hash % avatarPool.length]
  return assetUrl(key)
}

/**
 * 生成6位数字验证码
 * @returns {string} 6位数字验证码
 */
const generateCode = () => `${Math.floor(100000 + Math.random() * 900000)}`

/**
 * 根据手机号查找用户
 * @param {string} phone - 手机号
 * @returns {Object|undefined} 用户对象或undefined
 */
const findUser = (phone) => state.users.find((user) => user.phone === phone)

/**
 * 用户注册
 * @param {Object} param - 注册参数
 * @param {string} param.phone - 手机号
 * @param {string} param.name - 用户昵称
 * @returns {Object} 包含 success 和 message/user 的结果对象
 */
const registerUser = ({ phone, name }) => {
  const trimmedPhone = phone?.trim()
  // 验证手机号
  if (!trimmedPhone) {
    return { success: false, message: '请输入手机号' }
  }
  if (!/^1\d{10}$/.test(trimmedPhone)) {
    return { success: false, message: '请输入正确的 11 位手机号' }
  }
  // 检查手机号是否已注册
  if (findUser(trimmedPhone)) {
    return { success: false, message: '该手机号已注册，请直接登录' }
  }
  // 创建新用户
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

/**
 * 请求发送验证码
 * 生成验证码并保存到待验证状态中，有效期2分钟
 * @param {string} phone - 手机号
 * @returns {Object} 包含 success 和 message/code 的结果对象
 */
const requestVerifyCode = (phone) => {
  const trimmedPhone = phone?.trim()
  if (!trimmedPhone) {
    return { success: false, message: '请输入手机号' }
  }
  // 检查用户是否已注册
  const user = findUser(trimmedPhone)
  if (!user) {
    return { success: false, reason: 'not_registered', message: '手机号尚未注册' }
  }
  // 生成验证码并设置有效期
  const code = generateCode()
  state.pending = {
    phone: trimmedPhone,
    code,
    expires: Date.now() + 2 * 60 * 1000 // 2分钟有效期
  }
  return { success: true, code }
}

/**
 * 验证验证码并登录
 * @param {string} phone - 手机号
 * @param {string} code - 验证码
 * @returns {Object} 包含 success 和 message/user 的结果对象
 */
const verifyCode = (phone, code) => {
  const trimmedPhone = phone?.trim()
  const trimmedCode = code?.trim()
  // 验证输入
  if (!trimmedPhone || !trimmedCode) {
    return { success: false, message: '请输入验证码' }
  }
  if (!/^1\d{10}$/.test(trimmedPhone)) {
    return { success: false, message: '手机号格式错误' }
  }
  // 验证手机号是否匹配
  if (state.pending.phone !== trimmedPhone) {
    return { success: false, message: '请重新获取验证码' }
  }
  // 验证是否过期
  if (Date.now() > state.pending.expires) {
    state.pending = { phone: '', code: '', expires: 0 }
    return { success: false, message: '验证码已过期，请重新获取' }
  }
  // 验证验证码是否正确
  if (state.pending.code !== trimmedCode) {
    return { success: false, message: '验证码不正确' }
  }
  // 查找用户
  const user = findUser(trimmedPhone)
  if (!user) {
    return { success: false, message: '账号不存在，请先注册' }
  }
  // 登录成功
  state.currentPhone = trimmedPhone
  state.pending = { phone: '', code: '', expires: 0 }
  persist()
  return { success: true, user }
}

/**
 * 用户登出
 * 清除当前登录用户信息
 */
const logout = () => {
  state.currentPhone = null
  persist()
}

/**
 * 当前登录用户计算属性
 * 自动同步钱包的积分数据到用户信息
 * @returns {Object|null} 当前用户对象或null
 */
const currentUser = computed(() => {
  if (!state.currentPhone) return null
  const user = findUser(state.currentPhone)
  if (!user) return null

  // 同步钱包的积分到用户数据
  try {
    const walletStore = useWalletStore()
    const wallet = walletStore.getUserWallet(state.currentPhone)
    if (wallet) {
      user.points = wallet.points
    }
  } catch (error) {
    // 钱包store可能还未初始化，忽略错误
  }

  return user
})

/**
 * 用户是否已登录计算属性
 * @returns {boolean} 是否已登录
 */
const isAuthenticated = computed(() => !!currentUser.value)

/**
 * 重置待验证状态
 * 清除待验证的验证码信息
 */
const resetPending = () => {
  state.pending = { phone: '', code: '', expires: 0 }
}

/**
 * 更新用户资料
 * @param {Object} updates - 要更新的字段对象
 * @returns {Object} 包含 success 和 message/user 的结果对象
 */
const updateUserProfile = (updates) => {
  if (!state.currentPhone) {
    return { success: false, message: '未登录' }
  }
  const user = findUser(state.currentPhone)
  if (!user) {
    return { success: false, message: '用户不存在' }
  }

  // 允许更新的字段
  const allowedFields = ['name', 'nickname', 'avatar', 'gender', 'birthday', 'email', 'signature', 'password']

  Object.keys(updates).forEach(key => {
    if (allowedFields.includes(key) && updates[key] !== undefined) {
      user[key] = updates[key]
    }
  })

  persist()
  return { success: true, user }
}

// 初始化时从 localStorage 加载数据
if (state.users.length === 0) {
  loadFromStorage()
}

/**
 * 导出 authStore 实例
 * 提供用户认证相关的所有方法和状态
 */
export const useAuthStore = () => ({
  state,
  currentUser,
  isAuthenticated,
  registerUser,
  requestVerifyCode,
  verifyCode,
  logout,
  resetPending,
  updateUserProfile
})
