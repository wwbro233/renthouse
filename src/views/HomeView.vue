<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { featuredProperties, nearbyProperties } from '../data/mockData'
import { assetUrl } from '../utils/assets'

const router = useRouter()
const heroVisual = assetUrl('hero-visual.svg')

const searchKeyword = ref('')

const quickTools = [
  { id: 'commute', label: '通勤找房', icon: 'Van', route: '/want' },
  { id: 'map', label: '地图找房', icon: 'MapLocation', route: '/want#map' }
]

const categoryTiles = [
  {
    id: 'share',
    title: '合租',
    theme: 'share',
    cover: assetUrl('categories/category-share.svg')
  },
  {
    id: 'studio',
    title: '独卫主卧',
    theme: 'studio',
    cover: assetUrl('categories/category-studio.svg')
  },
  {
    id: 'one-room',
    title: '整租1居',
    theme: 'one-room',
    cover: assetUrl('categories/category-one.svg')
  },
  {
    id: 'two-room',
    title: '整租2-3居',
    theme: 'two-room',
    cover: assetUrl('categories/category-two.svg')
  },
  {
    id: 'small-living',
    title: '小客厅',
    theme: 'small-living',
    cover: assetUrl('categories/category-small.svg')
  },
  {
    id: 'large-living',
    title: '大客厅',
    theme: 'large-living',
    cover: assetUrl('categories/category-large.svg')
  },
  {
    id: 'short-rent',
    title: '短租',
    theme: 'short-rent',
    cover: assetUrl('categories/category-short.svg')
  },
  {
    id: 'deposit',
    title: '押金0首付',
    theme: 'deposit',
    cover: assetUrl('categories/category-deposit.svg')
  }
]

const serviceStrip = [
  {
    id: 'move',
    title: '硅谷家服',
    desc: '搬家·保洁·清洁·维修',
    cover: assetUrl('services/service-strip-move.svg'),
    route: '/service'
  },
  {
    id: 'smart',
    title: '硅谷智能',
    desc: '全屋智能家装',
    cover: assetUrl('services/service-strip-smart.svg'),
    route: '/service'
  }
]

