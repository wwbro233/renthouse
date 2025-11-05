<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingStore } from '../stores/bookingStore'
import { nearbyProperties, commuteRecommendations } from '../data/mockData'

const router = useRouter()
const route = useRoute()
const bookingStore = useBookingStore()

const filterState = reactive({
  position: '北京 朝阳区',
  layout: '不限',
  rent: '1500-2000元',
  sort: '综合排序'
})

const filterOptions = {
  position: ['北京 朝阳区', '北京 海淀区', '北京 丰台区', '北京 通州区'],
  layout: ['不限', '1室1厅', '2室1厅', '3室2厅', '4室2厅'],
  rent: ['1500元以下', '1500-2000元', '2000-3000元', '3000元以上'],
  sort: ['综合排序', '价格从低到高', '价格从高到低', '面积从大到小', '面积从小到大']
}

const searchKeyword = ref(route.query.keyword?.toString() ?? '')
const sheetVisible = ref(false)
const activeFilterKey = ref('')

const openFilterSheet = (key) => {
  activeFilterKey.value = key
  sheetVisible.value = true
}

const chooseFilter = (value) => {
  if (activeFilterKey.value) {
    filterState[activeFilterKey.value] = value
  }
  sheetVisible.value = false
}

const filteredList = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  let result = [...nearbyProperties]
  if (keyword) {
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword) ||
        item.address.toLowerCase().includes(keyword)
    )
  }
  return result.map((item, index) => ({
    ...item,
    tag: index % 2 === 0 ? '大开间' : '近地铁'
  }))
})

const goToProperty = (id) => {
  router.push(`/property/${id}`)
}

const handleBook = (item) => {
  bookingStore.openBookingDialog({
    propertyId: item.id,
    title: item.title,
    address: item.address
  })
}

const hotIdeas = commuteRecommendations.slice(0, 3)

watch(
  () => route.query.keyword,
  (value) => {
    searchKeyword.value = value?.toString() ?? ''
  }
)

watch(searchKeyword, () => {
  pageState.currentPage = 1
})

const handleSearch = () => {
  const keyword = searchKeyword.value.trim()
  router
    .push({
      path: '/want',
      query: keyword ? { keyword } : undefined
    })
    .catch(() => {})
}
</script>

