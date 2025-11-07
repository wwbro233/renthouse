/**
 * 我的钱包页面组件
 * 提供充值、提现、积分管理、交易记录查看等功能
 */
<script setup>
// Vue核心功能导入
import { computed, ref } from 'vue'
// 路由功能
import { useRouter } from 'vue-router'
// Element Plus消息和确认框组件
import { ElMessage, ElMessageBox } from 'element-plus'
// 用户认证状态管理
import { useAuthStore } from '../stores/authStore'
// 钱包状态管理
import { useWalletStore } from '../stores/walletStore'

// 初始化路由实例
const router = useRouter()
// 获取用户认证store实例
const authStore = useAuthStore()
// 获取钱包store实例
const walletStore = useWalletStore()

// 当前激活的标签页：all(全部)、recharge(充值)、withdraw(提现)、payment(支付)、refund(退款)、points(积分)
const activeTab = ref('all')
// 充值对话框显示状态
const rechargeDialogVisible = ref(false)
// 提现对话框显示状态
const withdrawDialogVisible = ref(false)
// 充值金额
const rechargeAmount = ref('')
// 提现金额
const withdrawAmount = ref('')
// 是否处于选择模式（用于批量删除）
const isSelectMode = ref(false)
// 已选中的交易记录ID列表
const selectedTransactions = ref([])

/**
 * 快捷充值金额选项
 * 提供6个常用充值金额供用户快速选择
 */
const quickRechargeAmounts = [100, 200, 500, 1000, 2000, 5000]

/**
 * 获取用户钱包信息计算属性
 * 根据登录状态获取当前用户的钱包数据（余额、积分等）
 * @returns {Object|null} 钱包对象或null（未登录时）
 */
const userWallet = computed(() => {
  if (!authStore.isAuthenticated.value) return null
  return walletStore.getUserWallet(authStore.state.currentPhone)
})

/**
 * 获取交易记录计算属性
 * 根据登录状态和当前选中的标签页筛选交易记录
 * @returns {Array} 交易记录数组
 */
const transactions = computed(() => {
  if (!authStore.isAuthenticated.value) return []
  return walletStore.getTransactions(authStore.state.currentPhone, activeTab.value)
})

/**
 * 格式化日期函数
 * 将日期字符串转换为中文本地化格式
 * @param {string} dateStr - 日期字符串
 * @returns {string} 格式化后的日期字符串（如：2024/01/01 12:00）
 */
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * 处理充值操作
 * 验证充值金额并确认后执行充值操作
 * 充值100元可获赠10谷粒点
 */
const handleRecharge = () => {
  // 验证充值金额
  if (!rechargeAmount.value || rechargeAmount.value <= 0) {
    ElMessage.warning('请输入充值金额')
    return
  }

  const amount = Number(rechargeAmount.value)
  
  // 显示确认对话框
  ElMessageBox.confirm(
    `确认充值 ¥${amount} 到账户吗？充值100元可获赠10谷粒点。`,
    '确认充值',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'success'
    }
  ).then(() => {
    // 执行充值操作
    const result = walletStore.recharge(authStore.state.currentPhone, amount)
    if (result.success) {
      ElMessage.success(result.message)
      rechargeDialogVisible.value = false
      rechargeAmount.value = ''
    } else {
      ElMessage.error(result.message)
    }
  }).catch(() => {})
}

/**
 * 处理快捷充值按钮点击
 * 将选中的快捷金额填入充值输入框
 * @param {number} amount - 充值金额
 */
const handleQuickRecharge = (amount) => {
  rechargeAmount.value = amount
}

/**
 * 处理提现操作
 * 验证提现金额和余额后执行提现操作
 * 提现将在1-3个工作日内到账
 */
