<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../stores/bookingStore'
import { featuredProperties } from '../data/mockData'
import { assetUrl } from '../utils/assets'
import { getCategoryImage } from '../utils/categoryImages'
import SmartImage from '../components/SmartImage.vue'

const router = useRouter()
const bookingStore = useBookingStore()
const heroVisual = assetUrl('hero-visual.jpg')

const searchKeyword = ref('')

const quickTools = [
  { id: 'commute', label: '通勤找房', icon: 'Van', route: '/want' },
  { id: 'map', label: '地图找房', icon: 'MapLocation', route: '/want#map' }
]

// 大类分组 + 小类卡片结构（确保每行填满，至少4个或更多）
const categoryGroups = [
  {
    id: 'duration',
    title: '时长类',
    items: [
      { id: 'short-rent', title: '短租', cover: getCategoryImage('short-rent') },
      { id: 'long-rent', title: '长租年付', cover: getCategoryImage('long-rent') },
      { id: 'daily-rent', title: '日租', cover: getCategoryImage('daily-rent') },
      { id: 'quarter-rent', title: '季租', cover: getCategoryImage('quarter-rent') },
      { id: 'half-year', title: '半年租', cover: getCategoryImage('half-year') },
      { id: 'monthly', title: '月租', cover: getCategoryImage('monthly') }
    ]
  },
  {
    id: 'layout',
    title: '房型类',
    items: [
      { id: 'share', title: '合租', cover: getCategoryImage('share') },
      { id: 'studio', title: '独卫主卧', cover: getCategoryImage('studio') },
      { id: 'one-room', title: '整租1居', cover: getCategoryImage('one-room') },
      { id: 'two-room', title: '整租2-3居', cover: getCategoryImage('two-room') },
      { id: 'single-apt', title: '单身公寓', cover: getCategoryImage('single-apt') },
      { id: 'loft', title: 'Loft公寓', cover: getCategoryImage('loft') },
      { id: 'villa', title: '别墅', cover: getCategoryImage('villa') },
      { id: 'penthouse', title: '复式', cover: getCategoryImage('penthouse') }
    ]
  },
  {
    id: 'location',
    title: '区位配套类',
    items: [
      { id: 'school', title: '学区房', cover: getCategoryImage('school') },
      { id: 'metro', title: '地铁房', cover: getCategoryImage('metro') },
      { id: 'business', title: '商圈房', cover: getCategoryImage('business') },
      { id: 'scenic', title: '景区房', cover: getCategoryImage('scenic') },
      { id: 'hospital', title: '医院旁', cover: getCategoryImage('hospital') },
      { id: 'park', title: '公园旁', cover: getCategoryImage('park') }
    ]
  },
  {
    id: 'decoration',
    title: '装修风格类',
    items: [
      { id: 'furnished', title: '精装房', cover: getCategoryImage('furnished') },
      { id: 'homestay', title: '民宿风', cover: getCategoryImage('homestay') },
      { id: 'minimal', title: '极简风', cover: getCategoryImage('minimal') },
      { id: 'luxury', title: '轻奢风', cover: getCategoryImage('luxury') },
      { id: 'modern', title: '现代风', cover: getCategoryImage('modern') },
      { id: 'european', title: '欧式', cover: getCategoryImage('european') }
    ]
  },
  {
    id: 'special',
    title: '特殊配置类',
    items: [
      { id: 'balcony', title: '带阳台', cover: getCategoryImage('balcony') },
      { id: 'pet-friendly', title: '宠物友好', cover: getCategoryImage('pet-friendly') },
      { id: 'parking', title: '带车位', cover: getCategoryImage('parking') },
      { id: 'smart-home', title: '智能家电', cover: '/images/图片1.png' },
      { id: 'gym', title: '健身房', cover: getCategoryImage('gym') },
      { id: 'pool', title: '游泳池', cover: getCategoryImage('pool') }
    ]
  },
  {
    id: 'payment',
    title: '支付优惠类',
    items: [
      { id: 'deposit', title: '押金0首付', cover: getCategoryImage('deposit') },
      { id: 'installment', title: '租金分期', cover: getCategoryImage('installment') },
      { id: 'first-month', title: '首月减免', cover: getCategoryImage('first-month') },
      { id: 'discount', title: '租金折扣', cover: getCategoryImage('discount') },
      { id: 'coupon', title: '优惠券', cover: getCategoryImage('coupon') }
    ]
  }
]

