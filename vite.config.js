import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // 构建优化
  build: {
    // 启用压缩（使用esbuild，更快）
    minify: 'esbuild',
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'element-plus': ['element-plus'],
          'utils': ['axios']
        }
      }
    },
    // 资源内联阈值
    assetsInlineLimit: 4096
  },
  // 开发服务器配置
  server: {
    port: 5173,
    open: true,
    cors: true
  },
  // 预览服务器配置
  preview: {
    port: 4173,
    open: true
  }
})
