import { computed, reactive } from 'vue'

const STORAGE_KEY = 'link-house-wallet'

const state = reactive({
  wallets: {} // { userPhone: { balance, points, transactions } }
})

const isBrowser = typeof window !== 'undefined'

// 从 localStorage 加载钱包数据
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

// 持久化到 localStorage
const persist = () => {
  if (!isBrowser) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.wallets))
}

// 获取或创建用户钱包
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

// 生成交易ID
const generateTransactionId = () => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `TXN${timestamp}${random}`
}

// 添加交易记录
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

// 充值
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

// 提现
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

// 支付
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

// 退款
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

// 赚取积分
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

// 使用积分
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

// 获取交易记录
const getTransactions = (userPhone, filter = 'all') => {
  const wallet = getUserWallet(userPhone)
  if (!wallet) return []

  if (filter === 'all') {
    return wallet.transactions
  }

  return wallet.transactions.filter(t => t.type === filter)
}

// 交易类型文本映射
const transactionTypeMap = {
  recharge: '充值',
  withdraw: '提现',
  payment: '支付',
  refund: '退款',
  points_earn: '积分获得',
  points_use: '积分使用'
}

// 交易状态文本映射
const transactionStatusMap = {
  pending: '处理中',
  completed: '已完成',
  failed: '失败'
}

// 获取交易类型文本
const getTransactionTypeText = (type) => transactionTypeMap[type] || type

// 获取交易状态文本
const getTransactionStatusText = (status) => transactionStatusMap[status] || status

// 获取交易类型图标
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

// 获取交易类型颜色
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

// 统计数据
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

// 初始化加载
if (Object.keys(state.wallets).length === 0) {
  loadFromStorage()
}

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
  getTransactionTypeText,
  getTransactionStatusText,
  getTransactionTypeIcon,
  getTransactionTypeColor,
  walletStats
})

