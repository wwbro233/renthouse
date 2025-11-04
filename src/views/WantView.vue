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

    <section class="search-toolbar">
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
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </section>

    <section class="filter-card">
      <div
        v-for="item in Object.keys(filterState)"
        :key="item"
        class="filter-chip"
        @click="openFilterSheet(item)"
      >
        <span>{{ filterState[item] }}</span>
        <el-icon><ArrowDown /></el-icon>
      </div>
    </section>

    <section class="property-list">
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
          <div class="property-card__header">
            <h3>{{ item.title }}</h3>
            <span>¥{{ item.price }}/月</span>
          </div>
          <p class="property-card__sub">{{ item.layout }} · {{ item.size }}㎡</p>
          <p class="property-card__sub">{{ item.address }}</p>
          <div class="property-card__footer" @click.stop>
            <button type="button" @click="handleBook(item)">预约看房</button>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </article>
    </section>

    <section class="ideas-card">
      <h4>房源推荐</h4>
      <div class="ideas-timeline">
        <article v-for="item in hotIdeas" :key="item.id">
          <img :src="item.cover" :alt="item.title" />
          <div>
            <h5>{{ item.title }}</h5>
            <p>{{ item.transport }} · {{ item.commuteTime }}</p>
            <span>¥{{ item.price }}/月</span>
          </div>
        </article>
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

.search-toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  background: var(--surface-0);
  padding: 16px 20px;
  border-radius: 18px;
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.08);
}

.search-toolbar :deep(.el-input__wrapper) {
  padding-left: 8px;
  background: rgba(243, 246, 250, 0.8);
  border: none;
  box-shadow: none;
}

.search-toolbar :deep(.el-input__inner) {
  font-size: 15px;
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

.filter-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 14px 12px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  box-shadow: 0 12px 24px rgba(40, 121, 102, 0.12);
}

.filter-chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(12, 159, 113, 0.08);
  color: #256554;
  font-size: 14px;
  cursor: pointer;
}

.property-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.property-card {
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 14px 26px rgba(20, 78, 64, 0.14);
  display: flex;
  gap: 12px;
}

.property-card__media {
  position: relative;
  width: 140px;
  flex-shrink: 0;
}

.property-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.property-card__badge {
  position: absolute;
  left: 12px;
  bottom: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(12, 159, 113, 0.9);
  color: #fff;
  font-size: 12px;
}

.property-card__body {
  flex: 1;
  padding: 14px 16px 14px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #26483f;
}

.property-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.property-card__header h3 {
  margin: 0;
  font-size: 16px;
  line-height: 1.4;
  flex: 1;
}

.property-card__header span {
  color: #e7502a;
  font-weight: 700;
  white-space: nowrap;
}

.property-card__sub {
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
}

.property-card__footer button {
  border: none;
  background: linear-gradient(135deg, #0acd88 0%, #09a47a 100%);
  color: #ffffff;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
}

.ideas-card {
  background: #ffffff;
  border-radius: 22px;
  padding: 16px;
  box-shadow: 0 16px 28px rgba(16, 70, 58, 0.12);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ideas-card h4 {
  margin: 0;
  font-size: 16px;
  color: #254c42;
}

.ideas-timeline {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ideas-timeline article {
  display: flex;
  gap: 12px;
  align-items: center;
}

.ideas-timeline img {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  object-fit: cover;
}

.ideas-timeline h5 {
  margin: 0;
  font-size: 14px;
  color: #26483f;
}

.ideas-timeline p {
  margin: 4px 0;
  font-size: 12px;
  color: rgba(38, 72, 63, 0.65);
}

.ideas-timeline span {
  font-size: 12px;
  color: #e7502a;
  font-weight: 600;
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

@media (max-width: 390px) {
  .property-card {
    flex-direction: column;
  }

  .property-card__media {
    width: 100%;
    height: 180px;
  }

  .property-card__body {
    padding: 14px 16px 18px;
  }

  .filter-sheet__options {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
