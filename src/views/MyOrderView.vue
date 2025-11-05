<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '../stores/authStore'
import { useOrderStore } from '../stores/orderStore'

const router = useRouter()
const authStore = useAuthStore()
const orderStore = useOrderStore()

const activeTab = ref('all')

// 获取当前用户的订单
const userOrders = computed(() => {
  if (!authStore.isAuthenticated.value) return []
  const orders = orderStore.getUserOrders(authStore.state.currentPhone)
  
  // 根据 tab 筛选
  if (activeTab.value === 'all') return orders
  return orders.filter(order => order.status === activeTab.value)
})

// 格式化日期
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

// 取消订单
const handleCancelOrder = (order) => {
  ElMessageBox.confirm(
    '确定要取消该订单吗？',
    '确认取消',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const result = orderStore.cancelOrder(order.id)
    if (result.success) {
      ElMessage.success('订单已取消')
    } else {
      ElMessage.error(result.message || '取消失败')
    }
  }).catch(() => {})
}

// 查看订单详情
const handleViewDetail = (order) => {
  ElMessageBox.alert(
    `
    <div style="line-height: 1.8;">
      <p><strong>订单号：</strong>${order.orderNo}</p>
      <p><strong>服务项目：</strong>${order.serviceTitle}</p>
      <p><strong>服务套餐：</strong>${order.packageName}</p>
      <p><strong>套餐价格：</strong>¥${order.packagePrice}</p>
      <p><strong>预约日期：</strong>${order.date}</p>
      <p><strong>预约时间：</strong>${order.time}</p>
      <p><strong>服务地址：</strong>${order.address}</p>
      <p><strong>联系人：</strong>${order.contact}</p>
      <p><strong>联系电话：</strong>${order.phone}</p>
      ${order.remark ? `<p><strong>备注：</strong>${order.remark}</p>` : ''}
      <p><strong>订单状态：</strong>${orderStore.getStatusText(order.status)}</p>
      <p><strong>创建时间：</strong>${formatDate(order.createdAt)}</p>
    </div>
    `,
    '订单详情',
    {
      confirmButtonText: '关闭',
      dangerouslyUseHTMLString: true
    }
  )
}

// 确认订单
const handleConfirmOrder = (order) => {
  ElMessageBox.confirm(
    '确认该订单已完成服务？',
    '确认完成',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'success'
    }
  ).then(() => {
    const result = orderStore.updateOrderStatus(order.id, 'completed')
    if (result.success) {
      ElMessage.success('订单已完成')
    } else {
      ElMessage.error(result.message || '操作失败')
    }
  }).catch(() => {})
}

// 修改订单状态（通用方法）
const handleChangeStatus = (order) => {
  const statusOptions = [
    { value: 'pending', label: '待确认', disabled: order.status === 'pending' },
    { value: 'confirmed', label: '已确认', disabled: order.status === 'confirmed' },
    { value: 'processing', label: '服务中', disabled: order.status === 'processing' },
    { value: 'completed', label: '已完成', disabled: order.status === 'completed' },
    { value: 'cancelled', label: '已取消', disabled: order.status === 'cancelled' }
  ]

  const html = `
    <div style="text-align: left; line-height: 1.8;">
      <p style="margin-bottom: 12px; color: #606266;">
        <strong>当前状态：</strong>
        <span style="color: #409EFF;">${orderStore.getStatusText(order.status)}</span>
      </p>
      <p style="margin-bottom: 8px;"><strong>选择新状态：</strong></p>
      <div id="status-selector" style="display: flex; flex-direction: column; gap: 8px;">
        ${statusOptions.map(option => `
          <label style="display: flex; align-items: center; cursor: ${option.disabled ? 'not-allowed' : 'pointer'}; opacity: ${option.disabled ? '0.5' : '1'};">
            <input 
              type="radio" 
              name="newStatus" 
              value="${option.value}" 
              ${option.disabled ? 'disabled' : ''}
              ${order.status === option.value ? 'checked' : ''}
              style="margin-right: 8px;"
            />
            <span>${option.label}</span>
          </label>
        `).join('')}
      </div>
      <p style="margin-top: 12px; font-size: 12px; color: #909399;">
        💡 提示：修改状态后将立即生效
      </p>
    </div>
  `

  ElMessageBox.confirm(html, `修改订单状态 - ${order.orderNo}`, {
    confirmButtonText: '确认修改',
    cancelButtonText: '取消',
    type: 'warning',
    dangerouslyUseHTMLString: true,
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        const selected = document.querySelector('input[name="newStatus"]:checked')
        if (selected && selected.value !== order.status) {
          const newStatus = selected.value
          const result = orderStore.updateOrderStatus(order.id, newStatus)
          if (result.success) {
            ElMessage.success(`订单状态已更新为：${orderStore.getStatusText(newStatus)}`)
            done()
          } else {
            ElMessage.error(result.message || '更新失败')
            done()
          }
        } else {
          ElMessage.info('未选择新状态或状态未改变')
          done()
        }
      } else {
        done()
      }
    }
  }).catch(() => {})
}

