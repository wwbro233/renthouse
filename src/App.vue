<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BookingDialog from './components/BookingDialog.vue'
import { useBookingStore } from './stores/bookingStore'
import { useAuthStore } from './stores/authStore'
import { initCozeChat } from './plugins/cozeClient'

useBookingStore()
useAuthStore()

const router = useRouter()
const route = useRoute()

const navItems = [
  { key: 'home', label: '首页', route: '/' },
  { key: 'want', label: '找房', route: '/want' },
  { key: 'service', label: '家居服务', route: '/service' },
  { key: 'discover', label: '新鲜资讯', route: '/discover' },
  { key: 'support', label: '客服中心', route: '/support' }
]

const quickLinks = [
  { key: 'my', label: '个人中心', route: '/my' },
  { key: 'appointment', label: '我的约看', route: '/my/appointment' },
  { key: 'favorite', label: '我的想看', route: '/my/want' }
]

const hotKeywords = ['地铁周边', '押一付一', 'CBD 写字楼', '精装三居']
const currentYear = new Date().getFullYear()

const showLayout = computed(() => route.meta?.layout !== 'blank')

const activeNavKey = computed(() => {
  const active = route.meta?.activeMenu ?? route.path
  const exact = navItems.find((item) => item.route === active)
  if (exact) return exact.key
  const match = navItems.find((item) => item.route !== '/' && active.startsWith(item.route))
  return match ? match.key : 'home'
})

const searchKeyword = ref('')

const handleNavigate = (item) => {
  if (item.route === route.path) return
  router.push(item.route)
}

const handleSearch = () => {
  const keyword = searchKeyword.value.trim()
  router.push({
    path: '/want',
    query: keyword ? { keyword } : undefined
  })
}

const handleHotClick = (keyword) => {
  searchKeyword.value = keyword
  handleSearch()
}

const goHome = () => {
  if (route.path !== '/') router.push('/')
}

const goLogin = () => {
  router.push('/login')
}

const openChat = async () => {
  try {
    const client = await initCozeChat()
    if (client?.open) {
      client.open()
    }
  } catch (error) {
    console.error('[Coze] 打开客服失败', error)
  }
}
</script>

<template>
  <div class="web-app">
    <header v-if="showLayout" class="site-header">
      <div class="top-bar">
        <div class="top-bar__left">
          <button type="button" class="city-button">
            <el-icon size="16"><Location /></el-icon>
            <span>北京</span>
            <el-icon size="12"><ArrowDown /></el-icon>
          </button>
          <span class="top-bar__welcome">欢迎来到链房，智能匹配安心好房</span>
        </div>
        <div class="top-bar__right">
          <button
            v-for="link in quickLinks"
            :key="link.key"
            type="button"
            class="top-link"
            @click="handleNavigate(link)"
          >
            {{ link.label }}
          </button>
          <span class="divider"></span>
          <button type="button" class="top-link" @click="goLogin">登录 / 注册</button>
          <button type="button" class="top-link top-link--chat" @click="openChat">
            在线客服
          </button>
        </div>
      </div>

      <div class="main-header">
        <div class="main-header__logo" @click="goHome">
          <span class="logo__brand">链房</span>
          <span class="logo__tagline">安心租住每一天</span>
        </div>
        <div class="main-header__search">
          <div class="search-box">
            <el-icon size="20"><Search /></el-icon>
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="输入小区、地铁、商圈"
              @keyup.enter="handleSearch"
            />
            <button type="button" @click="handleSearch">搜索</button>
          </div>
          <div class="search-hot">
            <span>热门：</span>
            <button
              v-for="keyword in hotKeywords"
              :key="keyword"
              type="button"
              @click="handleHotClick(keyword)"
            >
              {{ keyword }}
            </button>
          </div>
        </div>
        <div class="main-header__contact">
          <span>客服热线</span>
          <strong>400-860-8888</strong>
          <small>每日 8:00-22:00</small>
        </div>
      </div>

      <nav class="site-nav">
        <button
          v-for="item in navItems"
          :key="item.key"
          type="button"
          class="site-nav__item"
          :class="{ 'site-nav__item--active': activeNavKey === item.key }"
          @click="handleNavigate(item)"
        >
          {{ item.label }}
        </button>
      </nav>
    </header>

    <main class="site-main">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <template v-if="Component">
            <div v-if="showLayout" class="content-container">
              <component :is="Component" />
            </div>
            <div v-else :class="route.meta?.noPadding ? '' : 'content-blank'">
              <component :is="Component" />
            </div>
          </template>
        </transition>
      </router-view>
    </main>

    <footer v-if="showLayout" class="site-footer">
      <div class="content-container footer-content">
        <div class="footer-brand">
          <h3>链房</h3>
          <p>灵感源自安居客，为你打造可信赖的找房体验。</p>
          <button type="button" @click="openChat">在线客服咨询</button>
        </div>
        <div class="footer-links">
          <div>
            <h4>快速入口</h4>
            <router-link to="/want">找房首页</router-link>
            <router-link to="/service">家居服务</router-link>
            <router-link to="/discover">生活资讯</router-link>
            <router-link to="/about">关于我们</router-link>
          </div>
          <div>
            <h4>帮助中心</h4>
            <router-link to="/support">在线客服</router-link>
            <router-link to="/my/want">我的想看</router-link>
            <router-link to="/my/footprint">看房足迹</router-link>
          </div>
          <div>
            <h4>联系我们</h4>
            <span>客服电话：400-860-8888</span>
            <span>服务时间：每日 8:00-22:00</span>
            <span>邮箱：support@gulizhaofang.com</span>
          </div>
        </div>
      </div>
      <div class="footer-meta">
        © {{ currentYear }} 链房 版权所有 · 京ICP备12345678号
      </div>
    </footer>
    <BookingDialog />
  </div>