<template>
  <div class="want-page">
    <section class="hero">
      <header class="hero__header">
        <div class="hero__left">
          <el-icon><Briefcase /></el-icon>
          <span>填写通勤地址</span>
        </div>
        <div class="hero__actions">
          <el-icon size="20"><ChatDotRound /></el-icon>
          <el-icon size="20"><Share /></el-icon>
        </div>
      </header>
      <div class="hero__content">
        <div>
          <p class="hero__subtitle">发现你想看的房子</p>
          <h2>找房</h2>
        </div>
        <img
          class="hero__illustration"
          src="https://images.unsplash.com/photo-1600585154340-0ef3c08cc65c?auto=format&fit=crop&w=640&q=80"
          alt="找房插图"
        />
      </div>
      <p class="hero__hint">暂无想看房源，试试如下找房方式</p>
      <div class="hero__actions-row">
        <button type="button" @click="router.push('/want')">
          <el-icon><Van /></el-icon>
          通勤找房
        </button>
        <button type="button" @click="router.push('/want#map')">
          <el-icon><MapLocation /></el-icon>
          地图找房
        </button>
      </div>
    </section>

    <!-- F型搜索筛选层 -->
    <section class="search-filter-section">
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索房源标题或地址"
          clearable
          @keyup.enter="handleSearch"
          @clear="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" class="search-btn" @click="handleSearch">搜索</el-button>
      </div>
      <div class="filter-row">
        <div class="filter-col filter-col--left">
          <div class="filter-item" @click="openFilterSheet('position')">
            <span>{{ filterState.position }}</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <div class="filter-item" @click="openFilterSheet('rent')">
            <span>{{ filterState.rent }}</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
        </div>
        <div class="filter-col filter-col--right">
          <div class="filter-item" @click="openFilterSheet('layout')">
            <span>{{ filterState.layout }}</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <div class="filter-item" @click="openFilterSheet('sort')">
            <span>{{ filterState.sort }}</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
        </div>
      </div>
    </section>

    <!-- 卡片式房源展示层 -->
    <section class="property-grid">
      <article
        v-for="item in filteredList"
        :key="item.id"
        class="property-card"
        @click="goToProperty(item.id)"
      >
        <div class="property-card__media">
          <img :src="item.cover" :alt="item.title" />
          <div class="property-card__badge">{{ item.tag }}</div>
        </div>
        <div class="property-card__body">
          <h3 class="property-card__title">{{ item.title }}</h3>
          <p class="property-card__info">{{ item.layout }} · {{ item.size }}㎡</p>
          <p class="property-card__address">{{ item.address }}</p>
          <div class="property-card__footer">
            <span class="property-card__price">¥{{ item.price }}/月</span>
            <button type="button" class="property-card__btn" @click.stop="handleBook(item)">预约看房</button>
          </div>
        </div>
      </article>
    </section>

    <!-- 底部辅助层 -->
    <section class="footer-auxiliary">
      <div class="auxiliary-section">
        <h4>热门区域推荐</h4>
        <div class="auxiliary-links">
          <a href="#" @click.prevent>朝阳区</a>
          <a href="#" @click.prevent>海淀区</a>
          <a href="#" @click.prevent>丰台区</a>
          <a href="#" @click.prevent>通州区</a>
          <a href="#" @click.prevent>东城区</a>
          <a href="#" @click.prevent>西城区</a>
        </div>
      </div>
      <div class="auxiliary-section">
        <h4>找房攻略</h4>
        <div class="auxiliary-links">
          <a href="#" @click.prevent>租房注意事项</a>
          <a href="#" @click.prevent>合同签订指南</a>
          <a href="#" @click.prevent>押金退还流程</a>
          <a href="#" @click.prevent>房源选择技巧</a>
        </div>
      </div>
      <div class="auxiliary-section">
        <h4>客服入口</h4>
        <div class="auxiliary-links">
          <a href="#" @click.prevent>在线咨询</a>
          <a href="#" @click.prevent>电话客服</a>
          <a href="#" @click.prevent>投诉建议</a>
        </div>
      </div>
    </section>

    <transition name="fade">
      <div v-if="sheetVisible" class="filter-sheet">
        <div class="filter-sheet__mask" @click="sheetVisible = false"></div>
        <div class="filter-sheet__panel">
          <header>
            <h5>{{ activeFilterKey === 'position' ? '位置' : activeFilterKey === 'layout' ? '户型' : activeFilterKey === 'rent' ? '租金' : '排序' }}</h5>
            <button type="button" @click="sheetVisible = false">
              <el-icon><CloseBold /></el-icon>
            </button>
          </header>
          <div class="filter-sheet__options">
            <button
              v-for="option in filterOptions[activeFilterKey]"
              :key="option"
              type="button"
              :class="{ active: filterState[activeFilterKey] === option }"
              @click="chooseFilter(option)"
            >
              {{ option }}
            </button>
          </div>
          <button class="filter-sheet__reset" type="button" @click="chooseFilter(filterOptions[activeFilterKey][0])">
            查看房源
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.want-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 4px 0 32px;
}

