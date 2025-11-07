/**
 * 个人中心页面组件
 * 用户可以查看个人信息、快捷功能入口、会员计划、统计数据等
 * 未登录状态显示登录引导界面
 */
<script setup>
// Vue核心功能导入
import { computed } from 'vue'
// 路由功能导入
import { useRouter } from 'vue-router'
// Element Plus消息提示组件
import { ElMessage } from 'element-plus'
// 预约信息状态管理
import { useBookingStore } from '../stores/bookingStore'
// 用户认证状态管理
import { useAuthStore } from '../stores/authStore'
// 资源路径工具函数
import { assetUrl } from '../utils/assets'
// 智能图片组件
import SmartImage from '../components/SmartImage.vue'

// 初始化路由实例
const router = useRouter()
// 获取预约信息store实例
const bookingStore = useBookingStore()
// 获取用户认证store实例
const authStore = useAuthStore()

// 创建本地 computed 用于模板，判断用户是否已登录
const isAuthenticated = computed(() => authStore.isAuthenticated.value)

/**
 * 快捷入口列表
 * 包含9个常用功能的快捷入口，每个入口包含：
 * - id: 唯一标识
 * - label: 显示标签
 * - icon: Element Plus图标名称
 * - route: 路由路径（空字符串表示功能未开放）
 */
const shortcutList = [
  { id: 'wish', label: '想看', icon: 'Collection', route: '/my/want' },
  { id: 'foot', label: '足迹', icon: 'View', route: '/my/footprint' },
  { id: 'book', label: '约看', icon: 'Calendar', route: '/my/appointment' },
  { id: 'share', label: '拼租', icon: 'Connection', route: '/my/share' },
  { id: 'contract', label: '合同', icon: 'Document', route: '' },
  { id: 'bill', label: '账单', icon: 'Tickets', route: '' },
  { id: 'order', label: '订单', icon: 'List', route: '/my/orders' },
  { id: 'comment', label: '评价', icon: 'EditPen', route: '' },
  { id: 'wallet', label: '钱包', icon: 'Wallet', route: '/my/wallet' }
]

/**
 * 会员计划卡片列表
 * 展示不同的会员计划类型，每个卡片包含：
 * - id: 唯一标识
 * - title: 计划标题
 * - desc: 计划描述
 * - color: 背景颜色
 */
const planCards = [
  {
    id: 'time',
    title: '小谷粒时光计划',
    desc: '签约后可解锁会员权益',
    color: '#fef4d8'
  },
  {
    id: 'exclusive',
    title: '专属谷粒计划',
    desc: '你在谷粒的每一天都很珍贵',
    color: '#dbf6f0'
  }
]

/**
 * 会员权益列表
 * 展示会员可享受的特殊权益
 */
const benefits = [
  { title: '服务折扣', desc: '每住100天，折扣多一点' },
  { title: '免费换租', desc: '城市那么大，你不必讲究' }
]

/**
 * 家庭服务列表
 * 展示需要用户完成的服务项目（如实名认证等）
 */
const familyService = [
  {
    title: '代办',
    desc: '你还未进行实名认证',
    route: '/my/profile'
  }
]

/**
 * 统计数据计算属性
 * 根据用户登录状态动态计算各项统计数据
 * 未登录时所有数据显示为0
 * 已登录时显示真实数据（约看记录从bookingStore获取，其他为模拟数据）
 */
const statistics = computed(() => [
  {
    label: '想看房源',
    value: authStore.isAuthenticated.value ? 8 : 0
  },
  {
    label: '约看记录',
    value: authStore.isAuthenticated.value ? bookingStore.state.bookings.length : 0
  },
  {
    label: '服务预约',
    value: authStore.isAuthenticated.value ? 5 : 0
  },
  {
    label: '社区活动',
    value: authStore.isAuthenticated.value ? 2 : 0
  }
])

/**
 * 用户信息计算属性
 * 根据登录状态返回不同的用户信息：
 * - 未登录：返回游客信息，积分为0，使用默认头像
 * - 已登录：返回真实用户信息（姓名、积分、头像）
 */
