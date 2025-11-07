/**
 * 钱包状态管理 Store
 * 负责用户钱包余额、积分、交易记录的管理
 * 数据持久化到 localStorage
 */
import { computed, reactive } from 'vue'

// localStorage 存储键名
const STORAGE_KEY = 'link-house-wallet'

/**
 * 钱包状态对象
 * wallets: 用户钱包映射 { userPhone: { balance, points, transactions } }
 */
const state = reactive({
  wallets: {}
})

// 判断是否在浏览器环境
const isBrowser = typeof window !== 'undefined'

/**
 * 从 localStorage 加载钱包数据
 */
const loadFromStorage = () => {
  if (!isBrowser) {
    state.wallets = {}
    return
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      state.wallets = {}
      return
    }
    const parsed = JSON.parse(raw)
    state.wallets = parsed || {}
  } catch (error) {
    console.warn('walletStore: failed to load from storage', error)
    state.wallets = {}
  }
}

/**
 * 持久化钱包数据到 localStorage
 */
const persist = () => {
  if (!isBrowser) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.wallets))
}

/**
 * 获取或创建用户钱包
 * 如果用户钱包不存在，自动创建一个新钱包（初始余额0元，积分15点）
 * @param {string} userPhone - 用户手机号
 * @returns {Object|null} 钱包对象或null
 */
const getUserWallet = (userPhone) => {
  if (!userPhone) return null

  if (!state.wallets[userPhone]) {
    state.wallets[userPhone] = {
      balance: 0, // 余额（元）
      points: 15, // 谷粒点（积分）
      transactions: [] // 交易记录
    }
    persist()
  }

  return state.wallets[userPhone]
}

/**
 * 生成唯一的交易ID
 * 格式：TXN + 时间戳 + 4位随机数
 * @returns {string} 交易ID
 */
const generateTransactionId = () => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `TXN${timestamp}${random}`
}

/**
 * 添加交易记录
 * @param {string} userPhone - 用户手机号
 * @param {Object} transaction - 交易信息对象
 * @param {string} transaction.type - 交易类型（recharge/withdraw/payment/refund/points_earn/points_use）
 * @param {number} transaction.amount - 交易金额
 * @param {number} transaction.points - 积分变动
 * @param {string} transaction.description - 交易描述
 * @param {string} transaction.status - 交易状态（pending/completed/failed）
 * @returns {Object} 新创建的交易记录对象
 */
const addTransaction = (userPhone, transaction) => {
  const wallet = getUserWallet(userPhone)
  if (!wallet) return

  const newTransaction = {
    id: generateTransactionId(),
    type: transaction.type, // recharge: 充值, withdraw: 提现, payment: 支付, refund: 退款, points_earn: 积分获得, points_use: 积分使用
    amount: transaction.amount,
    points: transaction.points || 0,
    description: transaction.description,
    status: transaction.status || 'completed', // pending: 处理中, completed: 已完成, failed: 失败
    createdAt: new Date().toISOString()
  }

  wallet.transactions.unshift(newTransaction)
  persist()

  return newTransaction
}

/**
 * 充值功能
 * 充值100元赠送10谷粒点
 * @param {string} userPhone - 用户手机号
 * @param {number} amount - 充值金额
 * @returns {Object} 包含 success、message、balance、points 的结果对象
 */
const recharge = (userPhone, amount) => {
  if (!userPhone) {
    return { success: false, message: '请先登录' }
  }

  if (!amount || amount <= 0) {
    return { success: false, message: '充值金额必须大于0' }
  }

  const wallet = getUserWallet(userPhone)
  wallet.balance += Number(amount)

  // 充值赠送积分（充值100元送10积分）
  const bonusPoints = Math.floor(amount / 10)
  if (bonusPoints > 0) {
    wallet.points += bonusPoints
  }

  // 添加交易记录
  addTransaction(userPhone, {
    type: 'recharge',
    amount: Number(amount),
    points: bonusPoints,
    description: `充值 ¥${amount}${bonusPoints > 0 ? `，赠送${bonusPoints}谷粒点` : ''}`,
    status: 'completed'
  })

  persist()

  return {
    success: true,
    message: `充值成功${bonusPoints > 0 ? `，赠送${bonusPoints}谷粒点` : ''}`,
    balance: wallet.balance,
    points: wallet.points
  }
}

/**
 * 提现功能
 * 申请提现，预计1-3个工作日到账
 * @param {string} userPhone - 用户手机号
 * @param {number} amount - 提现金额
 * @returns {Object} 包含 success、message、balance 的结果对象
 */