const handleWithdraw = () => {
  // 验证提现金额
  if (!withdrawAmount.value || withdrawAmount.value <= 0) {
    ElMessage.warning('请输入提现金额')
    return
  }

  const amount = Number(withdrawAmount.value)
  
  // 验证余额是否充足
  if (amount > userWallet.value.balance) {
    ElMessage.error('余额不足')
    return
  }

  // 显示确认对话框
  ElMessageBox.confirm(
    `确认提现 ¥${amount} 吗？预计1-3个工作日到账。`,
    '确认提现',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 执行提现操作
    const result = walletStore.withdraw(authStore.state.currentPhone, amount)
    if (result.success) {
      ElMessage.success(result.message)
      withdrawDialogVisible.value = false
      withdrawAmount.value = ''
    } else {
      ElMessage.error(result.message)
    }
  }).catch(() => {})
}

/**
 * 处理每日签到操作
 * 随机获得5-10积分的签到奖励
 */
const handleSignIn = () => {
  // 随机生成5-10积分
  const randomPoints = Math.floor(Math.random() * 5) + 5
  const result = walletStore.earnPoints(
    authStore.state.currentPhone,
    randomPoints,
    `每日签到奖励`
  )
  if (result.success) {
    ElMessage.success(result.message)
  } else {
    ElMessage.error(result.message)
  }
}

/**
 * 处理积分兑换余额操作
 * 使用100谷粒点兑换10元余额
 */
const handleExchangePoints = () => {
  const points = 100 // 兑换需要的积分
  const amount = 10 // 兑换获得的金额
  
  // 验证积分是否充足
  if (userWallet.value.points < points) {
    ElMessage.error('积分不足')
    return
  }
  
  // 显示确认对话框
  ElMessageBox.confirm(
    `确认使用 ${points} 谷粒点兑换 ¥${amount} 吗？`,
    '积分兑换',
    {
      confirmButtonText: '确认兑换',
      cancelButtonText: '取消',
      type: 'success'
    }
  ).then(() => {
    // 扣除积分
    const useResult = walletStore.usePoints(
      authStore.state.currentPhone,
      points,
      `兑换余额 ¥${amount}`
    )
    
    if (useResult.success) {
      // 增加余额
      const addResult = walletStore.recharge(authStore.state.currentPhone, amount)
      if (addResult.success) {
        ElMessage.success('兑换成功')
      }
    } else {
      ElMessage.error(useResult.message)
    }
  }).catch(() => {})
}

/**
 * 切换选择模式
 * 开启/关闭批量删除交易记录的选择模式
 */
const toggleSelectMode = () => {
  isSelectMode.value = !isSelectMode.value
  // 关闭选择模式时清空选中项
  if (!isSelectMode.value) {
    selectedTransactions.value = []
  }
}

/**
 * 切换单条交易记录的选中状态
 * @param {string} transactionId - 交易记录ID
 */
const toggleSelectTransaction = (transactionId) => {
  const index = selectedTransactions.value.indexOf(transactionId)
  if (index > -1) {
    // 已选中，则取消选中
    selectedTransactions.value.splice(index, 1)
  } else {
    // 未选中，则添加到选中列表
    selectedTransactions.value.push(transactionId)
  }
}

/**
 * 全选/取消全选交易记录
 * 如果已全选则清空，否则选中所有交易记录
 */
const toggleSelectAll = () => {
  if (selectedTransactions.value.length === transactions.value.length) {
    selectedTransactions.value = []
  } else {
    selectedTransactions.value = transactions.value.map(t => t.id)
  }
}

/**
 * 删除单条交易记录
 * @param {string} transactionId - 交易记录ID
 */
const handleDeleteTransaction = (transactionId) => {
  ElMessageBox.confirm(
    '确认删除这条交易记录吗？此操作不可恢复。',
    '删除交易记录',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const result = walletStore.deleteTransaction(authStore.state.currentPhone, transactionId)
    if (result.success) {
      ElMessage.success(result.message)
    } else {
      ElMessage.error(result.message)
    }
  }).catch(() => {})
}

/**
 * 批量删除选中的交易记录
 * 至少需要选中一条记录才能执行删除操作
 */
