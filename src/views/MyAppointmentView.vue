/**
 * 我的约看页面组件
 * 提供约看记录和活动报名记录的查看、筛选和管理功能
 */
<script setup>
// Vue核心功能导入
import { computed, reactive } from 'vue'
// Element Plus消息组件
import { ElMessage } from 'element-plus'
// 预约信息状态管理
import { useBookingStore } from '../stores/bookingStore'
// 用户认证状态管理
import { useAuthStore } from '../stores/authStore'
// 路由功能
import { useRouter } from 'vue-router'

/**
 * 筛选条件对象
 * - keyword: 搜索关键词（房源/活动名称）
 * - status: 状态筛选（待确认、已确认、已完成等）
 */
const filters = reactive({
  keyword: '',
  status: ''
})

// 获取预约信息store实例
const bookingStore = useBookingStore()
// 获取用户认证store实例
const authStore = useAuthStore()
// 初始化路由实例
const router = useRouter()

/**
 * 筛选后的数据计算属性
 * 根据登录状态、关键词和状态筛选约看记录
 * @returns {Array} 筛选后的约看记录数组
 */
const filteredData = computed(() => {
  // 未登录返回空数组
  if (!authStore.isAuthenticated.value) {
    return []
  }
  let result = [...bookingStore.state.bookings]
  // 根据关键词筛选
  if (filters.keyword) {
    result = result.filter((item) =>
      item.title.toLowerCase().includes(filters.keyword.toLowerCase())
    )
  }
  // 根据状态筛选
  if (filters.status) {
    result = result.filter((item) => item.status === filters.status)
  }
  return result
})

/**
 * 导出记录处理函数
 * 当前功能暂未实现，显示提示信息
 */
const handleExport = () => {
  ElMessage.info('导出功能即将上线，敬请期待')
}

/**
 * 查看详情处理函数
 * 当前功能暂未实现，显示提示信息
 * @param {Object} row - 约看记录对象
 */
const handleView = (row) => {
  ElMessage.info(`查看「${row.title}」详情入口开发中`)
}

/**
 * 取消约看处理函数
 * 将约看记录状态更新为"已取消"
 * @param {Object} row - 约看记录对象
 */
const handleCancel = (row) => {
  // 验证是否已取消
  if (row.status === '已取消') {
    ElMessage.warning('该记录已取消')
    return
  }
  // 更新状态为已取消
  bookingStore.updateBookingStatus(row.id, '已取消')
  ElMessage.success(`已取消「${row.title}」预约`)
}

/**
 * 前往登录页面
 */
const goLogin = () => {
  router.push('/login')
}
</script>

<template>
  <!-- 我的约看页面容器 -->
  <div class="page-wrapper">
    <!-- 页面标题和面包屑导航 -->
    <div class="page-title">
      <div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/my">我的</el-breadcrumb-item>
          <el-breadcrumb-item>我的约看</el-breadcrumb-item>
        </el-breadcrumb>
        <h2>约看与报名记录</h2>
      </div>
      <!-- 导出记录按钮 -->
      <el-button type="primary" plain @click="handleExport">导出记录</el-button>
    </div>

    <!-- 约看记录列表区 -->
    <div class="section-card">
      <!-- 已登录状态：显示筛选和表格 -->
      <template v-if="authStore.isAuthenticated">
        <!-- 筛选器：关键词搜索和状态筛选 -->
        <div class="filters">
          <el-input
            v-model="filters.keyword"
            placeholder="搜索房源 / 活动"
            clearable
            prefix-icon="Search"
          />
          <el-select v-model="filters.status" placeholder="状态筛选" clearable>
            <el-option label="待确认" value="待确认" />
            <el-option label="已确认" value="已确认" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已报名" value="已报名" />
            <el-option label="已取消" value="已取消" />
          </el-select>
        </div>

        <!-- 约看记录表格 -->
        <el-table :data="filteredData" stripe>
          <!-- 封面图片列 -->
          <el-table-column label="图片" width="100">
            <template #default="scope">
              <el-image :src="scope.row.cover" class="thumb" fit="cover" />
            </template>
          </el-table-column>
          <!-- 标题列 -->
          <el-table-column prop="title" label="标题" min-width="220" />
          <!-- 地址列 -->
          <el-table-column prop="address" label="看房地址" min-width="200" />
          <!-- 类型列 -->
          <el-table-column prop="type" label="类型" width="110" />
          <!-- 时间列 -->
          <el-table-column prop="time" label="时间" width="180" />
          <!-- 状态列：根据状态显示不同颜色的标签 -->
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.status === '已取消' ? 'danger' : scope.row.status === '待确认' ? 'warning' : 'success'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- 操作列：查看详情和取消按钮 -->
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <el-button type="primary" text size="small" @click="handleView(scope.row)">
                查看详情
              </el-button>
              <el-button text size="small" @click="handleCancel(scope.row)">
                取消
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      
      <!-- 未登录状态：显示登录引导 -->
      <template v-else>
        <el-empty description="请先登录后查看约看记录">
          <el-button type="primary" @click="goLogin">去登录</el-button>
        </el-empty>
      </template>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.thumb {
  width: 84px;
  height: 56px;
  border-radius: var(--border-radius-sm);
}

@media (max-width: 991px) {
  .filters {
    flex-direction: column;
  }
}
</style>