const withdraw = (userPhone, amount) => {
  if (!userPhone) {
    return { success: false, message: '请先登录' }
  }

  if (!amount || amount <= 0) {
    return { success: false, message: '提现金额必须大于0' }
  }

  const wallet = getUserWallet(userPhone)

  if (wallet.balance < amount) {
    return { success: false, message: '余额不足' }
  }

  wallet.balance -= Number(amount)

  // 添加交易记录
  addTransaction(userPhone, {
    type: 'withdraw',
    amount: Number(amount),
    description: `提现 ¥${amount}`,
    status: 'pending'
  })

  persist()

  return {
    success: true,
    message: '提现申请已提交，预计1-3个工作日到账',
    balance: wallet.balance
  }
}

/**
 * 支付功能
 * 使用钱包余额进行支付
 * @param {string} userPhone - 用户手机号
 * @param {number} amount - 支付金额
 * @param {string} description - 支付描述
 * @returns {Object} 包含 success、message、balance 的结果对象
 */
const payment = (userPhone, amount, description) => {
  if (!userPhone) {
    return { success: false, message: '请先登录' }
  }

  if (!amount || amount <= 0) {
    return { success: false, message: '支付金额必须大于0' }
  }

  const wallet = getUserWallet(userPhone)

  if (wallet.balance < amount) {
    return { success: false, message: '余额不足' }
  }

  wallet.balance -= Number(amount)

  // 添加交易记录
  addTransaction(userPhone, {
    type: 'payment',
    amount: Number(amount),
    description: description || `支付 ¥${amount}`,
    status: 'completed'
  })

  persist()

  return {
    success: true,
    message: '支付成功',
    balance: wallet.balance
  }
}

/**
 * 退款功能
 * 将款项退回到钱包余额
 * @param {string} userPhone - 用户手机号
 * @param {number} amount - 退款金额
 * @param {string} description - 退款描述
 * @returns {Object} 包含 success、message、balance 的结果对象
 */
const refund = (userPhone, amount, description) => {
  if (!userPhone) {
    return { success: false, message: '请先登录' }
  }

  if (!amount || amount <= 0) {
    return { success: false, message: '退款金额必须大于0' }
  }

  const wallet = getUserWallet(userPhone)
  wallet.balance += Number(amount)

  // 添加交易记录
  addTransaction(userPhone, {
    type: 'refund',
    amount: Number(amount),
    description: description || `退款 ¥${amount}`,
    status: 'completed'
  })

  persist()

  return {
    success: true,
    message: '退款成功',
    balance: wallet.balance
  }
}

/**
 * 赚取积分功能
 * 用于签到、活动奖励等场景
 * @param {string} userPhone - 用户手机号
 * @param {number} points - 积分数量
 * @param {string} description - 获得积分的描述
 * @returns {Object} 包含 success、message、points 的结果对象
 */
const earnPoints = (userPhone, points, description) => {
  if (!userPhone) {
    return { success: false, message: '请先登录' }
  }

  if (!points || points <= 0) {
    return { success: false, message: '积分必须大于0' }
  }

  const wallet = getUserWallet(userPhone)
  wallet.points += Number(points)

  // 添加交易记录
  addTransaction(userPhone, {
    type: 'points_earn',
    amount: 0,
    points: Number(points),
    description: description || `获得${points}谷粒点`,
    status: 'completed'
  })

  persist()

  return {
    success: true,
    message: `获得${points}谷粒点`,
    points: wallet.points
  }
}

/**
 * 使用积分功能
 * 用于积分兑换、抵扣等场景
 * @param {string} userPhone - 用户手机号
 * @param {number} points - 积分数量
 * @param {string} description - 使用积分的描述
 * @returns {Object} 包含 success、message、points 的结果对象
 */
const usePoints = (userPhone, points, description) => {
  if (!userPhone) {
    return { success: false, message: '请先登录' }
  }

  if (!points || points <= 0) {
    return { success: false, message: '积分必须大于0' }
  }

  const wallet = getUserWallet(userPhone)

  if (wallet.points < points) {
    return { success: false, message: '积分不足' }
  }

  wallet.points -= Number(points)

  // 添加交易记录
  addTransaction(userPhone, {
    type: 'points_use',
    amount: 0,
    points: -Number(points),
    description: description || `使用${points}谷粒点`,
    status: 'completed'
  })

  persist()

  return {
    success: true,
    message: `使用${points}谷粒点成功`,
    points: wallet.points
  }
}

/**
 * 获取交易记录
 * @param {string} userPhone - 用户手机号
 * @param {string} filter - 筛选类型（all/recharge/withdraw/payment/refund/points）
 * @returns {Array} 交易记录数组
 */