// 顶部服务卡片（网格布局，每行固定4张，共8张）
const serviceStrip = [
  {
    id: 'move',
    title: '硅谷家服',
    desc: '搬家·保洁·清洁·维修',
    cover: assetUrl('services/service-strip-move.jpg'),
    route: '/service'
  },
  {
    id: 'smart',
    title: '硅谷智能',
    desc: '全屋智能家装',
    cover: assetUrl('services/service-strip-smart.jpg'),
    route: '/service'
  },
  {
    id: 'trusteeship',
    title: '房屋租赁托管',
    desc: '租客省心托管',
    cover: assetUrl('services/service-vip-b.jpg'),
    route: '/service'
  },
  {
    id: 'legal',
    title: '房产法律咨询',
    desc: '专业法务支持',
    cover: assetUrl('services/service-vip-a.jpg'),
    route: '/service'
  },
  {
    id: 'soft-design',
    title: '软装设计',
    desc: '全屋美学定制',
    cover: assetUrl('services/service-strip-smart.jpg'),
    route: '/service'
  },
  {
    id: 'appliance-trade',
    title: '家电以旧换新',
    desc: '智能家电升级',
    cover: assetUrl('services/service-strip-smart.jpg'),
    route: '/service'
  },
  {
    id: 'finance',
    title: '房产金融服务',
    desc: '房贷・车贷・理财咨询',
    cover: assetUrl('services/service-vip-c.jpg'),
    route: '/service'
  },
  {
    id: 'inspection',
    title: '房屋检测服务',
    desc: '甲醛・水电・结构检测',
    cover: assetUrl('services/service-clean-plus.jpg'),
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

// 用户计划卡片（对称布局，每行6个）
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
  },
  {
    id: 'startup',
    title: '创业计划',
    desc: '创业者',
    color: '#f0f9ff'
  },
  {
    id: 'international',
    title: '留学生计划',
    desc: 'International Student',
    color: '#fef3f2'
  }
]

// 房东直租类房源（统一结构与样式，减少为2个解决留白）
const recommendActions = [
  {
    id: 'price',
    title: '房东直租，巴拉巴拉卡…',
    price: 1900,
    layout: '大开间',
    size: 35,
    address: '朝阳区 · 望京',
    cover: '/images/租房 APP 文案创作 (2).png',
    tag: '大开间'
  },
  {
    id: 'metro',
    title: '房东直租方…',
    price: 1900,
    layout: '1室1厅',
    size: 40,
    address: '海淀区 · 中关村',
    cover: '/images/租房 APP 文案创作 (3).png',
    tag: '近地铁'
  }
]

const handleClick = (route) => {
  router.push(route)
}

const goProperty = (id) => {
  router.push(`/property/${id}`)
}

const handleBook = (item) => {
  bookingStore.openBookingDialog({
    propertyId: item.id,
    title: item.title,
    address: item.address
  })
}

// 根据标签文本返回对应的class
const getTagClass = (tag) => {
  if (!tag) return 'tag-metro'
  if (tag.includes('商圈')) return 'tag-business'
  if (tag.includes('大开间')) return 'tag-studio'
  if (tag.includes('近地铁')) return 'tag-metro'
  return 'tag-metro'
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
            <SmartImage :src="heroVisual" alt="客厅实景" />
          </div>
    </section>

    <!-- 大类分组 + 小类卡片布局 -->
    <section class="category-section">
      <header class="category-section__head">
        <div>
          <h3>热门房源主题</h3>
          <p>灵活筛选，快速锁定匹配好房</p>
        </div>
      </header>
      <div class="category-groups">
        <div
          v-for="group in categoryGroups"
          :key="group.id"
          class="category-group"
        >
          <div class="category-group__header">
            <h4 class="category-group__title">{{ group.title }}</h4>
            <button type="button" class="category-group__more" @click="handleQuickCategory">
              浏览更多
              <el-icon><ArrowRight /></el-icon>
            </button>
          </div>
          <div class="category-group__grid">
            <button
              v-for="item in group.items"
              :key="item.id"
              type="button"
              class="category-card"
              @click="handleClick('/want')"
            >
              <div class="category-card__image">
                <SmartImage :src="safeImg(item.cover)" :alt="item.title" />
              </div>
              <span class="category-card__label">{{ item.title }}</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 顶部服务卡片区（网格布局，每行至少3张） -->
    <section class="service-grid">
      <article
        v-for="item in serviceStrip"
        :key="item.id"
        class="service-card"
        @click="handleClick(item.route)"
      >
        <div class="service-card__image">
          <SmartImage :src="safeImg(item.cover)" :alt="item.title" />
        </div>
        <div class="service-card__content">
          <h4 class="service-card__title">{{ item.title }}</h4>
          <p class="service-card__desc">{{ item.desc }}</p>
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
  gap: 24px;
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
  font-size: 22px;
  font-weight: 700;
  color: #1c443c;
}