const handleBatchDelete = () => {
  // 验证是否有选中的记录
  if (selectedTransactions.value.length === 0) {
    ElMessage.warning('请先选择要删除的交易记录')
    return
  }
  
  // 显示确认对话框
  ElMessageBox.confirm(
    `确认删除选中的 ${selectedTransactions.value.length} 条交易记录吗？此操作不可恢复。`,
    '批量删除',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 执行批量删除
    const result = walletStore.deleteTransactions(
      authStore.state.currentPhone,
      selectedTransactions.value
    )
    if (result.success) {
      ElMessage.success(result.message)
      selectedTransactions.value = []
      isSelectMode.value = false
    } else {
      ElMessage.error(result.message)
    }
  }).catch(() => {})
}
</script>

<template>
  <!-- 我的钱包页面容器 -->
  <div class="page-wrapper">
    <!-- 页面标题和面包屑导航 -->
    <div class="page-title">
      <div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/my">我的</el-breadcrumb-item>
          <el-breadcrumb-item>我的钱包</el-breadcrumb-item>
        </el-breadcrumb>
        <h2>我的钱包</h2>
      </div>
    </div>

    <!-- 未登录状态：显示登录引导 -->
    <div v-if="!authStore.isAuthenticated.value" class="empty-state">
      <el-empty description="请先登录查看钱包">
        <el-button type="primary" @click="router.push('/login')">去登录</el-button>
      </el-empty>
    </div>

    <!-- 已登录状态：显示钱包内容 -->
    <template v-else>
      <!-- 钱包卡片区：余额卡片和积分卡片 -->
      <div class="wallet-cards">
        <!-- 账户余额卡片：显示余额和充值提现操作 -->
        <el-card class="balance-card">
          <div class="balance-header">
            <span>账户余额</span>
            <el-icon><Wallet /></el-icon>
          </div>
          <div class="balance-amount">¥{{ userWallet.balance.toFixed(2) }}</div>
          <div class="balance-actions">
            <el-button type="primary" @click="rechargeDialogVisible = true">
              <el-icon><Plus /></el-icon>
              充值
            </el-button>
            <el-button @click="withdrawDialogVisible = true">
              <el-icon><Minus /></el-icon>
              提现
            </el-button>
          </div>
        </el-card>

        <!-- 谷粒点卡片：显示积分和签到兑换操作 -->
        <el-card class="points-card">
          <div class="points-header">
            <span>谷粒点</span>
            <el-icon><TrophyBase /></el-icon>
          </div>
          <div class="points-amount">{{ userWallet.points }}</div>
          <div class="points-actions">
            <el-button size="small" type="warning" plain @click="handleSignIn">
              <el-icon><Calendar /></el-icon>
              每日签到
            </el-button>
            <el-button size="small" type="success" plain @click="handleExchangePoints">
              <el-icon><Present /></el-icon>
              兑换余额
            </el-button>
          </div>
          <div class="points-tip">
            💡 100谷粒点 = ¥10
          </div>
        </el-card>
      </div>

      <!-- 交易记录区 -->
      <div class="section-card">
        <!-- 交易记录头部：标题和操作按钮 -->
        <div class="section-header">
          <h3>交易记录</h3>
          <div class="section-actions">
            <span>共 {{ transactions.length }} 条</span>
            <!-- 进入批量删除模式按钮 -->
            <el-button 
              v-if="!isSelectMode && transactions.length > 0" 
              size="small" 
              type="danger" 
              plain
              @click="toggleSelectMode"
            >
              <el-icon><Delete /></el-icon>
              批量删除
            </el-button>
            <!-- 批量删除模式下的操作按钮 -->
            <template v-if="isSelectMode">
              <el-button size="small" @click="toggleSelectAll">
                {{ selectedTransactions.length === transactions.length ? '取消全选' : '全选' }}
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                :disabled="selectedTransactions.length === 0"
                @click="handleBatchDelete"
              >
                删除选中 ({{ selectedTransactions.length }})
              </el-button>
              <el-button size="small" @click="toggleSelectMode">取消</el-button>
            </template>
          </div>
        </div>

        <!-- 交易类型筛选标签页 -->
        <el-tabs v-model="activeTab" @tab-change="selectedTransactions = []">
          <el-tab-pane label="全部" name="all"></el-tab-pane>
          <el-tab-pane label="充值" name="recharge"></el-tab-pane>
          <el-tab-pane label="提现" name="withdraw"></el-tab-pane>
          <el-tab-pane label="支付" name="payment"></el-tab-pane>
          <el-tab-pane label="退款" name="refund"></el-tab-pane>
          <el-tab-pane label="积分" name="points"></el-tab-pane>
        </el-tabs>

        <!-- 空状态：无交易记录 -->
        <div v-if="transactions.length === 0" class="empty-state">
          <el-empty description="暂无交易记录" />
        </div>

        <!-- 交易记录列表 -->
        <div v-else class="transaction-list">
          <!-- 单条交易记录项 -->
          <div
            v-for="transaction in transactions"
            :key="transaction.id"
            class="transaction-item"
            :class="{ 
              'is-selected': selectedTransactions.includes(transaction.id),
              'is-select-mode': isSelectMode
            }"
            @click="isSelectMode && toggleSelectTransaction(transaction.id)"
          >
            <!-- 批量选择模式：复选框 -->
            <el-checkbox
              v-if="isSelectMode"
              :model-value="selectedTransactions.includes(transaction.id)"
              @change="toggleSelectTransaction(transaction.id)"
              @click.stop
            />
            <!-- 交易类型图标 -->
            <div class="transaction-icon">
              <el-icon
                :size="24"
                :color="walletStore.getTransactionTypeColor(transaction.type)"
              >
                <component :is="walletStore.getTransactionTypeIcon(transaction.type)" />
              </el-icon>
            </div>
            <!-- 交易信息：描述和时间 -->
            <div class="transaction-info">
              <div class="transaction-desc">{{ transaction.description }}</div>
              <div class="transaction-time">{{ formatDate(transaction.createdAt) }}</div>
            </div>
            <!-- 交易金额和状态 -->
            <div class="transaction-amount">
              <div
                class="amount"
                :style="{ 
                  color: ['recharge', 'refund', 'points_earn'].includes(transaction.type) 
                    ? '#52c41a' 
                    : '#ff4d4f' 
                }"
              >
                {{ ['recharge', 'refund', 'points_earn'].includes(transaction.type) ? '+' : '-' }}
                {{ transaction.amount > 0 ? `¥${transaction.amount.toFixed(2)}` : '' }}
                {{ transaction.points !== 0 ? `${transaction.points}点` : '' }}
              </div>
              <el-tag
                size="small"
                :type="transaction.status === 'completed' ? 'success' : transaction.status === 'failed' ? 'danger' : 'warning'"
              >
                {{ walletStore.getTransactionStatusText(transaction.status) }}
              </el-tag>
            </div>
            <!-- 删除按钮（非批量模式） -->
            <el-button
              v-if="!isSelectMode"
              type="danger"
              text
              size="small"
              @click.stop="handleDeleteTransaction(transaction.id)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </template>

    <!-- 充值对话框 -->
    <el-dialog
      v-model="rechargeDialogVisible"
      title="充值"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="recharge-dialog">
        <!-- 快捷充值金额按钮 -->
        <div class="quick-amounts">
          <el-button
            v-for="amount in quickRechargeAmounts"
            :key="amount"
            :type="rechargeAmount == amount ? 'primary' : ''"
            @click="handleQuickRecharge(amount)"
          >
            ¥{{ amount }}
          </el-button>
        </div>
        <!-- 充值金额输入框 -->
        <el-input
          v-model="rechargeAmount"
          type="number"
          placeholder="请输入充值金额"
          size="large"
          clearable
        >
          <template #prefix>¥</template>
        </el-input>
        <div class="recharge-tip">
          💡 充值100元赠送10谷粒点
        </div>
      </div>
      <template #footer>
        <el-button @click="rechargeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleRecharge">确认充值</el-button>
      </template>
    </el-dialog>

    <!-- 提现对话框 -->
    <el-dialog
      v-model="withdrawDialogVisible"
      title="提现"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="withdraw-dialog">
        <!-- 当前余额显示 -->
        <div class="current-balance">
          <span>当前余额：</span>
          <strong>¥{{ userWallet?.balance.toFixed(2) }}</strong>
        </div>
        <!-- 提现金额输入框 -->
        <el-input
          v-model="withdrawAmount"
          type="number"
          placeholder="请输入提现金额"
          size="large"
          clearable
        >
          <template #prefix>¥</template>
        </el-input>
        <div class="withdraw-tip">
          💡 提现将在1-3个工作日内到账
        </div>
      </div>
      <template #footer>
        <el-button @click="withdrawDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleWithdraw">确认提现</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.empty-state {
  padding: 60px 20px;
}

