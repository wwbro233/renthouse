<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { mapBoundary, propertyDetail, nearbyProperties, featuredProperties, commuteRecommendations } from '../data/mockData'
import { useBookingStore } from '../stores/bookingStore'
import { assetUrl } from '../utils/assets'

const router = useRouter()
const route = useRoute()
const bookingStore = useBookingStore()

// 根据路由 ID 获取房源详情
const getPropertyDetail = () => {
  const propertyId = parseInt(route.params.id)
  
  // 在所有房源列表中查找
  const allProperties = [...nearbyProperties, ...featuredProperties, ...commuteRecommendations]
  const property = allProperties.find(p => p.id === propertyId)
  
  if (!property) {
    // 如果找不到，返回默认详情
    return propertyDetail
  }
  
  // 基于找到的房源构建详细信息
  return {
    id: property.id,
    title: property.title,
    price: property.price,
    layout: property.layout || '1室1厅1卫',
    area: property.size || 45,
    orientation: property.southFacing ? '南' : '东南',
    floor: '中层 / 28层',
    decoration: '精装修',
    release: property.release || '2025-02-20',
    address: property.address || `${property.district || ''} · ${property.area || ''}`.trim(),
    landlord: {
      name: '李先生',
      avatar: assetUrl('avatars/avatar-landlord.jpg'),
      phone: '134-****-8890',
      rating: 4.9
    },
    gallery: [
      property.cover,
      assetUrl('gallery/property-gallery-2.jpg'),
      assetUrl('gallery/property-gallery-3.jpg'),
      assetUrl('gallery/property-gallery-4.jpg')
    ],
    highlights: [
      property.nearMetro ? '近地铁' : null,
      property.hasElevator ? '电梯房' : null,
      property.depositFree ? '押一付一' : null,
      property.rentType,
      property.tags?.[0],
      '拎包入住'
    ].filter(Boolean),
    description: property.district 
      ? `房源位于${property.district}${property.area}，${property.layout}，使用面积${property.size}㎡。${
          property.nearMetro ? '距离地铁站仅几百米，' : ''
        }周边配套完善：购物中心、餐厅、便利店等一应俱全。房屋采用现代简约设计，${
          property.hasElevator ? '配备电梯，' : ''
        }${property.petFriendly ? '可养宠物，' : ''}适合都市白领及家庭居住。`
      : `精品房源位于${property.address}，${property.layout}，使用面积${property.size}㎡。周边配套完善，交通便利，${
          property.transport ? `${property.transport}直达，` : ''
        }适合追求高品质生活的都市白领。`,
    facilities: [
      property.hasElevator ? '电梯' : null,
      '智能门锁',
      '洗衣机',
      '冰箱',
      property.loft ? 'LOFT设计' : null,
      property.parking ? '停车位' : null,
      '高速宽带',
      '空调'
    ].filter(Boolean),
    traffic: property.metroLines?.length
      ? `距离${property.metroLines.join('、')}地铁站步行约 ${Math.floor(Math.random() * 10 + 5)} 分钟；周边有多条公交线路；交通便利，通勤便捷。`
      : property.transport
        ? `${property.transport}直达，${property.commuteTime || ''}；周边有多条公交线路，交通便利。`
        : '周边有多条公交线路，交通便利，适合各类出行需求。',
    map: {
      lat: 39.90965 + (Math.random() - 0.5) * 0.05,
      lng: 116.45668 + (Math.random() - 0.5) * 0.05
    }
  }
}

const detail = computed(() => getPropertyDetail())

const markerPosition = computed(() => {
  const { lat, lng } = detail.value.map
  const left = ((lng - mapBoundary.west) / (mapBoundary.east - mapBoundary.west)) * 100
  const top = ((mapBoundary.north - lat) / (mapBoundary.north - mapBoundary.south)) * 100
  return { left: `${left}%`, top: `${top}%` }
})

const goBack = () => router.back()

const handleBookVisit = () => {
  bookingStore.openBookingDialog({
    propertyId: detail.value.id,
    title: detail.value.title,
    address: detail.value.address
  })
}

const handleFavorite = () => {
  ElMessage.success('已加入想看清单')
}

const handleShare = () => {
  ElMessage.success('链接复制成功')
}
</script>

