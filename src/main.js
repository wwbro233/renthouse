import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/main.css'
import 'element-plus/dist/index.css'
import { initCozeChat } from './plugins/cozeClient'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(ElementPlus, { locale: zhCn })

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('全局错误:', err, info)
  // 可以在这里添加错误上报逻辑
}

// 性能优化：预加载关键资源
if (import.meta.env.PROD) {
  // 生产环境可以添加资源预加载
}

app.mount('#app')

initCozeChat().catch((error) => {
  console.error('[Coze] 初始化失败', error)
})