.category-section__head p {
  margin: 4px 0 0;
  color: var(--gray-3);
  font-size: 14px;
}

/* 大类分组容器 */
.category-groups {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.category-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-group__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.category-group__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #244d43;
  letter-spacing: 0.5px;
}

.category-group__more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: transparent;
  color: #0c9f71;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  padding: 4px 8px;
  border-radius: 6px;
}

.category-group__more:hover {
  color: #08a777;
  background: rgba(12, 159, 113, 0.08);
  transform: translateX(2px);
}

.category-group__grid {
  display: flex;
  gap: 12px;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: rgba(12, 159, 113, 0.3) transparent;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;
  /* 确保每行至少显示4个卡片，其余通过滚动查看 */
  --min-cards-per-row: 4;
}

/* 隐藏滚动条但保持滚动功能 - Webkit浏览器 */
.category-group__grid::-webkit-scrollbar {
  height: 6px;
}

.category-group__grid::-webkit-scrollbar-track {
  background: rgba(12, 159, 113, 0.05);
  border-radius: 10px;
}

.category-group__grid::-webkit-scrollbar-thumb {
  background: rgba(12, 159, 113, 0.3);
  border-radius: 10px;
  transition: background 0.2s ease;
}

.category-group__grid::-webkit-scrollbar-thumb:hover {
  background: rgba(12, 159, 113, 0.5);
}

/* 小类卡片 */
.category-card {
  flex: 0 0 calc((100% - 36px) / 4); /* 每行4个，减去3个gap */
  border: none;
  background: #ffffff;
  border-radius: 18px;
  padding: 0;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  min-width: 180px; /* 最小宽度保证 */
  max-width: calc((100% - 36px) / 4); /* 最大宽度不超过4列布局 */
}

.category-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 16px 32px rgba(47, 94, 77, 0.18);
}

.category-card__image {
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #e8ede9;
  position: relative;
}

.category-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.category-card:hover .category-card__image img {
  transform: scale(1.1);
}

.category-card__label {
  padding: 14px 16px;
  font-weight: 600;
  font-size: 15px;
  text-align: center;
  color: #253c37;
  background: #ffffff;
  transition: color 0.2s ease;
}

.category-card:hover .category-card__label {
  color: #0c9f71;
}

/* 顶部服务卡片区（网格布局，每行固定4张） */
.service-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.service-card {
  position: relative;
  border-radius: 22px;
  overflow: hidden;
  cursor: pointer;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  color: #ffffff;
  box-shadow: 0 18px 30px rgba(15, 23, 42, 0.18);
  transition: all 0.3s ease;
  background: #ffffff;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 40px rgba(15, 23, 42, 0.24);
  transition: all 0.3s ease;
}

.service-card__image {
  position: relative;
  width: 100%;
  height: 192px; /* h-48 = 192px */
  overflow: hidden;
}

.service-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.service-card:hover .service-card__image img {
  transform: scale(1.1);
}

.service-card__content {
  position: relative;
  z-index: 1;
  padding: 18px 20px;
  background: linear-gradient(135deg, rgba(12, 159, 113, 0.95) 0%, rgba(9, 164, 122, 0.9) 100%);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.service-card__title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
}

.service-card__desc {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
}

.plan-card-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.plan-card {
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 14px 24px rgba(15, 23, 42, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.plan-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 32px rgba(15, 23, 42, 0.12);
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
  transition: all 0.3s ease;
}

.owner-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 32px rgba(255, 138, 0, 0.24);
}

.owner-card h4 {
  margin: 0 0 6px;
}

.owner-card span {
  font-weight: 600;
}


@media (max-width: 1024px) {
  .hero-card {
    grid-template-columns: 1fr;
  }

  .hero-card__visual {
    height: 260px;
  }

  .category-group__grid {
    gap: 10px;
    padding-bottom: 10px;
  }

  .category-card {
    flex: 0 0 calc((100% - 30px) / 3); /* 平板端每行3个 */
    min-width: 160px;
    max-width: calc((100% - 30px) / 3);
  }

  .service-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .plan-card-row {
    grid-template-columns: repeat(3, 1fr);
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

  .category-group__grid {
    gap: 8px;
    padding-bottom: 12px;
  }

  .category-card {
    flex: 0 0 calc((100% - 16px) / 2); /* 移动端每行2个 */
    min-width: 140px;
    max-width: calc((100% - 16px) / 2);
  }

  .service-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .plan-card-row {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