.wallet-cards {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
}

.balance-card,
.points-card {
  padding: 24px;
}

.balance-header,
.points-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  color: var(--gray-3);
  font-size: 14px;
}

.balance-header el-icon,
.points-header el-icon {
  font-size: 24px;
  opacity: 0.5;
}

.balance-amount {
  font-size: 42px;
  font-weight: 700;
  color: var(--gray-1);
  margin-bottom: 20px;
}

.points-amount {
  font-size: 36px;
  font-weight: 700;
  color: #faad14;
  margin-bottom: 16px;
}

.balance-actions {
  display: flex;
  gap: 12px;
}

.balance-actions .el-button {
  flex: 1;
}

.points-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.points-actions .el-button {
  flex: 1;
}

.points-tip {
  font-size: 12px;
  color: var(--gray-4);
  text-align: center;
  padding: 8px;
  background: rgba(250, 173, 20, 0.1);
  border-radius: 8px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--gray-1);
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-actions span {
  font-size: 14px;
  color: var(--gray-4);
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--gray-7);
  border-radius: var(--border-radius-base);
  transition: var(--transition-base);
}

.transaction-item:hover {
  background: var(--gray-6);
}

.transaction-item.is-select-mode {
  cursor: pointer;
}

.transaction-item.is-selected {
  background: rgba(22, 119, 255, 0.1);
  border-left: 3px solid #1677ff;
}

