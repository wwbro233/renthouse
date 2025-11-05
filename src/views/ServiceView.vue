<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { homeServices, serviceCampaigns, vipServices } from '../data/mockData'
import { assetUrl } from '../utils/assets'

const router = useRouter()

const heroSummary = [
  { label: '余额', value: '0元' },
  { label: '优惠券', value: '4张' },
  { label: '会员特权', value: '7项' },
  { label: '会员福利', value: '21个' }
]

const calendarTabs = ['10月', '11月', '12月', '01月', '02月', '03月']
const activeTab = ref('12月')

const cleaningDeals = [
  {
    id: 'clean-2',
    title: '日常保洁2小时',
    desc: '推荐60㎡以内的房屋',
    price: 80,
    origin: 119,
    cover: assetUrl('services/service-clean-basic.svg')
  },
  {
    id: 'clean-3',
    title: '日常保洁3小时',
    desc: '推荐80㎡以内的房屋',
    price: 135,
    origin: 179,
    cover: assetUrl('services/service-clean-plus.svg')
  }
]

const newbieBenefits = computed(() => serviceCampaigns.slice(0, 1)[0])

const goServiceDetail = (id) => {
  router.push(`/service-detail/${id}`)
}

const goVipDetail = (id) => {
  router.push(`/service-detail/${id}`)
}

const goCampaign = () => {
  router.push('/service')
}
</script>

