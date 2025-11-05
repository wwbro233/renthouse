<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useBookingStore } from '../stores/bookingStore'
import { useAuthStore } from '../stores/authStore'
import { assetUrl } from '../utils/assets'

const router = useRouter()
const bookingStore = useBookingStore()
const authStore = useAuthStore()

// 创建本地 computed 用于模板
const isAuthenticated = computed(() => authStore.isAuthenticated.value)

const shortcutList = [
  { id: 'wish', label: '想看', icon: 'Collection', route: '/my/want' },
  { id: 'foot', label: '足迹', icon: 'View', route: '/my/footprint' },
  { id: 'book', label: '约看', icon: 'Calendar', route: '/my/appointment' },
  { id: 'share', label: '拼租', icon: 'Connection', route: '/my/share' },
  { id: 'contract', label: '合同', icon: 'Document', route: '/service' },
  { id: 'bill', label: '账单', icon: 'Tickets', route: '/service' },
  { id: 'order', label: '订单', icon: 'List', route: '/my/orders' },
  { id: 'comment', label: '评价', icon: 'EditPen', route: '/service' },
  { id: 'wallet', label: '钱包', icon: 'Wallet', route: '/service' }
]

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

const benefits = [
  { title: '服务折扣', desc: '每住100天，折扣多一点' },
  { title: '免费换租', desc: '城市那么大，你不必讲究' }
]

const familyService = [
  {
    title: '代办',
    desc: '你还未进行实名认证',
    route: '/my/profile'
  }
]

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

const userInfo = computed(() => {
  const user = authStore.currentUser.value
  if (!user) {
    return {
      name: '游客',
      points: 0,
      avatar: assetUrl('avatars/avatar-default.svg')
    }
  }
  return {
    name: user.name,
    points: user.points ?? 0,
    avatar: user.avatar || assetUrl('avatars/avatar-default.svg')
  }
})

const handleShortcut = (item) => {
  router.push(item.route)
}

const handleLogin = () => {
  router.push('/login')
}

const handleLogout = () => {
  authStore.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<template>
  <div class="my-page">
    <div class="page-toggle">
      <span>我的</span>
      <template v-if="isAuthenticated">
        <span class="status-pill">
          <el-icon><Select /></el-icon>
          已登录
        </span>
      </template>
      <button v-else type="button" class="link-btn" @click="handleLogin">去登录</button>
    </div>

    <template v-if="isAuthenticated">
      <section class="profile-hero">
        <header>
          <div class="profile-tag">
            <el-icon><SwitchButton /></el-icon>
            业主版
          </div>
          <div class="profile-icons">
            <el-icon size="20"><ChatDotRound /></el-icon>
            <el-icon size="20"><Headset /></el-icon>
            <el-icon size="20"><Setting /></el-icon>
          </div>
        </header>
        <div class="profile-info">
          <img :src="userInfo.avatar" alt="avatar" />
          <div>
            <h3>Hi，{{ userInfo.name }}</h3>
            <p>谷粒点 {{ userInfo.points }}</p>
          </div>
        </div>
      </section>

      <section class="plan-card">
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

      <section class="shortcut-grid">
        <header>
          <h3>我的家</h3>
          <span>感谢你选择谷粒</span>
        </header>
        <div class="family-card" v-for="item in familyService" :key="item.title">
          <div>
            <h4>{{ item.title }}</h4>
            <p>{{ item.desc }}</p>
          </div>
          <button type="button" @click="router.push(item.route)">
            <el-icon><ArrowRight /></el-icon>
          </button>
        </div>
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

      <section class="benefit-section">
        <header>
          <h3>专属谷粒计划</h3>
          <span>你在谷粒的每一天都很珍贵</span>
        </header>
        <article v-for="benefit in benefits" :key="benefit.title">
          <h4>{{ benefit.title }}</h4>
          <p>{{ benefit.desc }}</p>
        </article>
      </section>

      <section class="statistics">
        <article v-for="stat in statistics" :key="stat.label">
          <strong>{{ stat.value }}</strong>
          <span>{{ stat.label }}</span>
        </article>
      </section>

      <section class="action-row">
        <button type="button" @click="router.push('/my/profile')">编辑资料</button>
        <button type="button" class="secondary" @click="handleLogout">退出登录</button>
      </section>
    </template>

    <template v-else>
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
.my-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 32px;
}

.page-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #244b42;
}

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

.link-btn {
  border: none;
  background: transparent;
  color: #0c9f71;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.profile-hero {
  background: linear-gradient(180deg, #94e5bc 0%, #c9f7e3 70%, #ffffff 100%);
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 18px 32px rgba(24, 102, 84, 0.16);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-hero header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

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

.profile-icons {
  display: flex;
  gap: 12px;
  color: rgba(29, 81, 67, 0.6);
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #1d5143;
}

.profile-info img {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.75);
}

.profile-info h3 {
  margin: 0;
  font-size: 20px;
}

.profile-info p {
  margin: 4px 0 0;
  font-size: 13px;
  opacity: 0.75;
}

.plan-card {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 12px;
}

.plan-card article {
  border-radius: 20px;
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #2a4f45;
  box-shadow: 0 16px 28px rgba(15, 65, 52, 0.12);
}

.plan-card h4 {
  margin: 0;
  font-size: 16px;
}

.plan-card p {
  margin: 6px 0 0;
  font-size: 13px;
  opacity: 0.7;
}

.shortcut-grid {
  background: #ffffff;
  border-radius: 22px;
  padding: 18px;
  box-shadow: 0 16px 28px rgba(15, 65, 52, 0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

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

.family-card button {
  border: none;
  background: rgba(12, 159, 113, 0.18);
  color: #0c9f71;
  border-radius: 12px;
  padding: 8px 10px;
  cursor: pointer;
}

.shortcut-wrap {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

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

.statistics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  background: rgba(12, 159, 113, 0.12);
  border-radius: 22px;
  padding: 16px;
  color: #244b42;
}

.statistics article {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.statistics strong {
  font-size: 18px;
}

.statistics span {
  font-size: 12px;
  opacity: 0.7;
}

.action-row {
  display: flex;
  gap: 12px;
}

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

.action-row button.secondary {
  background: rgba(12, 159, 113, 0.08);
  color: #244b42;
}

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

.empty-login el-icon {
  font-size: 36px;
}

.empty-login h3 {
  margin: 0;
}

.empty-login p {
  margin: 0;
  font-size: 13px;
  color: rgba(36, 75, 66, 0.7);
}

.empty-login .buttons {
  display: flex;
  gap: 12px;
  width: 100%;
}

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

@media (max-width: 400px) {
  .shortcut-wrap {
    grid-template-columns: repeat(3, 1fr);
  }

  .statistics {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-row {
    flex-direction: column;
  }
}
</style>