// 为远程图片提供代理与回退，仅代理 http(s) 链接
const safeImg = (url) => {
  try {
    if (typeof url !== 'string') return url
    if (!/^https?:\/\//i.test(url)) return url // 本地或相对路径，直连
    const stripped = url.replace(/^https?:\/\//i, '')
    return `https://images.weserv.nl/?url=${encodeURIComponent(stripped)}&w=900&q=80`
  } catch {
    return url
  }
}

const handleImgError = (e) => {
  const img = e?.target
  if (!img) return
  // 避免死循环：只回退一次
  if (!img.dataset.fallbacked) {
    img.dataset.fallbacked = '1'
    img.src = '/favicon.ico'
  }
}

const planCards = [
  {
    id: 'student',
    title: '谷粒计划',
    desc: '在校生',
    color: '#f7f5ff'
  },
  {
    id: 'graduate',
    title: '精英计划',
    desc: '毕业生',
    color: '#fff4f1'
  },
  {
    id: 'worker',
    title: '企业计划',
    desc: '打工人',
    color: '#f1f9ff'
  },
  {
    id: 'english',
    title: 'English',
    desc: 'lao wai',
    color: '#fff8eb'
  }
]

const recommendActions = [
  { id: 'price', badge: '大开间', label: '房东直租，巴拉巴拉卡…', price: 1900 },
  { id: 'metro', badge: '近地铁', label: '房东直租方…', price: 1900 },
  { id: 'tag', badge: '大开间', label: '房东直租巴拉巴拉…', price: 1900 }
]

const handleClick = (route) => {
  router.push(route)
}

const goProperty = (id) => {
  router.push(`/property/${id}`)
}

const performSearch = () => {
  const keyword = searchKeyword.value.trim()
  const query = keyword ? { keyword } : {}
  router
    .push({
      path: '/want',
      query
    })
    .catch(() => {})
}

const handleQuickCategory = () => {
  router.push('/want')
}

const handleCategorySelect = (tile) => {
  router
    .push({
      path: '/want',
      query: { theme: tile.theme }
    })
    .catch(() => {})
}
</script>

<template>
  <div class="home-page">
    <section class="hero-card">
      <div class="hero-card__content">
        <div class="hero-card__top">
          <div class="hero-location" @click="router.push('/want')">
            <el-icon><Location /></el-icon>
            <span>北京</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <div class="hero-actions">
            <el-icon size="20"><ChatDotRound /></el-icon>
            <el-icon size="20"><Tickets /></el-icon>
          </div>
        </div>
        <div class="hero-headline">
          <h1>发现属于你的理想居所</h1>
          <p>精选真房源、真实价，安居每一天，从链房开始。</p>
        </div>
        <div class="hero-search">
          <div class="hero-search__input">
            <el-icon><Search /></el-icon>
            <input
              v-model="searchKeyword"
              placeholder="输入地铁、商圈、小区，快速找房"
              @keyup.enter="performSearch"
            />
          </div>
          <button type="button" class="hero-search__button" @click="performSearch">搜索房源</button>
        </div>
        <div class="hero-banner" @click="goProperty(featuredProperties[0].id)">
          <div class="hero-banner__copy">
            <h3>精品整租 · 限时减免</h3>
            <p>精选品质房源，签约立减 1000 元</p>
          </div>
          <span class="hero-banner__cta">立即领取</span>
        </div>
        <div class="quick-tools">
          <button
            v-for="tool in quickTools"
            :key="tool.id"
            type="button"
            @click="handleClick(tool.route)"
          >
            <el-icon size="16"><component :is="tool.icon" /></el-icon>
            <span>{{ tool.label }}</span>
          </button>
        </div>
      </div>
      <div class="hero-card__visual">
        <img :src="heroVisual" alt="客厅实景" />
      </div>
    </section>

    <section class="category-section">
      <header class="category-section__head">
        <div>
          <h3>热门房源主题</h3>
          <p>灵活筛选，快速锁定匹配好房</p>
        </div>
        <button type="button" @click="handleQuickCategory">
          浏览更多
          <el-icon><ArrowRight /></el-icon>
        </button>
      </header>
      <div class="category-grid">
        <button
          v-for="item in categoryTiles"
          :key="item.id"
          type="button"
          class="category-tile"
          @click="handleCategorySelect(item)"
        >
          <div class="category-tile__image">
            <img :src="item.cover" :alt="item.title" />
          </div>
          <span>{{ item.title }}</span>
        </button>
      </div>
    </section>

    <section class="service-strip">
      <article
        v-for="item in serviceStrip"
        :key="item.id"
        class="service-strip__item"
        @click="handleClick(item.route)"
      >
        <img
          :src="safeImg(item.cover)"
          :alt="item.title"
          loading="lazy"
          referrerpolicy="no-referrer"
          @error="handleImgError"
        />
        <div>
          <h4>{{ item.title }}</h4>
          <p>{{ item.desc }}</p>
        </div>
      </article>
    </section>

    <section class="plan-card-row">
      <article
        v-for="item in planCards"
        :key="item.id"
        class="plan-card"
        :style="{ background: item.color }"
      >
        <h5>{{ item.title }}</h5>
        <p>{{ item.desc }}</p>
      </article>
    </section>

    <section class="owner-card" @click="handleClick('/my/profile')">
      <div>
        <h4>我要成为业主</h4>
        <p>一键免费房屋估价</p>
      </div>
      <span>立即委托</span>
    </section>

    <section class="recommend-section">
      <header>
        <h3>周边房源推荐</h3>
        <button type="button" @click="handleClick('/want')">
          更多推荐
          <el-icon><ArrowRight /></el-icon>
        </button>
      </header>
      <div class="recommend-grid">
        <article
          v-for="item in nearbyProperties"
          :key="item.id"
          class="recommend-card"
          @click="goProperty(item.id)"
        >
          <img :src="item.cover" :alt="item.title" />
          <div class="recommend-card__content">
            <div class="recommend-card__head">
              <span class="recommend-card__tag">近地铁</span>
              <span class="recommend-card__price">¥{{ item.price }}/月</span>
            </div>
            <h4>{{ item.title }}</h4>
            <p>{{ item.address }}</p>
            <p>{{ item.layout }} · {{ item.size }}㎡</p>
          </div>
        </article>
      </div>

      <div class="recommend-inline">
        <article v-for="item in recommendActions" :key="item.id">
          <div class="recommend-inline__badge">{{ item.badge }}</div>
          <p>{{ item.label }}</p>
          <strong>¥{{ item.price }}/月</strong>
          <button type="button">去咨询</button>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 16px 0 48px;
}

.hero-card {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: 32px;
  padding: 36px;
  border-radius: 28px;
  background: linear-gradient(135deg, #9ee3b9 0%, #e6fbf2 60%, #ffffff 100%);
  color: #1c443c;
  box-shadow: 0 28px 52px rgba(44, 134, 104, 0.16);
  overflow: hidden;
}

.hero-card::after {
  content: '';
  position: absolute;
  width: 220px;
  height: 220px;
  background: rgba(255, 255, 255, 0.32);
  border-radius: 50%;
  bottom: -60px;
  right: -50px;
}

.hero-card__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hero-location {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.65);
  font-size: 14px;
  cursor: pointer;
  font-weight: 600;
  color: #1c443c;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  color: rgba(28, 68, 60, 0.65);
}

.hero-headline h1 {
  margin: 0;
  font-size: 36px;
  color: #143830;
}

.hero-headline p {
  margin: 10px 0 0;
  color: rgba(20, 56, 48, 0.72);
  font-size: 16px;
}

.hero-search {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 999px;
  padding: 10px 10px 10px 18px;
  color: #799a90;
  box-shadow: 0 18px 34px rgba(43, 102, 80, 0.14);
}

.hero-search__input {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.hero-search__input input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #1c443c;
  outline: none;
}

.hero-search__button {
  border: none;
  background: linear-gradient(135deg, #10c089 0%, #08a777 100%);
  color: #ffffff;
  padding: 10px 22px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-base);
  box-shadow: 0 12px 24px rgba(17, 180, 122, 0.26);
}

.hero-search__button:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 28px rgba(17, 180, 122, 0.3);
}

