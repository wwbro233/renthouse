<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingStore } from '../stores/bookingStore'
import { nearbyProperties, commuteRecommendations } from '../data/mockData'
import SmartImage from '../components/SmartImage.vue'

const router = useRouter()
const route = useRoute()
const bookingStore = useBookingStore()

const searchKeyword = ref(route.query.keyword?.toString() ?? '')
const activeTheme = ref(route.query.theme?.toString() ?? 'all')

const themeOptions = [
  { label: '全部', value: 'all' },
  { label: '合租', value: 'share' },
  { label: '独卫主卧', value: 'studio' },
  { label: '整租1居', value: 'one-room' },
  { label: '整租2-3居', value: 'two-room' },
  { label: '小客厅', value: 'small-living' },
  { label: '大客厅', value: 'large-living' },
  { label: '短租', value: 'short-rent' },
  { label: '押金0首付', value: 'deposit' }
]

const locationTab = ref('region')
const locationOptions = {
  region: [
    '全部',
    '朝阳区',
    '海淀区',
    '东城区',
    '西城区',
    '丰台区',
    '通州区',
    '大兴区',
    '昌平区',
    '顺义区',
    '石景山区'
  ],
  metro: ['全部', '1号线', '2号线', '6号线', '7号线', '8号线', '10号线', '13号线', '14号线', '15号线', '机场线', '亦庄线']
}

const activeLocation = reactive({
  region: '全部',
  metro: '全部'
})

const filterState = reactive({
  rent: 'all',
  rooms: 'all',
  rentType: 'all'
})

const rentOptions = [
  { label: '全部', value: 'all' },
  { label: '2000元以下', value: 'lt2000' },
  { label: '2000-4000元', value: '2000-4000' },
  { label: '4000-6000元', value: '4000-6000' },
  { label: '6000-8000元', value: '6000-8000' },
  { label: '8000-10000元', value: '8000-10000' },
  { label: '10000元以上', value: 'gt10000' }
]

const roomOptions = [
  { label: '全部', value: 'all' },
  { label: '一室', value: 1 },
  { label: '二室', value: 2 },
  { label: '三室', value: 3 },
  { label: '四室及以上', value: '4plus' }
]

const rentTypeOptions = [
  { label: '全部', value: 'all' },
  { label: '整租', value: '整租' },
  { label: '合租/单间', value: '合租' },
  { label: '短租', value: '短租' }
]

const moreOptions = [
  { key: 'nearMetro', label: '近地铁' },
  { key: 'hasElevator', label: '电梯房' },
  { key: 'petFriendly', label: '可养宠' },
  { key: 'southFacing', label: '朝南' },
  { key: 'parking', label: '含车位' },
  { key: 'depositFree', label: '押一付一' },
  { key: 'shortRent', label: '可短租' },
  { key: 'loft', label: 'LOFT' }
]

const moreFilters = ref([])

const sortOptions = [
  { label: '综合排序', value: 'default' },
  { label: '价格从低到高', value: 'priceAsc' },
  { label: '价格从高到低', value: 'priceDesc' },
  { label: '面积从大到小', value: 'sizeDesc' },
  { label: '面积从小到大', value: 'sizeAsc' },
  { label: '最新发布', value: 'newest' }
]

const sortValue = ref('default')

const hotIdeas = commuteRecommendations.slice(0, 4)

const buildQuery = () => {
  const query = {}
  const keyword = searchKeyword.value.trim()
  if (keyword) {
    query.keyword = keyword
  }
  if (activeTheme.value !== 'all') {
    query.theme = activeTheme.value
  }
  return query
}

const syncRouteQuery = () => {
  router
    .push({
      path: '/want',
      query: buildQuery()
    })
    .catch(() => {})
}

const handleSearch = () => {
  syncRouteQuery()
}

const handleThemeSelect = (value) => {
  if (activeTheme.value === value) return
  activeTheme.value = value
  syncRouteQuery()
}

const setLocation = (key, value) => {
  activeLocation[key] = value
}

const toggleMoreFilter = (key) => {
  const index = moreFilters.value.indexOf(key)
  if (index > -1) {
    moreFilters.value.splice(index, 1)
  } else {
    moreFilters.value.push(key)
  }
}