const userInfo = computed(() => {
  const user = authStore.currentUser.value
  if (!user) {
    return {
      name: '游客',
      points: 0,
      avatar: assetUrl('avatars/avatar-default.jpg')
    }
  }
  return {
    name: user.name,
    points: user.points ?? 0,
    avatar: user.avatar || assetUrl('avatars/avatar-default.jpg')
  }
})

/**
 * 处理快捷入口点击事件
 * @param {Object} item - 快捷入口项对象
 */
const handleShortcut = (item) => {
  router.push(item.route)
}

/**
 * 处理登录按钮点击事件
 * 跳转到登录页面
 */
const handleLogin = () => {
  router.push('/login')
}

/**
 * 处理退出登录按钮点击事件
 * 调用authStore的登出方法，显示成功消息，并跳转到登录页
 */
const handleLogout = () => {
  authStore.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<template>
  <!-- 个人中心主容器 -->
  <div class="my-page">
    <!-- 页面头部：标题和登录状态 -->
    <div class="page-toggle">
      <span>我的</span>
      <!-- 已登录状态显示 -->
      <template v-if="isAuthenticated">
        <span class="status-pill">
          <el-icon><Select /></el-icon>
          已登录
        </span>
      </template>
      <!-- 未登录显示去登录按钮 -->
      <button v-else type="button" class="link-btn" @click="handleLogin">去登录</button>
    </div>

    <!-- 已登录状态显示的内容 -->
    <template v-if="isAuthenticated">
      <!-- 用户信息卡片区 -->
      <section class="profile-hero">
        <!-- 卡片头部：业主版标签和功能图标 -->
        <header>
          <div class="profile-tag">
            <el-icon><SwitchButton /></el-icon>
            业主版
          </div>
          <!-- 功能图标组：聊天、客服、设置 -->
          <div class="profile-icons">
            <el-icon size="20"><ChatDotRound /></el-icon>
            <el-icon size="20"><Headset /></el-icon>
            <el-icon size="20"><Setting /></el-icon>
          </div>
        </header>
        <!-- 用户信息：头像、昵称、谷粒点 -->
        <div class="profile-info">
          <SmartImage :src="userInfo.avatar" alt="avatar" class="profile-avatar" />
          <div>
            <h3>Hi，{{ userInfo.name }}</h3>
            <p>谷粒点 {{ userInfo.points }}</p>
          </div>
        </div>
      </section>

      <!-- 会员计划卡片区 -->
      <section class="plan-card">
        <!-- 循环渲染会员计划卡片，使用动态背景色 -->
        <article
          v-for="card in planCards"
          :key="card.id"
          :style="{ background: card.color }"
        >
          <div>
            <h4>{{ card.title }}</h4>
            <p>{{ card.desc }}</p>
          </div>
          <el-icon><ArrowRight /></el-icon>
        </article>
      </section>

      <!-- 快捷功能区 -->
      <section class="shortcut-grid">
        <header>
          <h3>我的家</h3>
          <span>感谢你选择谷粒</span>
        </header>
        <!-- 家庭服务卡片（实名认证等） -->
        <div class="family-card" v-for="item in familyService" :key="item.title">
          <div>
            <h4>{{ item.title }}</h4>
            <p>{{ item.desc }}</p>
          </div>
          <button type="button" @click="router.push(item.route)">
            <el-icon><ArrowRight /></el-icon>
          </button>
        </div>
        <!-- 快捷入口网格：想看、足迹、约看等9个功能入口 -->
        <div class="shortcut-wrap">
          <button
            v-for="item in shortcutList"
            :key="item.id"
            type="button"
            @click="handleShortcut(item)"
          >
            <el-icon size="20"><component :is="item.icon" /></el-icon>
            <span>{{ item.label }}</span>
          </button>
        </div>
      </section>

      <!-- 会员权益区 -->
      <section class="benefit-section">
        <header>
          <h3>专属谷粒计划</h3>
          <span>你在谷粒的每一天都很珍贵</span>
        </header>
        <!-- 循环渲染权益卡片 -->
        <article v-for="benefit in benefits" :key="benefit.title">
          <h4>{{ benefit.title }}</h4>
          <p>{{ benefit.desc }}</p>
        </article>
      </section>

      <!-- 统计数据区：想看房源、约看记录、服务预约、社区活动 -->
      <section class="statistics">
        <article v-for="stat in statistics" :key="stat.label">
          <strong>{{ stat.value }}</strong>
          <span>{{ stat.label }}</span>
        </article>
      </section>

      <!-- 操作按钮区：编辑资料和退出登录 -->
      <section class="action-row">
        <button type="button" @click="router.push('/my/profile')">编辑资料</button>
        <button type="button" class="secondary" @click="handleLogout">退出登录</button>
      </section>
    </template>

    <!-- 未登录状态显示的内容 -->
    <template v-else>
      <!-- 空状态页面：提示用户登录 -->
      <section class="empty-login">
        <el-icon><Unlock /></el-icon>
        <h3>您尚未登录</h3>
        <p>登录后即可查看收藏房源、预约记录、拼租信息等个性化内容。</p>
        <div class="buttons">
          <button type="button" @click="handleLogin">立即登录</button>
          <button
            type="button"
            class="secondary"
            @click="router.push({ path: '/login', query: { type: 'register' } })"
          >
            注册账号
          </button>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
/* ===== 主容器样式 ===== */
/* 个人中心页面主容器，使用flex布局垂直排列 */
.my-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 32px;
}

