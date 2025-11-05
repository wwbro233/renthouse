<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { initCozeChat } from '../plugins/cozeClient'
import { assetUrl } from '../utils/assets'

const router = useRouter()

const loading = ref(false)
const errorMessage = ref('')
const activeFaqs = ref(['faq1'])

const serviceHighlights = [
  {
    id: 'ai',
    title: 'AI 智能问答',
    desc: 'Coze 智能体实时回答租房、签约、维修等问题，为你提供准确建议。',
    icon: 'ChatDotRound'
  },
  {
    id: 'human',
    title: '人工顾问接力',
    desc: '一键转人工顾问，提供定制化找房方案与房源匹配。',
    icon: 'UserFilled'
  },
  {
    id: 'follow',
    title: '进度全程掌控',
    desc: '预约、看房、签约节点同步提醒，重要通知不错过。',
    icon: 'BellFilled'
  }
]

const supportChannels = [
  {
    id: 'online',
    title: 'AI 在线客服',
    desc: '全天候 Coze 智能体，响应更快更精准。',
    icon: 'Headset',
    action: '发起对话'
  },
  {
    id: 'phone',
    title: '电话顾问',
    desc: '工作时间内，金牌顾问 10 分钟内回拨。',
    icon: 'PhoneFilled',
    info: '400-860-8888'
  },
  {
    id: 'visit',
    title: '门店到访',
    desc: '预约线下门店体验，一对一顾问跟进，服务更贴心。',
    icon: 'OfficeBuilding',
    action: '预约门店'
  }
]

const faqs = [
  {
    id: 'faq1',
    question: '如何使用谷粒找房智能客服？',
    answer: '点击页面右下角浮动气泡或本页按钮，即可唤起 Coze 智能客服。输入问题后可即时获得回答，同时支持转人工顾问继续跟进。'
  },
  {
    id: 'faq2',
    question: 'AI 客服可以为我解决哪些问题？',
    answer:
      '智能客服支持快速查询房源、预约看房、租约办理、维修报障、缴费问题等常见问题。对于复杂情况可以升级给人工顾问处理。'
  },
  {
    id: 'faq3',
    question: '人工客服的服务时间是怎样的？',
    answer:
      '人工客服服务时间为每日 8:00-22:00。在此之外，Coze 智能体依然可以 7x24 小时回答常见问题，保障服务不断线。'
  },
  {
    id: 'faq4',
    question: '如何预约门店或安排线下看房？',
    answer:
      '可在智能客服对话中直接输入意向片区和预算，系统会安排顾问与你联系，也可以通过“预约门店”入口选择门店并填写时间。'
  }
]

const handleStartChat = async () => {
  if (loading.value) return
  loading.value = true
  errorMessage.value = ''
  try {
    const client = await initCozeChat()
    if (client?.open) {
      client.open()
    }
  } catch (error) {
    console.error('[Coze] 打开客服失败', error)
    errorMessage.value = '客服暂时繁忙，请稍后再试或拨打客服电话'
  } finally {
    loading.value = false
  }
}

const handleChannelAction = async (channel) => {
  if (!channel.action) return
  if (channel.id === 'online') {
    await handleStartChat()
    return
  }
  if (channel.id === 'visit') {
    router.push('/service')
  }
}
</script>

<template>
  <div class="support-page">
    <section class="support-hero">
      <div class="support-hero__content">
        <span class="support-hero__label">Coze 智能体客服</span>
        <h1>全天候智能客服中心</h1>
        <p>
          借助 Coze 智能体与专业顾问的协同，为你提供 7x24 小时的找房与租住服务支持，快速匹配答案，复杂问题人工接力。
        </p>
        <div class="hero-actions">
          <button
            type="button"
            class="hero-primary"
            :disabled="loading"
            @click="handleStartChat"
          >
            <el-icon size="18"><Headset /></el-icon>
            <span>{{ loading ? '正在连接...' : '立即开启 AI 客服' }}</span>
          </button>
          <button type="button" class="hero-secondary" @click="handleStartChat">
            <el-icon size="18"><ChatDotRound /></el-icon>
            <span>常见问题一键咨询</span>
          </button>
        </div>
        <p v-if="errorMessage" class="hero-error">{{ errorMessage }}</p>
        <ul class="hero-tags">
          <li>7x24 在线支持</li>
          <li>海量房源知识库</li>
          <li>一键转人工顾问</li>
        </ul>
      </div>
      <div class="support-hero__visual">
        <img
          :src="assetUrl('support/support-hero.svg')"
          alt="客服团队"
        />
      </div>
    </section>

    <section class="section-card">
      <header class="section-card__header">
        <h3 class="section-card__title">智能客服亮点</h3>
      </header>
      <div class="highlight-grid">
        <article v-for="item in serviceHighlights" :key="item.id" class="highlight-card">
          <div class="icon-circle">
            <el-icon size="20"><component :is="item.icon" /></el-icon>
          </div>
          <h4>{{ item.title }}</h4>
          <p>{{ item.desc }}</p>
        </article>
      </div>
    </section>

    <section class="section-card">
      <header class="section-card__header">
        <h3 class="section-card__title">多渠道服务方式</h3>
      </header>
      <div class="channel-grid">
        <article v-for="channel in supportChannels" :key="channel.id" class="channel-card">
          <div class="channel-card__icon">
            <el-icon size="24"><component :is="channel.icon" /></el-icon>
          </div>
          <div class="channel-card__body">
            <h4>{{ channel.title }}</h4>
            <p>{{ channel.desc }}</p>
            <span v-if="channel.info" class="channel-card__info">{{ channel.info }}</span>
          </div>
          <button
            v-if="channel.action"
            type="button"
            class="channel-card__action"
            :class="{ 'channel-card__action--primary': channel.id === 'online' }"
            :disabled="channel.id === 'online' && loading"
            @click="handleChannelAction(channel)"
          >
            {{ channel.id === 'online' && loading ? '连接中…' : channel.action }}
          </button>
          <a
            v-else-if="channel.info"
            class="channel-card__call"
            :href="`tel:${channel.info.replace(/-/g, '')}`"
          >
            拨打热线
          </a>
        </article>
      </div>
    </section>

    <section class="section-card">
      <header class="section-card__header">
        <h3 class="section-card__title">常见问题</h3>
      </header>
      <el-collapse v-model="activeFaqs" class="faq-collapse">
        <el-collapse-item
          v-for="faq in faqs"
          :key="faq.id"
          :title="faq.question"
          :name="faq.id"
        >
          <p>{{ faq.answer }}</p>
        </el-collapse-item>
      </el-collapse>
    </section>
  </div>