// 快捷状态更新方法
const handleQuickStatus = (order, newStatus, actionText) => {
  ElMessageBox.confirm(
    `确认将订单状态修改为"${orderStore.getStatusText(newStatus)}"吗？`,
    actionText,
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const result = orderStore.updateOrderStatus(order.id, newStatus)
    if (result.success) {
      ElMessage.success(`订单已${actionText}`)
    } else {
      ElMessage.error(result.message || '操作失败')
    }
  }).catch(() => {})
}

// 删除单个订单
const handleDeleteOrder = (order) => {
  ElMessageBox.confirm(
    `确认删除订单"${order.orderNo}"吗？删除后将无法恢复。`,
    '删除订单',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'error',
      autofocus: false
    }
  ).then(() => {
    const result = orderStore.deleteOrder(order.id)
    if (result.success) {
      ElMessage.success('订单已删除')
    } else {
      ElMessage.error(result.message || '删除失败')
    }
  }).catch(() => {})
}

// 批量删除已取消的订单
const handleDeleteAllCancelled = () => {
  const cancelledOrders = userOrders.value.filter(o => o.status === 'cancelled')
  
  if (cancelledOrders.length === 0) {
    ElMessage.warning('没有已取消的订单')
    return
  }

  ElMessageBox.confirm(
    `确认删除全部 ${cancelledOrders.length} 个已取消的订单吗？删除后将无法恢复。`,
    '批量删除',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'error',
      autofocus: false
    }
  ).then(() => {
    const result = orderStore.deleteCancelledOrders(authStore.state.currentPhone)
    if (result.success) {
      ElMessage.success(result.message)
    } else {
      ElMessage.error(result.message || '删除失败')
    }
  }).catch(() => {})
}