.transaction-item.is-selected:hover {
  background: rgba(22, 119, 255, 0.15);
}

.transaction-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-6);
  border-radius: 50%;
}

.transaction-info {
  flex: 1;
}

.transaction-desc {
  font-size: 15px;
  color: var(--gray-1);
  margin-bottom: 4px;
}

.transaction-time {
  font-size: 12px;
  color: var(--gray-4);
}

.transaction-amount {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.transaction-amount .amount {
  font-size: 18px;
  font-weight: 600;
}

.recharge-dialog,
.withdraw-dialog {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quick-amounts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.recharge-tip,
.withdraw-tip {
  font-size: 12px;
  color: var(--gray-4);
  padding: 12px;
  background: var(--gray-7);
  border-radius: 8px;
  text-align: center;
}

.current-balance {
  padding: 12px 16px;
  background: var(--gray-7);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.current-balance span {
  color: var(--gray-3);
}

.current-balance strong {
  font-size: 20px;
  color: var(--gray-1);
}

@media (max-width: 991px) {
  .wallet-cards {
    grid-template-columns: 1fr;
  }

  .quick-amounts {
    grid-template-columns: repeat(2, 1fr);
  }

  .balance-actions,
  .points-actions {
    flex-direction: column;
  }
}

@media (max-width: 575px) {
  .transaction-item {
    flex-wrap: wrap;
  }

  .transaction-amount {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>