</template>

<style scoped>
.support-page {
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.support-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: 32px;
  padding: 36px;
  border-radius: 24px;
  background: linear-gradient(135deg, #e6fbf2 0%, #fff7eb 100%);
  position: relative;
  overflow: hidden;
  box-shadow: 0 24px 40px rgba(29, 198, 140, 0.12);
}

.support-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 120% at 100% 0%, rgba(255, 255, 255, 0.6) 0%, transparent 60%);
  pointer-events: none;
}

.support-hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.support-hero__label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  background: rgba(255, 138, 0, 0.12);
  color: var(--brand-secondary);
  width: fit-content;
}

.support-hero h1 {
  margin: 0;
  font-size: 32px;
  color: var(--gray-1);
}

.support-hero p {
  margin: 0;
  color: var(--gray-2);
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-primary,
.hero-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 15px;
  transition: var(--transition-base);
}

.hero-primary {
  background: var(--brand-primary);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 18px 30px rgba(29, 198, 140, 0.18);
}

.hero-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  box-shadow: none;
}

.hero-primary:not(:disabled):hover {
  background: #13b17c;
}

.hero-secondary {
  background: rgba(255, 255, 255, 0.85);
  color: var(--brand-secondary);
  border: 1px solid rgba(255, 138, 0, 0.3);
}

.hero-secondary:hover {
  background: rgba(255, 255, 255, 1);
}

.hero-error {
  margin: 0;
  font-size: 13px;
  color: #f56c6c;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.hero-tags li {
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  color: var(--gray-2);
  font-size: 12px;
}

.support-hero__visual {
  position: relative;
  z-index: 1;
  border-radius: 20px;
  overflow: hidden;
  align-self: stretch;
  box-shadow: 0 20px 32px rgba(15, 23, 42, 0.12);
}

.support-hero__visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.highlight-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.highlight-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border-radius: 16px;
  background: var(--surface-1);
  border: 1px solid rgba(29, 198, 140, 0.08);
  transition: var(--transition-base);
}

.highlight-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
}

.highlight-card h4 {
  margin: 0;
  font-size: 17px;
  color: var(--gray-1);
}

.highlight-card p {
  margin: 0;
  color: var(--gray-3);
  line-height: 1.6;
}

.icon-circle {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(29, 198, 140, 0.12);
  color: var(--brand-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.channel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.channel-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  border-radius: 16px;
  border: 1px solid #e5e7ef;
  background: var(--surface-0);
  transition: var(--transition-base);
}

.channel-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 28px rgba(15, 23, 42, 0.08);
}

.channel-card__icon {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: rgba(255, 138, 0, 0.1);
  color: var(--brand-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.channel-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.channel-card__body h4 {
  margin: 0;
  font-size: 16px;
  color: var(--gray-1);
}

.channel-card__body p {
  margin: 0;
  color: var(--gray-3);
  font-size: 13px;
  line-height: 1.6;
}

.channel-card__info {
  font-weight: 600;
  color: var(--brand-secondary);
}

.channel-card__action {
  border: 1px solid rgba(29, 198, 140, 0.4);
  background: rgba(29, 198, 140, 0.1);
  color: var(--brand-primary);
  border-radius: 999px;
  padding: 8px 16px;
  cursor: pointer;
  transition: var(--transition-base);
}

.channel-card__action--primary {
  background: var(--brand-primary);
  border-color: transparent;
  color: #ffffff;
  font-weight: 600;
}

.channel-card__action:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 20px rgba(29, 198, 140, 0.16);
}

.channel-card__action:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  box-shadow: none;
}

.channel-card__call {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(255, 138, 0, 0.12);
  color: var(--brand-secondary);
  font-weight: 600;
}

.faq-collapse :deep(.el-collapse-item__header) {
  font-weight: 600;
  color: var(--gray-2);
  padding: 12px 0;
}

.faq-collapse :deep(.el-collapse-item__wrap) {
  border-bottom: 1px solid #e5e7ef;
}

.faq-collapse :deep(.el-collapse-item__content) {
  color: var(--gray-3);
  padding-bottom: 16px;
  line-height: 1.8;
}

@media (max-width: 1024px) {
  .support-hero {
    grid-template-columns: 1fr;
  }

  .support-hero__visual {
    display: none;
  }
}

@media (max-width: 768px) {
  .support-hero {
    padding: 28px 20px;
  }

  .channel-grid {
    grid-template-columns: 1fr;
  }
}
</style>