/* ===== 页面头部样式 ===== */
/* 页面标题和登录状态切换区域 */
.page-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #244b42;
}

/* 登录状态标签：圆角胶囊形状 */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  background: rgba(12, 159, 113, 0.12);
  color: #0c9f71;
  font-size: 12px;
}

/* 去登录链接按钮：透明背景 */
.link-btn {
  border: none;
  background: transparent;
  color: #0c9f71;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

/* ===== 用户信息卡片样式 ===== */
/* 用户信息主卡片：渐变绿色背景，带阴影 */
.profile-hero {
  background: linear-gradient(180deg, #94e5bc 0%, #c9f7e3 70%, #ffffff 100%);
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 18px 32px rgba(24, 102, 84, 0.16);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 卡片头部布局 */
.profile-hero header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 业主版标签 */
.profile-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  color: #1d5143;
}

/* 功能图标组 */
.profile-icons {
  display: flex;
  gap: 12px;
  color: rgba(29, 81, 67, 0.6);
}

/* 用户信息布局：头像+文字 */
.profile-info {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #1d5143;
}

/* 用户头像容器 */
.profile-avatar {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

/* 头像图片样式：圆形+白色边框 */
.profile-avatar :deep(img) {
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.75);
}

/* 用户昵称 */
.profile-info h3 {
  margin: 0;
  font-size: 20px;
}

/* 谷粒点数 */
.profile-info p {
  margin: 4px 0 0;
  font-size: 13px;
  opacity: 0.75;
}

/* ===== 会员计划卡片样式 ===== */
/* 计划卡片容器：网格布局 */
.plan-card {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 12px;
}

/* 单个计划卡片：圆角+阴影，使用动态背景色 */
.plan-card article {
  border-radius: 20px;
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #2a4f45;
  box-shadow: 0 16px 28px rgba(15, 65, 52, 0.12);
}

/* 计划标题 */
.plan-card h4 {
  margin: 0;
  font-size: 16px;
}

/* 计划描述 */
.plan-card p {
  margin: 6px 0 0;
  font-size: 13px;
  opacity: 0.7;
}

/* ===== 快捷功能区样式 ===== */
/* 快捷功能主容器：白色背景+圆角+阴影 */
.shortcut-grid {
  background: #ffffff;
  border-radius: 22px;
  padding: 18px;
  box-shadow: 0 16px 28px rgba(15, 65, 52, 0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 区块标题头部 */
.shortcut-grid header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #244b42;
}

.shortcut-grid header h3 {
  margin: 0;
  font-size: 18px;
}

.shortcut-grid header span {
  font-size: 12px;
  color: rgba(36, 75, 66, 0.6);
}

/* 家庭服务卡片（实名认证等） */
.family-card {
  background: rgba(12, 159, 113, 0.08);
  border-radius: 18px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #244b42;
}

.family-card h4 {
  margin: 0;
  font-size: 15px;
}

.family-card p {
  margin: 6px 0 0;
  font-size: 12px;
  color: rgba(36, 75, 66, 0.7);
}

/* 家庭服务卡片按钮 */
.family-card button {
  border: none;
  background: rgba(12, 159, 113, 0.18);
  color: #0c9f71;
  border-radius: 12px;
  padding: 8px 10px;
  cursor: pointer;
}

/* 快捷入口网格：5列布局 */
.shortcut-wrap {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

/* 快捷入口按钮：图标+文字垂直布局 */
.shortcut-wrap button {
  border: none;
  border-radius: 16px;
  background: rgba(12, 159, 113, 0.08);
  color: #244b42;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  cursor: pointer;
}

/* ===== 会员权益区样式 ===== */
/* 权益区主容器：白色背景+圆角+阴影 */
.benefit-section {
  background: #ffffff;
  border-radius: 22px;
  padding: 18px;
  box-shadow: 0 16px 28px rgba(15, 65, 52, 0.12);
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #244b42;
}

/* 区块标题 */
.benefit-section header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.benefit-section header h3 {
  margin: 0;
  font-size: 18px;
}

.benefit-section header span {
  font-size: 12px;
  color: rgba(36, 75, 66, 0.6);
}

/* 单个权益卡片 */
.benefit-section article {
  background: rgba(12, 159, 113, 0.08);
  border-radius: 18px;
  padding: 14px;
}

.benefit-section h4 {
  margin: 0;
  font-size: 16px;
}

.benefit-section p {
  margin: 6px 0 0;
  font-size: 13px;
  color: rgba(36, 75, 66, 0.75);
}

/* ===== 统计数据区样式 ===== */
/* 统计数据容器：4列网格布局 */
.statistics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  background: rgba(12, 159, 113, 0.12);
  border-radius: 22px;
  padding: 16px;
  color: #244b42;
}

/* 单个统计项：数字+标签垂直排列 */
.statistics article {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

/* 统计数字 */
.statistics strong {
  font-size: 18px;
}

/* 统计标签 */
.statistics span {
  font-size: 12px;
  opacity: 0.7;
}

/* ===== 操作按钮区样式 ===== */
/* 按钮容器：水平排列 */
.action-row {
  display: flex;
  gap: 12px;
}

/* 主按钮：渐变绿色背景 */
.action-row button {
  flex: 1;
  border: none;
  border-radius: 18px;
  padding: 12px;
  background: linear-gradient(135deg, #0acd88 0%, #09a47a 100%);
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
}

/* 次要按钮：浅色背景 */
.action-row button.secondary {
  background: rgba(12, 159, 113, 0.08);
  color: #244b42;
}

/* ===== 未登录空状态样式 ===== */
/* 空状态容器：白色卡片居中显示 */
.empty-login {
  background: #ffffff;
  border-radius: 22px;
  padding: 24px 18px;
  box-shadow: 0 18px 32px rgba(20, 78, 64, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #244b42;
  text-align: center;
}

/* 空状态图标 */
.empty-login el-icon {
  font-size: 36px;
}

.empty-login h3 {
  margin: 0;
}

/* 空状态提示文字 */
.empty-login p {
  margin: 0;
  font-size: 13px;
  color: rgba(36, 75, 66, 0.7);
}

/* 按钮容器 */
.empty-login .buttons {
  display: flex;
  gap: 12px;
  width: 100%;
}

/* 登录/注册按钮 */
.empty-login button {
  flex: 1;
  border: none;
  border-radius: 18px;
  padding: 12px;
  background: linear-gradient(135deg, #0acd88 0%, #09a47a 100%);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.empty-login button.secondary {
  background: rgba(12, 159, 113, 0.12);
  color: #244b42;
}

/* ===== 响应式布局 ===== */
/* 小屏幕适配（宽度 <= 400px） */
@media (max-width: 400px) {
  /* 快捷入口改为3列 */
  .shortcut-wrap {
    grid-template-columns: repeat(3, 1fr);
  }

  /* 统计数据改为2列 */
  .statistics {
    grid-template-columns: repeat(2, 1fr);
  }

  /* 操作按钮改为垂直排列 */
  .action-row {
    flex-direction: column;
  }
}
</style>