const getTransactions = (userPhone, filter = 'all') => {
  const wallet = getUserWallet(userPhone)
  if (!wallet) return []

  if (filter === 'all') {
    return wallet.transactions
  }

  return wallet.transactions.filter(t => t.type === filter)
}

/**
 * 删除单条交易记录
 * @param {string} userPhone - 用户手机号
 * @param {string} transactionId - 交易记录ID
 * @returns {Object} 包含 success 和 message 的结果对象
 */
const deleteTransaction = (userPhone, transactionId) => {
  if (!userPhone) {
    return { success: false, message: '请先登录' }
  }

  const wallet = getUserWallet(userPhone)
  if (!wallet) {
    return { success: false, message: '钱包不存在' }
  }

  const index = wallet.transactions.findIndex(t => t.id === transactionId)
  if (index === -1) {
    return { success: false, message: '交易记录不存在' }
  }

  // 删除交易记录
  wallet.transactions.splice(index, 1)
  persist()

  return {
    success: true,
    message: '删除成功'
  }
}

/**
 * 批量删除交易记录
 * @param {string} userPhone - 用户手机号
 * @param {Array} transactionIds - 交易记录ID数组
 * @returns {Object} 包含 success 和 message 的结果对象
 */
const deleteTransactions = (userPhone, transactionIds) => {
  if (!userPhone) {
    return { success: false, message: '请先登录' }
  }

  const wallet = getUserWallet(userPhone)
  if (!wallet) {
    return { success: false, message: '钱包不存在' }
  }

  // 过滤掉要删除的交易记录
  wallet.transactions = wallet.transactions.filter(
    t => !transactionIds.includes(t.id)
  )
  persist()

  return {
    success: true,
    message: `成功删除 ${transactionIds.length} 条记录`
  }
}

/**
 * 交易类型文本映射表
 */
const transactionTypeMap = {
  recharge: '充值',
  withdraw: '提现',
  payment: '支付',
  refund: '退款',
  points_earn: '积分获得',
  points_use: '积分使用'
}

/**
 * 交易状态文本映射表
 */
const transactionStatusMap = {
  pending: '处理中',
  completed: '已完成',
  failed: '失败'
}

/**
 * 获取交易类型的中文文本
 * @param {string} type - 交易类型
 * @returns {string} 中文文本
 */
const getTransactionTypeText = (type) => transactionTypeMap[type] || type

/**
 * 获取交易状态的中文文本
 * @param {string} status - 交易状态
 * @returns {string} 中文文本
 */
const getTransactionStatusText = (status) => transactionStatusMap[status] || status

/**
 * 获取交易类型对应的图标名称
 * @param {string} type - 交易类型
 * @returns {string} Element Plus 图标名称
 */
const getTransactionTypeIcon = (type) => {
  const iconMap = {
    recharge: 'Plus',
    withdraw: 'Minus',
    payment: 'ShoppingCart',
    refund: 'RefreshLeft',
    points_earn: 'TrophyBase',
    points_use: 'Present'
  }
  return iconMap[type] || 'DocumentCopy'
}

/**
 * 获取交易类型对应的颜色
 * @param {string} type - 交易类型
 * @returns {string} 颜色值
 */
const getTransactionTypeColor = (type) => {
  const colorMap = {
    recharge: '#52c41a',
    withdraw: '#ff4d4f',
    payment: '#1677ff',
    refund: '#52c41a',
    points_earn: '#faad14',
    points_use: '#722ed1'
  }
  return colorMap[type] || '#666666'
}

/**
 * 钱包统计数据计算属性
 * 统计所有用户的钱包总览数据
 * @returns {Object} 包含总用户数、总余额、总积分、总交易数
 */
const walletStats = computed(() => {
  const stats = {
    totalUsers: Object.keys(state.wallets).length,
    totalBalance: 0,
    totalPoints: 0,
    totalTransactions: 0
  }

  Object.values(state.wallets).forEach(wallet => {
    stats.totalBalance += wallet.balance
    stats.totalPoints += wallet.points
    stats.totalTransactions += wallet.transactions.length
  })

  return stats
})

// 初始化时从 localStorage 加载数据
if (Object.keys(state.wallets).length === 0) {
  loadFromStorage()
}

/**
 * 导出 walletStore 实例
 * 提供钱包相关的所有方法和状态
 */
export const useWalletStore = () => ({
  state,
  getUserWallet,
  recharge,
  withdraw,
  payment,
  refund,
  earnPoints,
  usePoints,
  getTransactions,
  deleteTransaction,
  deleteTransactions,
  getTransactionTypeText,
  getTransactionStatusText,
  getTransactionTypeIcon,
  getTransactionTypeColor,
  walletStats
})

