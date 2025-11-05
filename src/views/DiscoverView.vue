<script setup>
import { useRouter } from 'vue-router'
import { discoverActivities, discoverBenefits } from '../data/mockData'
import { assetUrl } from '../utils/assets'

const router = useRouter()

const momentTopics = [
  { id: 'eat', label: '干饭了' },
  { id: 'birthday', label: '过生日' },
  { id: 'movie', label: '电影夜' },
  { id: 'share', label: '分享此刻' }
]

const momentFeed = discoverActivities.slice(0, 2).map((item) => ({
  id: item.id,
  title: item.title,
  desc: item.desc.slice(0, 42),
  tag: '谷粒瞬间'
}))

const heroHighlight = {
  title: '“出闲置”',
  desc: '整租一套房子，两室一厅，一厨一卫。95平，南北通透，落地窗。家具家电齐全。捡包入住，希望是女...',
  tag: '打摩的'
}

const goActivity = (id) => {
  router.push(`/activity/${id}`)
}

const goBenefit = (id) => {
  router.push(`/benefit/${id}`)
}
</script>

<template>
  <div class="discover-page">
    <section class="hero">
      <header>
        <h2>家庭服务</h2>
        <p>与100万用户发现生活</p>
        <div class="hero-meta">
          <span>4998 位小谷粒</span>
          <span>正在分享此刻</span>
        </div>
      </header>
      <div class="hero-bubbles">
        <button v-for="item in momentTopics" :key="item.id" type="button">
          {{ item.label }}
        </button>
      </div>
    </section>

    <section class="moment-highlight">
      <div class="moment-tags">
        <span class="tag">谷粒福利</span>
        <span class="tag">#福利介绍文字</span>
      </div>
      <div class="moment-title">
        <h3>{{ heroHighlight.title }}</h3>
        <span class="icon">🔍</span>
      </div>
      <div class="moment-desc">
        <strong>{{ heroHighlight.tag }}</strong>
        <p>{{ heroHighlight.desc }}</p>
      </div>
    </section>

    <section class="moment-feed">
      <header>
        <h3>谷粒瞬间</h3>
        <button type="button">更多</button>
      </header>
      <article v-for="item in momentFeed" :key="item.id" @click="goActivity(item.id)">
        <div class="feed-tag">{{ item.tag }}</div>
        <h4>{{ item.title }}</h4>
        <p>{{ item.desc }}...</p>
      </article>
    </section>

    <section class="benefit-banner">
      <div class="benefit-meta">
        <span class="tag">小谷粒福利</span>
        <h3>谷粒请你看电影</h3>
        <p>春季特惠，福利实时更新</p>
      </div>
      <img :src="assetUrl('discover/discover-movie.svg')" alt="movie" />
    </section>

    <section class="benefit-list">
      <header>
        <h3>福利中心</h3>
        <button type="button" @click="goBenefit(discoverBenefits[0].id)">
          查看全部
        </button>
      </header>
      <article v-for="benefit in discoverBenefits" :key="benefit.id">
        <img :src="benefit.cover" :alt="benefit.title" />
        <div>
          <div class="benefit-head">
            <span class="benefit-type">{{ benefit.type }}</span>
            <span class="benefit-expire">有效期至 {{ benefit.expire }}</span>
          </div>
          <h4>{{ benefit.title }}</h4>
          <p>{{ benefit.desc }}</p>
          <button type="button" @click="goBenefit(benefit.id)">立即领取</button>
        </div>
      </article>
    </section>

    <section class="activity-list">
      <header>
        <h3>线下活动</h3>
        <button type="button" @click="goActivity(discoverActivities[0].id)">查看更多</button>
      </header>
      <article v-for="activity in discoverActivities" :key="activity.id" @click="goActivity(activity.id)">
        <img :src="activity.cover" :alt="activity.title" />
        <div class="activity-body">
          <div class="activity-tag">{{ activity.tag }}</div>
          <h4>{{ activity.title }}</h4>
          <p>
            <el-icon><Clock /></el-icon>
            {{ activity.time }}
          </p>
          <p>
            <el-icon><Location /></el-icon>
            {{ activity.location }}
          </p>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.discover-page {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 32px;
}