/* F型搜索筛选层 */
.search-filter-section {
  background: var(--surface-0);
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-bar {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-bar :deep(.el-input) {
  flex: 1;
}

.search-bar :deep(.el-input__wrapper) {
  padding-left: 12px;
  background: rgba(243, 246, 250, 0.8);
  border: none;
  box-shadow: none;
}

.search-bar :deep(.el-input__inner) {
  font-size: 15px;
}

.search-btn {
  background: linear-gradient(135deg, #0acd88 0%, #09a47a 100%);
  border: none;
  padding: 12px 24px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(10, 205, 136, 0.3);
  transition: all 0.3s ease;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(10, 205, 136, 0.4);
}

.filter-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.filter-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(12, 159, 113, 0.08);
  color: #256554;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-item:hover {
  background: rgba(12, 159, 113, 0.15);
  transform: translateY(-1px);
}

.hero {
  background: linear-gradient(180deg, #baf4d5 0%, #e9fced 70%, #ffffff 100%);
  border-radius: 22px;
  padding: 18px 18px 24px;
  box-shadow: 0 18px 32px rgba(40, 121, 102, 0.16);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #2a5148;
}

.hero__left {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.6);
  padding: 10px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.hero__actions {
  display: flex;
  gap: 12px;
  color: rgba(42, 81, 72, 0.65);
}

.hero__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.hero__subtitle {
  margin: 0;
  font-size: 14px;
  color: rgba(42, 81, 72, 0.58);
}

.hero__content h2 {
  margin: 6px 0 0;
  font-size: 30px;
  color: #244d43;
}

.hero__illustration {
  width: 132px;
  border-radius: 16px;
  box-shadow: 0 14px 26px rgba(40, 121, 102, 0.22);
}

.hero__hint {
  margin: 0;
  font-size: 13px;
  color: rgba(42, 81, 72, 0.65);
}

.hero__actions-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.hero__actions-row button {
  border: none;
  border-radius: 16px;
  padding: 12px 16px;
  background: rgba(12, 159, 113, 0.18);
  color: #138965;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  justify-content: center;
  cursor: pointer;
}

/* 卡片式房源展示层 */
.property-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.property-card {
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 14px 26px rgba(20, 78, 64, 0.14);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s ease;
}

.property-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(20, 78, 64, 0.2);
}

.property-card__media {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.property-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.property-card:hover .property-card__media img {
  transform: scale(1.05);
}

.property-card__badge {
  position: absolute;
  left: 12px;
  top: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(12, 159, 113, 0.9);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.property-card__body {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #26483f;
}

.property-card__title {
  margin: 0;
  font-size: 16px;
  line-height: 1.4;
  color: #1c443c;
  font-weight: 600;
}

.property-card__info {
  margin: 0;
  font-size: 13px;
  color: rgba(38, 72, 63, 0.7);
}

.property-card__address {
  margin: 0;
  font-size: 12px;
  color: rgba(38, 72, 63, 0.65);
}

.property-card__footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(12, 159, 113, 0.1);
}

.property-card__price {
  color: #e7502a;
  font-weight: 700;
  font-size: 18px;
}

.property-card__btn {
  border: none;
  background: linear-gradient(135deg, #0acd88 0%, #09a47a 100%);
  color: #ffffff;
  border-radius: 18px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.property-card__btn:hover {
  background: linear-gradient(135deg, #09b57a 0%, #079569 100%);
  transform: scale(1.05);
}

/* 底部辅助层 */
.footer-auxiliary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  background: #ffffff;
  border-radius: 22px;
  padding: 24px;
  box-shadow: 0 16px 28px rgba(16, 70, 58, 0.12);
}

.auxiliary-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.auxiliary-section h4 {
  margin: 0;
  font-size: 16px;
  color: #254c42;
  font-weight: 600;
}

.auxiliary-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.auxiliary-links a {
  color: rgba(38, 72, 63, 0.7);
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  padding-left: 0;
}

.auxiliary-links a:hover {
  color: #0c9f71;
  padding-left: 8px;
}

.auxiliary-links a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: #0c9f71;
  transition: width 0.3s ease;
}

.auxiliary-links a:hover::after {
  width: 100%;
}

.filter-sheet {
  position: fixed;
  inset: 0;
  z-index: 9;
}

.filter-sheet__mask {
  position: absolute;
  inset: 0;
  background: rgba(17, 34, 30, 0.4);
  backdrop-filter: blur(4px);
}

.filter-sheet__panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  border-radius: 24px 24px 0 0;
  padding: 20px 18px 32px;
  box-shadow: 0 -12px 32px rgba(20, 78, 64, 0.18);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.filter-sheet__panel header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filter-sheet__panel h5 {
  margin: 0;
  font-size: 16px;
  color: #294d43;
}

.filter-sheet__panel header button {
  border: none;
  background: rgba(12, 159, 113, 0.12);
  color: #1d6f58;
  border-radius: 999px;
  padding: 6px 8px;
}

.filter-sheet__options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.filter-sheet__options button {
  border: none;
  border-radius: 14px;
  padding: 12px;
  background: rgba(12, 159, 113, 0.08);
  color: #256554;
  font-size: 14px;
  cursor: pointer;
}

.filter-sheet__options button.active {
  background: linear-gradient(135deg, #0acd88 0%, #09a47a 100%);
  color: #ffffff;
  box-shadow: 0 12px 20px rgba(12, 159, 113, 0.28);
}

.filter-sheet__reset {
  border: none;
  border-radius: 20px;
  padding: 12px;
  background: linear-gradient(135deg, #0acd88 0%, #09a47a 100%);
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .property-grid {
    grid-template-columns: 1fr;
  }

  .filter-row {
    grid-template-columns: 1fr;
  }

  .footer-auxiliary {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 390px) {
  .property-card__media {
    height: 180px;
  }

  .filter-sheet__options {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