<template>
  <div class="service-page">
    <section class="vip-hero">
      <header>
        <div>
          <p>请选择地址</p>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <div class="vip-hero__icons">
          <el-icon size="20"><ChatDotRound /></el-icon>
          <el-icon size="20"><Headset /></el-icon>
        </div>
      </header>
      <div class="vip-card">
        <div class="vip-card__left">
          <h3>开通谷粒卡享特权</h3>
          <p>VIP</p>
        </div>
        <ul class="vip-card__stats">
          <li v-for="item in heroSummary" :key="item.label">
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="service-grid">
      <header>
        <h3>家庭服务</h3>
        <button type="button" @click="router.push('/service')">全部服务</button>
      </header>
      <div class="service-grid__list">
        <button
          v-for="item in homeServices"
          :key="item.id"
          type="button"
          @click="goServiceDetail(item.id)"
        >
          <span class="icon-wrap">
            <el-icon><component :is="item.icon" /></el-icon>
          </span>
          <span class="service-title">{{ item.title }}</span>
          <span class="service-desc">{{ item.desc }}</span>
        </button>
      </div>
    </section>

    <section class="calendar-card">
      <header>
        <h3>服务日历</h3>
        <button type="button">全部服务</button>
      </header>
      <div class="calendar-tabs">
        <button
          v-for="tab in calendarTabs"
          :key="tab"
          type="button"
          :class="{ active: activeTab === tab }"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>
      <div class="calendar-event">
        <div class="calendar-event__date">
          <span>12.9-12.19</span>
          <p>限享6大礼包</p>
        </div>
        <div class="calendar-event__info">
          <p>包年服务好礼享不停</p>
          <strong>最高领¥300优惠券</strong>
        </div>
        <button type="button" @click="goCampaign()">立即参与</button>
      </div>
    </section>

    <section class="vip-section">
      <header>
        <h3>会员精选</h3>
        <span>专业服务</span>
      </header>
      <div class="vip-section__chips">
        <span class="chip active">居家保洁</span>
        <span class="chip">深层清洗</span>
        <span class="chip">新居乔迁</span>
        <span class="chip">上门喂猫</span>
      </div>
      <div class="vip-cards">
        <article
          v-for="item in vipServices"
          :key="item.id"
          @click="goVipDetail(item.id)"
        >
          <img :src="item.cover" :alt="item.title" />
          <div>
            <h4>{{ item.title }}</h4>
            <p>{{ item.desc }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="newbie-card" v-if="newbieBenefits">
      <header>新人专区</header>
      <div class="newbie-card__content">
        <h4>新人见面礼</h4>
        <p>领30元专属优惠券</p>
        <button type="button" @click="goCampaign()">立即领取</button>
      </div>
      <img :src="assetUrl('services/service-newbie.svg')" alt="newbie" />
    </section>

    <section class="cleaning-grid">
      <header>洁净家</header>
      <div class="cleaning-grid__list">
        <article v-for="deal in cleaningDeals" :key="deal.id">
          <img :src="deal.cover" :alt="deal.title" />
          <h5>{{ deal.title }}</h5>
          <p>{{ deal.desc }}</p>
          <div class="cleaning-grid__price">
            <strong>¥{{ deal.price }}</strong>
            <span>¥{{ deal.origin }}</span>
          </div>
          <button type="button" @click="goServiceDetail(deal.id)">立即预约</button>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.service-page {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 32px;
}

.vip-hero {
  background: linear-gradient(180deg, #9ee2c2 0%, #c5f5dd 60%, #ffffff 100%);
  border-radius: 24px;
  padding: 18px 18px 26px;
  box-shadow: 0 18px 34px rgba(32, 102, 84, 0.18);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.vip-hero header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #245049;
}

.vip-hero header div:first-child {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.6);
  padding: 10px 14px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 13px;
}

.vip-hero__icons {
  display: flex;
  gap: 12px;
  color: rgba(36, 80, 73, 0.6);
}

.vip-card {
  background: linear-gradient(135deg, #2f5140 0%, #152d2a 100%);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 18px;
  color: #d0ffe9;
}

.vip-card__left h3 {
  margin: 0;
  font-size: 18px;
}

.vip-card__left p {
  margin: 4px 0 0;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.2em;
}

.vip-card__stats {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.vip-card__stats li {
  background: rgba(255, 255, 255, 0.08);
  padding: 10px 12px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}

.vip-card__stats strong {
  font-size: 16px;
}

.vip-card__stats span {
  font-size: 12px;
  opacity: 0.8;
}

.service-grid {
  background: #ffffff;
  border-radius: 22px;
  padding: 18px;
  box-shadow: 0 16px 28px rgba(20, 78, 64, 0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.service-grid header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.service-grid h3 {
  margin: 0;
  font-size: 18px;
  color: #244b42;
}

.service-grid header button {
  border: none;
  background: transparent;
  color: #0c9f71;
  font-size: 13px;
  cursor: pointer;
}

.service-grid__list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.service-grid__list button {
  border: none;
  border-radius: 18px;
  background: rgba(12, 159, 113, 0.08);
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  color: #245049;
  cursor: pointer;
  min-height: 120px;
}

.service-grid__list .icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: rgba(12, 159, 113, 0.16);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.service-title {
  font-weight: 600;
  font-size: 14px;
}

.service-desc {
  font-size: 12px;
  color: rgba(36, 80, 73, 0.65);
}

.calendar-card {
  background: #ffffff;
  border-radius: 22px;
  padding: 18px;
  box-shadow: 0 16px 30px rgba(20, 78, 64, 0.14);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.calendar-card header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.calendar-card h3 {
  margin: 0;
  font-size: 18px;
  color: #244b42;
}

.calendar-card header button {
  border: none;
  background: transparent;
  color: #0c9f71;
  cursor: pointer;
  font-size: 13px;
}

.calendar-tabs {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.calendar-tabs button {
  border: none;
  border-radius: 14px;
  padding: 10px 0;
  background: rgba(12, 159, 113, 0.08);
  color: #245049;
  font-size: 13px;
  cursor: pointer;
}

.calendar-tabs button.active {
  background: linear-gradient(135deg, #0acd88 0%, #09a47a 100%);
  color: #ffffff;
  box-shadow: 0 12px 22px rgba(12, 159, 113, 0.28);
}

.calendar-event {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #f4fff4 0%, #d7f6e4 100%);
  border-radius: 18px;
  padding: 16px;
  color: #255248;
}

.calendar-event__date span {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(12, 159, 113, 0.12);
  color: #0c9f71;
  font-size: 12px;
  font-weight: 600;
}

.calendar-event__date p {
  margin: 8px 0 0;
  font-size: 13px;
}

.calendar-event__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}

.calendar-event__info strong {
  color: #e7502a;
  font-size: 16px;
}

.calendar-event button {
  border: none;
  border-radius: 18px;
  padding: 10px 18px;
  background: linear-gradient(135deg, #0acd88 0%, #09a47a 100%);
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
}

.vip-section {
  background: #ffffff;
  border-radius: 22px;
  padding: 18px;
  box-shadow: 0 18px 30px rgba(20, 78, 64, 0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.vip-section header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #244b42;
}

.vip-section header span {
  font-size: 12px;
  color: rgba(36, 75, 66, 0.6);
}

.vip-section__chips {
  display: flex;
  gap: 8px;
}

.chip {
  padding: 6px 12px;
  border-radius: 16px;
  background: rgba(12, 159, 113, 0.1);
  color: #245049;
  font-size: 12px;
}

.chip.active {
  background: linear-gradient(135deg, #0acd88 0%, #09a47a 100%);
  color: #ffffff;
}

.vip-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vip-cards article {
  display: flex;
  gap: 14px;
  border-radius: 18px;
  background: rgba(12, 159, 113, 0.08);
  padding: 12px;
  cursor: pointer;
}

.vip-cards img {
  width: 92px;
  height: 72px;
  border-radius: 12px;
  object-fit: cover;
}

.vip-cards h4 {
  margin: 0;
  font-size: 15px;
  color: #244b42;
}

.vip-cards p {
  margin: 6px 0 0;
  font-size: 12px;
  color: rgba(36, 75, 66, 0.7);
}

.newbie-card {
  position: relative;
  background: linear-gradient(135deg, #e7fff1 0%, #bbf6d9 100%);
  border-radius: 22px;
  padding: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 18px 30px rgba(20, 78, 64, 0.12);
}

.newbie-card header {
  font-size: 15px;
  color: #245049;
}

.newbie-card__content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #245049;
}

.newbie-card__content h4 {
  margin: 0;
  font-size: 18px;
}

.newbie-card__content button {
  align-self: flex-start;
  border: none;
  border-radius: 18px;
  padding: 10px 18px;
  background: linear-gradient(135deg, #0acd88 0%, #09a47a 100%);
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
}

.newbie-card img {
  position: absolute;
  right: -10px;
  bottom: -10px;
  width: 150px;
  opacity: 0.35;
}

.cleaning-grid {
  background: #ffffff;
  border-radius: 22px;
  padding: 18px;
  box-shadow: 0 18px 30px rgba(20, 78, 64, 0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cleaning-grid header {
  font-size: 18px;
  color: #244b42;
}

.cleaning-grid__list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.cleaning-grid__list article {
  border-radius: 18px;
  background: rgba(12, 159, 113, 0.08);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cleaning-grid__list img {
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 12px;
  object-fit: cover;
}

.cleaning-grid__list h5 {
  margin: 0;
  font-size: 15px;
  color: #244b42;
}

.cleaning-grid__list p {
  margin: 0;
  font-size: 12px;
  color: rgba(36, 75, 66, 0.68);
}

.cleaning-grid__price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  color: #e7502a;
}

.cleaning-grid__price strong {
  font-size: 18px;
}

.cleaning-grid__price span {
  font-size: 12px;
  color: rgba(36, 75, 66, 0.6);
  text-decoration: line-through;
}

.cleaning-grid__list button {
  border: none;
  border-radius: 16px;
  padding: 10px;
  background: linear-gradient(135deg, #0acd88 0%, #09a47a 100%);
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 420px) {
  .vip-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .vip-card__stats {
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
  }

  .service-grid__list {
    grid-template-columns: repeat(2, 1fr);
  }

  .calendar-tabs {
    grid-template-columns: repeat(3, 1fr);
  }

  .calendar-event {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .vip-cards article {
    flex-direction: column;
  }

  .cleaning-grid__list {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