<template>
  <div class="detail-page">
    <section class="media-hero">
      <button class="hero-back" type="button" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
      </button>
      <div class="hero-icons">
        <button type="button" @click="handleFavorite">
          <el-icon><Star /></el-icon>
        </button>
        <button type="button" @click="handleShare">
          <el-icon><Share /></el-icon>
        </button>
      </div>
      <el-carousel indicator-position="none" class="carousel" height="200px">
          <el-carousel-item v-for="img in detail.gallery" :key="img">
            <SmartImage :src="img" alt="房源图片" />
          </el-carousel-item>
      </el-carousel>
      <div class="price-card">
        <div class="price-main">
          <strong>¥{{ detail.price }}</strong>
          <span>/月(年付价)</span>
        </div>
        <div class="price-tags">
          <span>硅谷暖冬季</span>
          <span>谷粒优惠</span>
        </div>
      </div>
    </section>

    <section class="property-info">
      <h1>{{ detail.title }}</h1>
      <p class="subtitle">{{ detail.address }}</p>
      <div class="info-grid">
        <div>
          <span class="label">使用面积</span>
          <strong>{{ detail.area }}㎡</strong>
        </div>
        <div>
          <span class="label">户型</span>
          <strong>{{ detail.layout }}</strong>
        </div>
        <div>
          <span class="label">朝向</span>
          <strong>{{ detail.orientation }}</strong>
        </div>
        <div>
          <span class="label">楼层</span>
          <strong>{{ detail.floor }}</strong>
        </div>
      </div>
      <div class="chip-list">
        <span v-for="tag in detail.highlights" :key="tag">{{ tag }}</span>
      </div>
      <p class="description">
        {{ detail.description }}
      </p>
    </section>

    <section class="facility-section">
      <header>
        <h2>物品配置</h2>
        <span>全屋配置 {{ detail.facilities.length }} 项</span>
      </header>
      <div class="facility-grid">
        <span v-for="item in detail.facilities" :key="item">{{ item }}</span>
      </div>
    </section>

    <section class="traffic-card">
      <header>
        <h2>交通与周边</h2>
        <span>8号线 后沙峪地铁站 · 步行约 1.5 公里</span>
      </header>
      <p>{{ detail.traffic }}</p>
      <div class="map-preview">
        <div class="grid">
          <span v-for="n in 3" :key="`h-${n}`" class="line horizontal"></span>
          <span v-for="n in 3" :key="`v-${n}`" class="line vertical"></span>
        </div>
        <div class="marker" :style="markerPosition">
          <span class="marker-price">¥{{ detail.price }}</span>
          <span class="marker-title">国贸 CBD</span>
        </div>
      </div>
    </section>

    <section class="landlord-card">
      <header>
        <div class="profile">
          <el-avatar :src="detail.landlord.avatar" size="large" />
          <div>
            <h3>{{ detail.landlord.name }}</h3>
            <p>评分 {{ detail.landlord.rating.toFixed(1) }}</p>
          </div>
        </div>
        <button type="button">
          <el-icon><Phone /></el-icon>
          去咨询
        </button>
      </header>
      <div class="contact">
        <span>{{ detail.landlord.phone }}</span>
        <p>提示：通过平台沟通更安全，谨防私下交易。</p>
      </div>
    </section>

    <footer class="action-bar">
      <div class="action-info">
        <span>可随时入住</span>
        <strong>支持月付 · 可长租 2 年</strong>
      </div>
      <button type="button" class="ghost" @click="handleFavorite">加入想看</button>
      <button type="button" class="primary" @click="handleBookVisit">预约看房</button>
    </footer>
  </div>
</template>

<style scoped>
.detail-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 120px;
  color: #214b42;
}

.media-hero {
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  background: #fff;
  height: 400px;
  box-shadow: 0 18px 32px rgba(18, 78, 64, 0.2);
}

.media-hero img {
  width: 100%;
  height: 260px;
  object-fit: cover;
}

.hero-back,
.hero-icons button {
  position: absolute;
  top: 16px;
  border: none;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
}

.hero-back {
  left: 16px;
  z-index: 2;
}

.hero-icons {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 12px;
  z-index: 2;
}
.carousel{
  z-index: 1;
  position: relative;
}