.hero-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-radius: 20px;
  background: linear-gradient(135deg, #2d764d 0%, #203c32 100%);
  color: #f1fff5;
  cursor: pointer;
  gap: 16px;
}

.hero-banner__copy h3 {
  margin: 0;
  font-size: 26px;
}

.hero-banner__copy p {
  margin: 8px 0 0;
  opacity: 0.82;
  font-size: 15px;
}

.hero-banner__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.92);
  color: #215143;
  font-size: 14px;
  padding: 10px 20px;
  border-radius: 999px;
  font-weight: 600;
}

.quick-tools {
  display: flex;
  gap: 12px;
}

.quick-tools button {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 16px;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  color: #1c443c;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-base);
}

.quick-tools button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(44, 134, 104, 0.18);
}

.hero-card__visual {
  position: relative;
  z-index: 1;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 26px 42px rgba(15, 23, 42, 0.18);
}

.hero-card__visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
  background: linear-gradient(180deg, #f4f9f5 0%, #f9fcfb 100%);
  padding: 24px 26px 32px;
  border-radius: 26px;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
}

.category-section__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.category-section__head h3 {
  margin: 0;
  font-size: 20px;
}

.category-section__head p {
  margin: 4px 0 0;
  color: var(--gray-3);
}

.category-section__head button {
  display: inline-flex;
  align-items: center;
  border: none;
  background: transparent;
  color: var(--brand-primary);
  cursor: pointer;
  gap: 6px;
  font-weight: 600;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.category-tile {
  border: none;
  background: #ffffff;
  border-radius: 22px;
  padding: 18px;
  box-shadow:
    0 18px 38px rgba(15, 23, 42, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.6);
  cursor: pointer;
  color: #253c37;
  transition: var(--transition-base);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-tile__image {
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 16px;
  overflow: hidden;
  background: #e8ede9;
}

.category-tile__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.category-tile span {
  font-weight: 600;
  font-size: 16px;
  text-align: left;
}

.category-tile:hover {
  transform: translateY(-6px);
  box-shadow: 0 28px 42px rgba(47, 94, 77, 0.18);
}

.category-tile:hover img {
  transform: scale(1.05);
}

.service-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.service-strip__item {
  position: relative;
  border-radius: 22px;
  overflow: hidden;
  cursor: pointer;
  min-height: 180px;
  display: flex;
  align-items: flex-end;
  color: #ffffff;
  box-shadow: 0 18px 30px rgba(15, 23, 42, 0.18);
  transition: var(--transition-base);
}

.service-strip__item img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.service-strip__item div {
  position: relative;
  z-index: 1;
  padding: 18px 20px;
  backdrop-filter: blur(2px);
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0) 100%);
}

.plan-card-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
}

.plan-card {
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 14px 24px rgba(15, 23, 42, 0.08);
  transition: transform 0.25s ease;
}

.plan-card:hover {
  transform: translateY(-4px);
}

.owner-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 138, 0, 0.18) 0%, rgba(255, 192, 0, 0.1) 100%);
  color: #6b3a00;
  cursor: pointer;
  box-shadow: 0 14px 24px rgba(255, 138, 0, 0.18);
}

.owner-card h4 {
  margin: 0 0 6px;
}

.owner-card span {
  font-weight: 600;
}

.recommend-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.recommend-section header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.recommend-section header h3 {
  margin: 0;
  font-size: 22px;
}

.recommend-section header button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: transparent;
  color: var(--brand-primary);
  cursor: pointer;
  font-size: 14px;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

.recommend-card {
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 18px 30px rgba(15, 23, 42, 0.08);
  cursor: pointer;
  transition: var(--transition-base);
}

.recommend-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 40px rgba(15, 23, 42, 0.12);
}

.recommend-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.recommend-card__content {
  padding: 18px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recommend-card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.recommend-card__tag {
  background: rgba(29, 198, 140, 0.1);
  color: var(--brand-primary);
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 600;
}

.recommend-card__price {
  color: var(--brand-secondary);
  font-weight: 700;
}

.recommend-card__content h4 {
  margin: 0;
  font-size: 17px;
}

.recommend-inline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.recommend-inline article {
  border-radius: 16px;
  padding: 16px;
  background: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(29, 198, 140, 0.12);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recommend-inline__badge {
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 138, 0, 0.12);
  color: var(--brand-secondary);
  font-size: 12px;
}

.recommend-inline button {
  align-self: flex-start;
  border: none;
  background: var(--brand-primary);
  color: #ffffff;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
}

@media (max-width: 1024px) {
  .hero-card {
    grid-template-columns: 1fr;
  }

  .hero-card__visual {
    height: 260px;
  }
}

@media (max-width: 768px) {
  .hero-card {
    padding: 26px 20px;
  }

  .hero-headline h1 {
    font-size: 28px;
  }

  .hero-banner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