const resetFilters = () => {
  searchKeyword.value = ''
  activeTheme.value = 'all'
  activeLocation.region = '全部'
  activeLocation.metro = '全部'
  filterState.rent = 'all'
  filterState.rooms = 'all'
  filterState.rentType = 'all'
  moreFilters.value = []
  sortValue.value = 'default'
  syncRouteQuery()
}

const locationLabel = computed(() => {
  if (activeLocation.region !== '全部') return activeLocation.region
  if (activeLocation.metro !== '全部') return activeLocation.metro
  return '全部'
})

const rentLabel = computed(() => {
  return rentOptions.find((item) => item.value === filterState.rent)?.label ?? '全部'
})

const roomLabel = computed(() => {
  return roomOptions.find((item) => item.value === filterState.rooms)?.label ?? '全部'
})

const rentTypeLabel = computed(() => {
  return rentTypeOptions.find((item) => item.value === filterState.rentType)?.label ?? '全部'
})

const moreLabel = computed(() => {
  return moreFilters.value.length ? `已选 ${moreFilters.value.length} 项` : '不限'
})

const filteredList = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  let result = nearbyProperties.map((item) => ({
    ...item,
    features: [
      item.nearMetro ? '近地铁' : null,
      item.hasElevator ? '电梯房' : null,
      item.petFriendly ? '可养宠' : null,
      item.depositFree ? '押一付一' : null,
      item.shortRent ? '可短租' : null,
      item.loft ? 'LOFT' : null,
      item.southFacing ? '朝南' : null,
      item.parking ? '含车位' : null
    ].filter(Boolean)
  }))

  if (activeTheme.value !== 'all') {
    result = result.filter((item) => item.themes?.includes(activeTheme.value))
  }

  if (keyword) {
    result = result.filter((item) =>
      `${item.title} ${item.address}`.toLowerCase().includes(keyword)
    )
  }

  if (activeLocation.region !== '全部') {
    result = result.filter((item) => item.district === activeLocation.region)
  }

  if (activeLocation.metro !== '全部') {
    result = result.filter((item) => item.metroLines?.includes(activeLocation.metro))
  }

  switch (filterState.rent) {
    case 'lt2000':
      result = result.filter((item) => item.price < 2000)
      break
    case '2000-4000':
      result = result.filter((item) => item.price >= 2000 && item.price < 4000)
      break
    case '4000-6000':
      result = result.filter((item) => item.price >= 4000 && item.price < 6000)
      break
    case '6000-8000':
      result = result.filter((item) => item.price >= 6000 && item.price < 8000)
      break
    case '8000-10000':
      result = result.filter((item) => item.price >= 8000 && item.price < 10000)
      break
    case 'gt10000':
      result = result.filter((item) => item.price >= 10000)
      break
    default:
      break
  }

  switch (filterState.rooms) {
    case 1:
    case 2:
    case 3:
      result = result.filter((item) => item.rooms === filterState.rooms)
      break
    case '4plus':
      result = result.filter((item) => item.rooms >= 4)
      break
    default:
      break
  }

  if (filterState.rentType !== 'all') {
    if (filterState.rentType === '合租') {
      result = result.filter((item) => item.rentType === '合租')
    } else {
      result = result.filter((item) => item.rentType === filterState.rentType)
    }
  }

  if (moreFilters.value.length) {
    result = result.filter((item) => moreFilters.value.every((key) => Boolean(item[key])))
  }

  const sorted = [...result]
  switch (sortValue.value) {
    case 'priceAsc':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'priceDesc':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'sizeDesc':
      sorted.sort((a, b) => b.size - a.size)
      break
    case 'sizeAsc':
      sorted.sort((a, b) => a.size - b.size)
      break
    case 'newest':
    case 'default':
    default:
      sorted.sort((a, b) => new Date(b.release) - new Date(a.release))
      break
  }

  return sorted
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

watch(
  () => route.query.keyword,
  (value) => {
    searchKeyword.value = value?.toString() ?? ''
  }
)

watch(
  () => route.query.theme,
  (value) => {
    activeTheme.value = value?.toString() ?? 'all'
  }
)
</script>