.hero {
  background: linear-gradient(180deg, #abf1d2 0%, #d9f8e9 60%, #ffffff 100%);
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 18px 32px rgba(28, 108, 88, 0.16);
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: #1f4c43;
}

.hero header h2 {
  margin: 0;
  font-size: 22px;
}

.hero header p {
  margin: 6px 0 0;
  font-size: 14px;
  opacity: 0.7;
}

.hero-meta {
  margin-top: 12px;
  display: inline-flex;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.hero-bubbles {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hero-bubbles button {
  border: none;
  border-radius: 999px;
  padding: 8px 14px;
  background: rgba(12, 159, 113, 0.12);
  color: #0c9f71;
  font-size: 13px;
  cursor: pointer;
}

.moment-highlight {
  background: #ffffff;
  border-radius: 22px;
  padding: 18px;
  box-shadow: 0 16px 28px rgba(18, 78, 64, 0.12);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.moment-tags {
  display: flex;
  gap: 8px;
}

.moment-tags .tag {
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(12, 159, 113, 0.12);
  color: #0c9f71;
  font-size: 12px;
}

.moment-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #244d43;
}

.moment-title h3 {
  margin: 0;
  font-size: 20px;
}

.moment-title .icon {
  font-size: 20px;
}

.moment-desc {
  color: #244d43;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
}

.moment-desc strong {
  font-size: 12px;
  opacity: 0.7;
}

.moment-feed {
  background: #ffffff;
  border-radius: 22px;
  padding: 18px;
  box-shadow: 0 16px 28px rgba(18, 78, 64, 0.12);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.moment-feed header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #244d43;
}

.moment-feed header button {
  border: none;
  background: transparent;
  color: #0c9f71;
  font-size: 13px;
  cursor: pointer;
}

.moment-feed article {
  background: rgba(12, 159, 113, 0.08);
  border-radius: 18px;
  padding: 16px;
  color: #244d43;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(18, 78, 64, 0.08);
}

.moment-feed article:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(18, 78, 64, 0.16);
  background: rgba(12, 159, 113, 0.15);
}

.feed-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(12, 159, 113, 0.12);
  color: #0c9f71;
  font-size: 12px;
  margin-bottom: 8px;
}

.moment-feed h4 {
  margin: 0;
  font-size: 15px;
}

.moment-feed p {
  margin: 6px 0 0;
  font-size: 13px;
  opacity: 0.75;
}

.benefit-banner {
  background: linear-gradient(135deg, #e6fff5 0%, #c9f7e3 100%);
  border-radius: 22px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: #244d43;
  box-shadow: 0 18px 32px rgba(18, 78, 64, 0.12);
}

.benefit-banner .tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(12, 159, 113, 0.12);
  color: #0c9f71;
  font-size: 12px;
  margin-bottom: 8px;
}

.benefit-banner h3 {
  margin: 0;
  font-size: 20px;
}

.benefit-banner p {
  margin: 6px 0 0;
  font-size: 13px;
}

.benefit-banner img {
  width: 120px;
  border-radius: 16px;
  object-fit: cover;
}

.benefit-list {
  background: #ffffff;
  border-radius: 22px;
  padding: 18px;
  box-shadow: 0 16px 28px rgba(18, 78, 64, 0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.benefit-list header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #244d43;
}

.benefit-list header button {
  border: none;
  background: transparent;
  color: #0c9f71;
  cursor: pointer;
  font-size: 13px;
}

.benefit-list article {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: rgba(12, 159, 113, 0.08);
  border-radius: 18px;
  padding: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(18, 78, 64, 0.08);
  cursor: pointer;
}

.benefit-list article:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(18, 78, 64, 0.16);
  background: rgba(12, 159, 113, 0.15);
}

.benefit-list img {
  width: 82px;
  height: 82px;
  border-radius: 14px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.benefit-list article:hover img {
  transform: scale(1.05);
}

.benefit-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  color: rgba(36, 77, 67, 0.7);
}

.benefit-type {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 10px;
  background: rgba(12, 159, 113, 0.16);
  color: #0c9f71;
  font-weight: 600;
}

.benefit-list h4 {
  margin: 6px 0 0;
  font-size: 15px;
  color: #244d43;
}

.benefit-list p {
  margin: 4px 0 10px;
  font-size: 12px;
  color: rgba(36, 77, 67, 0.75);
}

.benefit-list button {
  border: none;
  background: linear-gradient(135deg, #0acd88 0%, #09a47a 100%);
  color: #ffffff;
  border-radius: 14px;
  padding: 8px 16px;
  font-size: 12px;
  cursor: pointer;
}

.activity-list {
  background: #ffffff;
  border-radius: 22px;
  padding: 18px;
  box-shadow: 0 18px 28px rgba(18, 78, 64, 0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-list header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #244d43;
}

.activity-list header button {
  border: none;
  background: transparent;
  color: #0c9f71;
  cursor: pointer;
  font-size: 13px;
}

.activity-list article {
  display: flex;
  gap: 12px;
  border-radius: 18px;
  background: rgba(12, 159, 113, 0.08);
  padding: 16px;
  color: #244d43;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(18, 78, 64, 0.08);
}

.activity-list article:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(18, 78, 64, 0.16);
  background: rgba(12, 159, 113, 0.15);
}

.activity-list img {
  width: 112px;
  height: 88px;
  border-radius: 14px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.activity-list article:hover img {
  transform: scale(1.05);
}

.activity-body h4 {
  margin: 0;
  font-size: 15px;
}

.activity-body p {
  margin: 4px 0 0;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(36, 77, 67, 0.7);
}

.activity-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(12, 159, 113, 0.16);
  color: #0c9f71;
  font-size: 12px;
  margin-bottom: 6px;
}

@media (max-width: 420px) {
  .benefit-banner {
    flex-direction: column;
    align-items: flex-start;
  }

  .benefit-banner img {
    width: 100%;
  }

  .benefit-list article,
  .activity-list article {
    flex-direction: column;
  }

  .benefit-list img,
  .activity-list img {
    width: 100%;
    height: 160px;
  }
}
</style>
