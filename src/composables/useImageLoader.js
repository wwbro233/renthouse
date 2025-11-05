import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 图片加载组合式函数
 * 提供图片加载状态管理和错误处理
 */
export function useImageLoader(imageUrl) {
  const isLoading = ref(true)
  const isError = ref(false)
  const currentSrc = ref('')

  const loadImage = () => {
    if (!imageUrl.value) return

    isLoading.value = true
    isError.value = false

    const img = new Image()
    
    img.onload = () => {
      isLoading.value = false
      currentSrc.value = imageUrl.value
    }

    img.onerror = () => {
      isLoading.value = false
      isError.value = true
      
      // 尝试回退到svg版本
      const fallbackUrl = imageUrl.value.replace(/\.jpg$/, '.svg')
      if (fallbackUrl !== imageUrl.value) {
        const fallbackImg = new Image()
        fallbackImg.onload = () => {
          currentSrc.value = fallbackUrl
          isError.value = false
        }
        fallbackImg.onerror = () => {
          currentSrc.value = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="100%25" height="100%25" fill="%23e0e0e0"/%3E%3C/svg%3E'
        }
        fallbackImg.src = fallbackUrl
      } else {
        currentSrc.value = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="100%25" height="100%25" fill="%23e0e0e0"/%3E%3C/svg%3E'
      }
    }

    img.src = imageUrl.value
  }

  onMounted(() => {
    loadImage()
  })

  return {
    isLoading,
    isError,
    currentSrc,
    reload: loadImage
  }
}