</template>

<style scoped>
.web-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--gray-bg);
  color: var(--gray-1);
}

.site-header {
  background: var(--surface-0);
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.06);
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 24px;
  background: #f7f8fa;
  border-bottom: 1px solid #eceff5;
  font-size: 13px;
  color: var(--gray-3);
  flex-wrap: wrap;
  row-gap: 8px;
}

.top-bar__left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.city-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--surface-0);
  border: 1px solid #e0e3ec;
  border-radius: 999px;
  padding: 4px 12px;
  color: var(--gray-2);
  cursor: pointer;
  transition: var(--transition-base);
}

.city-button:hover {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
  box-shadow: 0 8px 16px rgba(29, 198, 140, 0.08);
}

.top-bar__welcome {
  color: var(--gray-3);
}

.top-bar__right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.top-link {
  background: none;
  border: none;
  color: var(--gray-3);
  cursor: pointer;
  padding: 0;
  font-size: 13px;
  transition: color 0.2s ease;
}

.top-link:hover {
  color: var(--brand-primary);
}

.top-link--chat {
  color: var(--brand-primary);
  font-weight: 600;
}

.divider {
  width: 1px;
  height: 16px;
  background: #dfe4ee;
}

.main-header {
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
}

.main-header__logo {
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  color: var(--brand-primary);
}

.logo__brand {
  font-size: 26px;
  font-weight: 700;
}

.logo__tagline {
  font-size: 13px;
  color: var(--gray-3);
}

.main-header__search {
  flex: 1;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px;
  background: var(--surface-0);
  border: 2px solid var(--brand-primary);
  border-radius: 999px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: var(--gray-1);
}

.search-box button {
  background: var(--brand-primary);
  color: #ffffff;
  border: none;
  padding: 8px 22px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-base);
}

.search-box button:hover {
  background: #13b17c;
}

.search-hot {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--gray-3);
  flex-wrap: wrap;
}

.search-hot button {
  background: #f3f6fa;
  border: none;
  border-radius: 999px;
  padding: 4px 14px;
  color: var(--gray-2);
  cursor: pointer;
  transition: var(--transition-base);
}

.search-hot button:hover {
  background: rgba(29, 198, 140, 0.12);
  color: var(--brand-primary);
}

.main-header__contact {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  color: var(--gray-2);
  min-width: 180px;
}

.main-header__contact strong {
  font-size: 20px;
  color: var(--brand-secondary);
}

.main-header__contact small {
  color: var(--gray-3);
}

.site-nav {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 0 24px;
  background: linear-gradient(90deg, #fff7eb 0%, #ffffff 100%);
  border-top: 1px solid #fbead1;
  border-bottom: 1px solid #f2f4fa;
}

.site-nav__item {
  position: relative;
  border: none;
  background: transparent;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 500;
  color: var(--gray-2);
  cursor: pointer;
  transition: color 0.2s ease;
}

.site-nav__item:hover {
  color: var(--brand-secondary);
}

.site-nav__item--active {
  color: var(--brand-secondary);
  font-weight: 700;
}

.site-nav__item--active::after {
  content: '';
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 6px;
  height: 3px;
  border-radius: 999px;
  background: var(--brand-secondary);
}

.site-main {
  flex: 1;
  width: 100%;
}

.content-container {
  max-width: 1200px;
  margin: 32px auto;
  width: calc(100% - 48px);
}

.content-blank {
  padding: 60px 0;
}

.site-footer {
  background: #1c242f;
  color: #c5ccd9;
  margin-top: 48px;
}

.footer-content {
  display: flex;
  gap: 48px;
  padding-bottom: 32px;
}

.footer-brand {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-brand h3 {
  font-size: 24px;
  color: #ffffff;
  margin: 0;
}

.footer-brand button {
  align-self: flex-start;
  background: var(--brand-primary);
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 999px;
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition-base);
}

.footer-brand button:hover {
  background: #13b17c;
}

.footer-links {
  flex: 2;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 24px;
}

.footer-links h4 {
  margin: 0 0 12px;
  font-size: 15px;
  color: #ffffff;
}

.footer-links :deep(a),
.footer-links span {
  display: block;
  font-size: 13px;
  margin-bottom: 8px;
  color: #c5ccd9;
}

.footer-links :deep(a:hover) {
  color: var(--brand-primary);
}

.footer-meta {
  text-align: center;
  padding: 14px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 12px;
  color: #9099a8;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (max-width: 1024px) {
  .main-header {
    gap: 24px;
  }

  .main-header__contact {
    align-items: flex-start;
  }

  .site-nav {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .top-bar {
    justify-content: center;
  }

  .main-header {
    justify-content: center;
  }

  .main-header__search {
    order: 3;
    width: 100%;
  }

  .main-header__contact {
    order: 2;
  }

  .content-container {
    margin: 24px auto;
  }
}
</style>
