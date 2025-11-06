import { ref, watch } from 'vue'

/**
 * 图片加载组合式函数
 * 提供图片加载状态管理和错误处理
 */
export function useImageLoader(imageUrl) {
  const isLoading = ref(true)
  const isError = ref(false)
  const currentSrc = ref('')

  const loadImage = () => {
    if (!imageUrl.value) {
      currentSrc.value = ''
      isLoading.value = false
      return
    }

    isLoading.value = true
    isError.value = false
    currentSrc.value = ''

    const img = new Image()
    
    img.onload = () => {
      isLoading.value = false
      currentSrc.value = imageUrl.value
      isError.value = false
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
          currentSrc.value = ''
          isError.value = true
        }
        fallbackImg.src = fallbackUrl
      } else {
        currentSrc.value = ''
        isError.value = true
      }
    }

    img.src = imageUrl.value
  }

  // 监听图片URL变化
  watch(imageUrl, () => {
    loadImage()
  }, { immediate: true })

  return {
    isLoading,
    isError,
    currentSrc,
    reload: loadImage
  }
}