.price-card {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 20px;  /* 向上移15px */
  background: linear-gradient(135deg, #e4e4e4 0%, rgba(255, 255, 255, 0.88) 100%);
  box-shadow: 0 16px 28px rgba(18, 78, 64, 0.18);
  border-radius: 18px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  z-index: 2;
}

.price-main {
  display: flex;
  align-items: baseline;
  gap: 8px;
  color: #214b42;
}

.price-main strong {
  font-size: 26px;
}

.price-main span {
  font-size: 12px;
  opacity: 0.7;
}

.price-tags {
  display: inline-flex;
  gap: 8px;
}

.price-tags span {
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(12, 159, 113, 0.12);
  color: #0c9f71;
  font-size: 12px;
  font-weight: 600;
}

.property-info {
  margin-top: 40px;
  background: #ffffff;
  border-radius: 22px;
  padding: 20px;
  box-shadow: 0 16px 30px rgba(18, 78, 64, 0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.property-info h1 {
  margin: 0;
  font-size: 20px;
  color: #214b42;
}

.subtitle {
  margin: 0;
  font-size: 13px;
  color: rgba(33, 75, 66, 0.7);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.info-grid .label {
  display: block;
  font-size: 12px;
  color: rgba(33, 75, 66, 0.6);
}

.info-grid strong {
  font-size: 15px;
  margin-top: 4px;
  display: inline-block;
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip-list span {
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(12, 159, 113, 0.12);
  color: #0c9f71;
  font-size: 12px;
  font-weight: 600;
}

.description {
  margin: 0;
  font-size: 13px;
  color: rgba(33, 75, 66, 0.75);
  line-height: 1.7;
}

.facility-section,
.traffic-card,
.landlord-card {
  background: #ffffff;
  border-radius: 22px;
  padding: 20px;
  box-shadow: 0 16px 30px rgba(18, 78, 64, 0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.facility-section header,
.traffic-card header,
.landlord-card header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #214b42;
}

.facility-section header span,
.traffic-card header span {
  font-size: 12px;
  color: rgba(33, 75, 66, 0.7);
}

.facility-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.facility-grid span {
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(12, 159, 113, 0.08);
  font-size: 13px;
  color: #214b42;
}

.traffic-card p {
  margin: 0;
  font-size: 12px;
  color: rgba(33, 75, 66, 0.7);
  line-height: 1.6;
}

.map-preview {
  position: relative;
  height: 220px;
  border-radius: 20px;
  background: linear-gradient(180deg, #f4fff8 0%, #cdeee1 100%);
  overflow: hidden;
}

.grid .line {
  position: absolute;
  background: rgba(12, 159, 113, 0.15);
}

.horizontal {
  height: 1px;
  width: 100%;
}

.vertical {
  width: 1px;
  height: 100%;
}

.horizontal:nth-child(1) {
  top: 33%;
}
.horizontal:nth-child(2) {
  top: 66%;
}
.vertical:nth-child(3) {
  left: 33%;
}
.vertical:nth-child(4) {
  left: 66%;
}

.marker {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.marker-price {
  background: linear-gradient(135deg, #0acd88 0%, #09a47a 100%);
  color: #fff;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.marker-title {
  background: rgba(12, 159, 113, 0.16);
  color: #0c9f71;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
}

.landlord-card header {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.landlord-card button {
  border: none;
  border-radius: 16px;
  padding: 10px 14px;
  background: rgba(12, 159, 113, 0.12);
  color: #0c9f71;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile h3 {
  margin: 0;
  font-size: 16px;
}

.profile p {
  margin: 4px 0 0;
  font-size: 12px;
  color: rgba(33, 75, 66, 0.65);
}

.contact span {
  font-weight: 600;
}

.contact p {
  margin: 8px 0 0;
  font-size: 12px;
  color: rgba(33, 75, 66, 0.6);
}

.action-bar {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.94);
  padding: 12px 16px;
  border-radius: 22px;
  box-shadow: 0 18px 32px rgba(18, 78, 64, 0.18);
  width: min(360px, calc(100% - 32px));
}

.action-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #214b42;
  font-size: 12px;
}

.action-info strong {
  font-size: 13px;
}

.action-bar button {
  border: none;
  border-radius: 16px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.action-bar .ghost {
  background: rgba(12, 159, 113, 0.12);
  color: #0c9f71;
}

.action-bar .primary {
  background: linear-gradient(135deg, #0acd88 0%, #09a47a 100%);
  color: #fff;
}

@media (max-width: 400px) {
  .price-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .info-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