// 统计数据
const stats = computed(() => {
  if (!authStore.isAuthenticated.value) {
    return { total: 0, pending: 0, confirmed: 0, processing: 0, completed: 0 }
  }
  const orders = orderStore.getUserOrders(authStore.state.currentPhone)
  return {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length
  }
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-title">
      <div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/my">我的</el-breadcrumb-item>
          <el-breadcrumb-item>我的订单</el-breadcrumb-item>
        </el-breadcrumb>
        <h2>我的订单</h2>
      </div>
      <el-tag type="success">共 {{ stats.total }} 个订单</el-tag>
    </div>

    <div class="stats-row">
      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon size="32" color="#faad14"><Clock /></el-icon>
          <div>
            <div class="stat-value">{{ stats.pending }}</div>
            <div class="stat-label">待确认</div>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon size="32" color="#1677ff"><InfoFilled /></el-icon>
          <div>
            <div class="stat-value">{{ stats.confirmed }}</div>
            <div class="stat-label">已确认</div>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon size="32" color="#722ed1"><Tools /></el-icon>
          <div>
            <div class="stat-value">{{ stats.processing }}</div>
            <div class="stat-label">服务中</div>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon size="32" color="#52c41a"><CircleCheck /></el-icon>
          <div>
            <div class="stat-value">{{ stats.completed }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </div>
      </el-card>
    </div>

    <div class="section-card">
      <div class="tabs-header">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="全部订单" name="all"></el-tab-pane>
          <el-tab-pane label="待确认" name="pending"></el-tab-pane>
          <el-tab-pane label="已确认" name="confirmed"></el-tab-pane>
          <el-tab-pane label="服务中" name="processing"></el-tab-pane>
          <el-tab-pane label="已完成" name="completed"></el-tab-pane>
          <el-tab-pane label="已取消" name="cancelled"></el-tab-pane>
        </el-tabs>
        
        <!-- 批量删除按钮（仅在已取消标签时显示） -->
        <div v-if="activeTab === 'cancelled' && userOrders.length > 0" class="batch-actions">
          <el-button 
            type="danger" 
            plain 
            size="small"
            @click="handleDeleteAllCancelled"
          >
            <el-icon><Delete /></el-icon>
            清空已取消订单
          </el-button>
        </div>
      </div>

      <div v-if="!authStore.isAuthenticated.value" class="empty-state">
        <el-empty description="请先登录查看订单">
          <el-button type="primary" @click="router.push('/login')">去登录</el-button>
        </el-empty>
      </div>

      <div v-else-if="userOrders.length === 0" class="empty-state">
        <el-empty description="暂无订单记录">
          <el-button type="primary" @click="router.push('/service')">预约服务</el-button>
        </el-empty>
      </div>

      <div v-else class="order-list">
        <el-card v-for="order in userOrders" :key="order.id" class="order-card" shadow="hover">
          <div class="order-header">
            <div class="order-info">
              <span class="order-no">订单号：{{ order.orderNo }}</span>
              <span class="order-time">{{ formatDate(order.createdAt) }}</span>
            </div>
            <el-tag :type="orderStore.getStatusType(order.status)" effect="dark">
              {{ orderStore.getStatusText(order.status) }}
            </el-tag>
          </div>

          <div class="order-body">
            <el-image
              :src="order.serviceCover"
              fit="cover"
              class="order-cover"
            >
              <template #error>
                <div class="image-slot">
                  <el-icon><PictureFilled /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="order-detail">
              <h4>{{ order.serviceTitle }}</h4>
              <p class="package-info">
                <el-tag size="small">{{ order.packageName }}</el-tag>
                <span class="price">¥{{ order.packagePrice }}</span>
              </p>
              <p class="service-info">
                <el-icon><Calendar /></el-icon>
                {{ order.date }} {{ order.time }}
              </p>
              <p class="service-info">
                <el-icon><Location /></el-icon>
                {{ order.address }}
              </p>
              <p class="service-info">
                <el-icon><User /></el-icon>
                {{ order.contact }} - {{ order.phone }}
              </p>
            </div>
          </div>

          <div class="order-footer">
            <el-button size="small" @click="handleViewDetail(order)">
              <el-icon><View /></el-icon>
              查看详情
            </el-button>
            
            <!-- 修改状态按钮 -->
            <el-button 
              size="small" 
              type="warning"
              plain
              @click="handleChangeStatus(order)"
            >
              <el-icon><Edit /></el-icon>
              修改状态
            </el-button>

            <!-- 待确认状态的操作 -->
            <template v-if="order.status === 'pending'">
              <el-button
                size="small"
                type="primary"
                @click="handleQuickStatus(order, 'confirmed', '确认订单')"
              >
                <el-icon><Select /></el-icon>
                确认订单
              </el-button>
              <el-button
                size="small"
                type="danger"
                plain
                @click="handleCancelOrder(order)"
              >
                <el-icon><Close /></el-icon>
                取消订单
              </el-button>
            </template>

            <!-- 已确认状态的操作 -->
            <template v-if="order.status === 'confirmed'">
              <el-button
                size="small"
                type="primary"
                @click="handleQuickStatus(order, 'processing', '开始服务')"
              >
                <el-icon><VideoPlay /></el-icon>
                开始服务
              </el-button>
              <el-button
                size="small"
                type="danger"
                plain
                @click="handleCancelOrder(order)"
              >
                <el-icon><Close /></el-icon>
                取消订单
              </el-button>
            </template>

            <!-- 服务中状态的操作 -->
            <template v-if="order.status === 'processing'">
              <el-button
                size="small"
                type="success"
                @click="handleConfirmOrder(order)"
              >
                <el-icon><CircleCheck /></el-icon>
                确认完成
              </el-button>
            </template>

            <!-- 已完成状态的操作 -->
            <template v-if="order.status === 'completed'">
              <el-button
                size="small"
                type="primary"
                plain
              >
                <el-icon><Star /></el-icon>
                再次预约
              </el-button>
            </template>

            <!-- 已取消状态的操作 -->
            <template v-if="order.status === 'cancelled'">
              <el-button
                size="small"
                type="danger"
                @click="handleDeleteOrder(order)"
              >
                <el-icon><Delete /></el-icon>
                删除订单
              </el-button>
            </template>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.tabs-header {
  position: relative;
}

.batch-actions {
  position: absolute;
  right: 0;
  top: 8px;
  z-index: 1;
}

.stat-card {
  cursor: default;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--gray-1);
  line-height: 1;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 13px;
  color: var(--gray-3);
}

.empty-state {
  padding: 60px 20px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.order-card {
  transition: var(--transition-base);
}

.order-card:hover {
  transform: translateY(-2px);
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--gray-6);
  margin-bottom: 16px;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.order-no {
  font-weight: 600;
  color: var(--gray-1);
  font-size: 14px;
}

.order-time {
  font-size: 12px;
  color: var(--gray-4);
}

.order-body {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.order-cover {
  width: 120px;
  height: 120px;
  border-radius: var(--border-radius-base);
  flex-shrink: 0;
}

.image-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: var(--gray-6);
  color: var(--gray-4);
  font-size: 32px;
}

.order-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-detail h4 {
  margin: 0;
  font-size: 16px;
  color: var(--gray-1);
}

.package-info {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #ff6b35;
}

.service-info {
  margin: 0;
  font-size: 13px;
  color: var(--gray-3);
  display: flex;
  align-items: center;
  gap: 6px;
}

.order-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid var(--gray-6);
}

@media (max-width: 991px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .order-body {
    flex-direction: column;
  }

  .order-cover {
    width: 100%;
    height: 180px;
  }
}

@media (max-width: 575px) {
  .stats-row {
    grid-template-columns: 1fr;
  }

  .order-footer {
    flex-wrap: wrap;
  }

  .order-footer .el-button {
    flex: 1;
  }
}
</style>