<template>
  <div class="want-page">
    <section class="search-header">
      <div class="search-header__title">
        <h1>找房</h1>
        <p>灵活筛选，快速锁定匹配好房</p>
      </div>
      <div class="search-header__bar">
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
      </div>
      <div class="theme-tabs">
        <button
          v-for="theme in themeOptions"
          :key="theme.value"
          type="button"
          :class="['theme-tabs__item', { active: activeTheme === theme.value }]"
          @click="handleThemeSelect(theme.value)"
        >
          {{ theme.label }}
        </button>
      </div>
    </section>

    <section class="filter-panel">
      <div class="filter-row">
        <div class="filter-trigger filter-trigger--wide">
          <div>
            <span class="filter-trigger__label">位置</span>
            <strong class="filter-trigger__value">{{ locationLabel }}</strong>
          </div>
          <div class="filter-dropdown filter-dropdown--wide">
            <div class="filter-panel__label">
              <span>位置</span>
              <div class="filter-panel__tabs">
                <button
                  type="button"
                  :class="{ active: locationTab === 'region' }"
                  @click="locationTab = 'region'"
                >
                  区域
                </button>
                <button
                  type="button"
                  :class="{ active: locationTab === 'metro' }"
                  @click="locationTab = 'metro'"
                >
                  地铁
                </button>
              </div>
            </div>
            <div class="filter-panel__options">
              <button
                v-for="option in locationOptions[locationTab]"
                :key="option"
                type="button"
                :class="{
                  active:
                    locationTab === 'region'
                      ? activeLocation.region === option
                      : activeLocation.metro === option
                }"
                @click="setLocation(locationTab, option)"
              >
                {{ option }}
              </button>
            </div>
          </div>
        </div>

        <div class="filter-trigger">
          <div>
            <span class="filter-trigger__label">租金</span>
            <strong class="filter-trigger__value">{{ rentLabel }}</strong>
          </div>
          <div class="filter-dropdown">
            <div class="filter-panel__options">
              <button
                v-for="item in rentOptions"
                :key="item.value"
                type="button"
                :class="{ active: filterState.rent === item.value }"
                @click="filterState.rent = item.value"
              >
                {{ item.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="filter-trigger">
          <div>
            <span class="filter-trigger__label">房型</span>
            <strong class="filter-trigger__value">{{ roomLabel }}</strong>
          </div>
          <div class="filter-dropdown">
            <div class="filter-panel__options">
              <button
                v-for="item in roomOptions"
                :key="item.label"
                type="button"
                :class="{ active: filterState.rooms === item.value }"
                @click="filterState.rooms = item.value"
              >
                {{ item.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="filter-trigger">
          <div>
            <span class="filter-trigger__label">类型</span>
            <strong class="filter-trigger__value">{{ rentTypeLabel }}</strong>
          </div>
          <div class="filter-dropdown">
            <div class="filter-panel__options">
              <button
                v-for="item in rentTypeOptions"
                :key="item.value"
                type="button"
                :class="{ active: filterState.rentType === item.value }"
                @click="filterState.rentType = item.value"
              >
                {{ item.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="filter-trigger">
          <div>
            <span class="filter-trigger__label">更多</span>
            <strong class="filter-trigger__value">{{ moreLabel }}</strong>
          </div>
          <div class="filter-dropdown filter-dropdown--wide">
            <div class="filter-panel__options filter-panel__options--wrap">
              <button
                v-for="item in moreOptions"
                :key="item.key"
                type="button"
                :class="{ active: moreFilters.includes(item.key) }"
                @click="toggleMoreFilter(item.key)"
              >
                {{ item.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="filter-panel__footer">
        <button type="button" class="filter-panel__reset" @click="resetFilters">重置筛选</button>
        <span class="filter-panel__count">当前共 {{ filteredList.length }} 套房源</span>
      </div>
    </section>

    <div class="content-layout">
      <div class="listing-column">
        <div class="listing-head">
          <span>为你找到 <strong>{{ filteredList.length }}</strong> 套房源</span>
          <el-select v-model="sortValue" size="small" class="sort-select">
            <el-option
              v-for="item in sortOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>

        <article
          v-for="item in filteredList"
          :key="item.id"
          class="listing-card"
          @click="goToProperty(item.id)"
        >
          <div class="listing-card__cover">
            <SmartImage :src="item.cover" :alt="item.title" />
            <span v-if="item.shortRent" class="listing-card__badge">可短租</span>
            <span v-else-if="item.depositFree" class="listing-card__badge">押一付一</span>
          </div>
          <div class="listing-card__body">
            <header>
              <h3>{{ item.title }}</h3>
              <span class="listing-card__price">¥{{ item.price }}/月</span>
            </header>
            <p class="listing-card__meta">
              {{ item.district }} · {{ item.area }} ｜ {{ item.layout }} · {{ item.size }}㎡ ｜
              {{ item.rentType }}
            </p>
            <p class="listing-card__meta">
              地铁：
              <span v-if="item.metroLines?.length">{{ item.metroLines.join(' / ') }}</span>
              <span v-else>暂无</span>
              ｜ 发布：{{ item.release }}
            </p>
            <div class="listing-card__features">
              <span v-for="tag in item.features.slice(0, 5)" :key="tag">{{ tag }}</span>
            </div>
            <div class="listing-card__actions" @click.stop>
              <el-button size="small" plain @click="handleBook(item)">预约看房</el-button>
              <el-button size="small" type="primary" @click="goToProperty(item.id)">
                查看详情
              </el-button>
            </div>
          </div>
        </article>

        <div v-if="!filteredList.length" class="empty-state">
          <p>暂无符合条件的房源，请调整筛选条件。</p>
          <el-button type="primary" @click="resetFilters">清空筛选</el-button>
        </div>
      </div>

      <aside class="aside-column">
        <div class="aside-card">
          <h4>热门推荐</h4>
          <div class="aside-card__list">
            <article v-for="item in hotIdeas" :key="item.id" @click="goToProperty(item.id)">
              <SmartImage :src="item.cover" :alt="item.title" />
              <div>
                <h5>{{ item.title }}</h5>
                <p>{{ item.transport }} · {{ item.commuteTime }}</p>
                <span>¥{{ item.price }}/月</span>
              </div>
            </article>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.want-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 12px 0 40px;
}

.search-header {
  background: #ffffff;
  border-radius: 20px;
  padding: 24px 28px;
  box-shadow: 0 16px 32px rgba(31, 78, 60, 0.08);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.search-header__title h1 {
  margin: 0;
  font-size: 28px;
  color: #1a3d32;
}

.search-header__title p {
  margin: 6px 0 0;
  color: #7a8b85;
  font-size: 14px;
}

.search-header__bar {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-header__bar :deep(.el-input__wrapper) {
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(34, 85, 65, 0.18);
  box-shadow: none;
  background: #f8fbf9;
}

.search-header__bar :deep(.el-input__inner) {
  font-size: 15px;
}

.theme-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.theme-tabs__item {
  padding: 8px 16px;
  border-radius: 18px;
  border: 1px solid rgba(31, 78, 60, 0.16);
  background: rgba(255, 255, 255, 0.9);
  color: #295347;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-tabs__item.active {
  border-color: #12a876;
  background: rgba(18, 168, 118, 0.12);
  color: #0f7b58;
}

.filter-panel {
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 12px 28px rgba(31, 78, 60, 0.08);
  padding: 16px 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.filter-trigger {
  position: relative;
  background: rgba(248, 251, 249, 0.95);
  border: 1px solid rgba(31, 78, 60, 0.1);
  border-radius: 16px;
  padding: 10px 14px;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.filter-trigger--wide {
  grid-column: span 2;
}

.filter-trigger__label {
  display: block;
  font-size: 12px;
  color: #6d8378;
}

.filter-trigger__value {
  color: #24493d;
  font-weight: 600;
  font-size: 14px;
}

.filter-trigger:hover,
.filter-trigger:focus-within {
  border-color: #12a876;
  box-shadow: 0 10px 22px rgba(18, 168, 118, 0.18);
}

.filter-dropdown {
  position: absolute;
  left: 0;
  top: calc(100% + 8px);
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  padding: 14px;
  box-shadow: 0 16px 32px rgba(21, 68, 52, 0.18);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-6px);
  transition: opacity 0.18s ease, transform 0.18s ease;
  z-index: 5;
}

.filter-dropdown--wide {
  width: 320px;
  max-width: calc(100vw - 40px);
}

.filter-trigger:hover .filter-dropdown,
.filter-trigger:focus-within .filter-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.filter-panel__label {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #26493d;
  font-weight: 600;
  margin-bottom: 10px;
}

.filter-panel__tabs {
  display: inline-flex;
  border-radius: 999px;
  background: rgba(15, 37, 29, 0.05);
  padding: 4px;
  gap: 4px;
}

.filter-panel__tabs button {
  border: none;
  background: transparent;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  color: #5c746a;
  cursor: pointer;
}

.filter-panel__tabs button.active {
  background: #ffffff;
  color: #138965;
  box-shadow: 0 4px 14px rgba(20, 91, 68, 0.18);
}

.filter-panel__options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-panel__options button {
  border: 1px solid rgba(31, 78, 60, 0.12);
  background: rgba(248, 251, 249, 0.9);
  color: #2d4f44;
  border-radius: 14px;
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-panel__options button.active {
  border-color: #0f7b58;
  color: #0f7b58;
  background: rgba(18, 168, 118, 0.12);
  box-shadow: 0 8px 18px rgba(18, 168, 118, 0.18);
}

.filter-panel__options--wrap {
  gap: 10px;
}

.filter-panel__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px dashed rgba(20, 62, 46, 0.12);
}

.filter-panel__reset {
  border: none;
  background: rgba(18, 168, 118, 0.12);
  color: #0f7b58;
  padding: 8px 18px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 13px;
}

.filter-panel__count {
  color: #5c746a;
  font-size: 13px;
}

.content-layout {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(260px, 1fr);
  gap: 20px;
}

.listing-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.listing-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(31, 78, 60, 0.08);
}

.listing-head span {
  color: #314d42;
  font-size: 14px;
}

.listing-head strong {
  color: #0f7b58;
}

.sort-select {
  width: 160px;
}

.listing-card {
  display: flex;
  gap: 16px;
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid rgba(31, 78, 60, 0.08);
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.listing-card:hover {
  box-shadow: 0 16px 32px rgba(31, 78, 60, 0.14);
  transform: translateY(-2px);
}

.listing-card__cover {
  position: relative;
  width: 200px;
  height: 140px;
  border-radius: 14px;
  overflow: hidden;
  flex-shrink: 0;
}

.listing-card__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.property-card:hover .property-card__media img {
  transform: scale(1.05);
}

.listing-card__badge {
  position: absolute;
  left: 12px;
  bottom: 12px;
  background: rgba(18, 168, 118, 0.9);
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.listing-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #2f4f44;
}

.listing-card__body header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.listing-card__body h3 {
  margin: 0;
  font-size: 18px;
}

.listing-card__price {
  color: #e65028;
  font-weight: 700;
  font-size: 18px;
}

.listing-card__meta {
  margin: 0;
  font-size: 13px;
  color: #61766d;
}

.listing-card__features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.listing-card__features span {
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(18, 168, 118, 0.12);
  color: #0f7b58;
  font-size: 12px;
}

.listing-card__actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.listing-card__actions :deep(.el-button) {
  border-radius: 999px;
}

.empty-state {
  background: #ffffff;
  border-radius: 18px;
  padding: 40px 24px;
  border: 1px dashed rgba(31, 78, 60, 0.14);
  text-align: center;
  color: #5c746a;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.aside-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.aside-card {
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid rgba(31, 78, 60, 0.08);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.aside-card h4 {
  margin: 0;
  font-size: 16px;
  color: #25483d;
}

.aside-card__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.aside-card__list article {
  display: flex;
  gap: 12px;
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  transition: background 0.2s ease;
}

.aside-card__list article:hover {
  background: rgba(18, 168, 118, 0.08);
}

.aside-card__list img {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  object-fit: cover;
}

.aside-card__list h5 {
  margin: 0;
  font-size: 14px;
  color: #2f4f44;
}

.aside-card__list p {
  margin: 4px 0;
  font-size: 12px;
  color: #6b8379;
}

.aside-card__list span {
  font-size: 12px;
  color: #e65028;
  font-weight: 600;
}

@media (max-width: 1080px) {
  .content-layout {
    grid-template-columns: 1fr;
  }

  .aside-column {
    order: -1;
  }
}

@media (max-width: 768px) {
  .search-header,
  .filter-panel {
    padding: 20px;
  }

  .search-header__bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-header__bar :deep(.el-button) {
    width: 100%;
  }

  .listing-card {
    flex-direction: column;
  }

  .listing-card__cover {
    width: 100%;
    height: 220px;
  }
}
</style>
