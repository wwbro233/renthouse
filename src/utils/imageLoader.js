/**
 * 图片加载工具
 * 提供图片懒加载和错误处理功能
 */

/**
 * 图片懒加载指令
 * @param {HTMLElement} el - 图片元素
 * @param {string} binding - 绑定的值（图片URL）
 */
export const lazyLoadDirective = {
  mounted(el, binding) {
    const imageSrc = binding.value
    if (!imageSrc) return

    // 创建 Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            img.src = imageSrc
            img.classList.add('loaded')
            observer.unobserve(img)
          }
        })
      },
      {
        rootMargin: '50px'
      }
    )

    // 设置占位符
    el.dataset.src = imageSrc
    el.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="100%25" height="100%25" fill="%23f0f0f0"/%3E%3C/svg%3E'
    el.classList.add('lazy-image')

    observer.observe(el)

    // 错误处理
    el.addEventListener('error', () => {
      if (!el.dataset.fallbacked) {
        el.dataset.fallbacked = '1'
        // 尝试回退到svg版本
        const fallbackSrc = imageSrc.replace(/\.jpg$/, '.svg')
        if (fallbackSrc !== imageSrc) {
          el.src = fallbackSrc
        } else {
          // 使用默认占位图
          el.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="100%25" height="100%25" fill="%23e0e0e0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3E图片加载失败%3C/text%3E%3C/svg%3E'
        }
      }
    })
  },
  unmounted(el) {
    // 清理
    if (el._observer) {
      el._observer.disconnect()
    }
  }
}

/**
 * 预加载图片
 * @param {string[]} urls - 图片URL数组
 * @returns {Promise<void>}
 */
export const preloadImages = (urls) => {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = resolve
          img.onerror = reject
          img.src = url
        })
    )
  )
}

/**
 * 获取图片优化URL（支持WebP）
 * @param {string} url - 原始URL
 * @param {object} options - 选项
 * @returns {string} 优化后的URL
 */
export const getOptimizedImageUrl = (url, options = {}) => {
  const { width, height, quality = 80, format = 'webp' } = options

  // 如果是外部URL，使用图片代理
  if (url.startsWith('http')) {
    const params = new URLSearchParams()
    if (width) params.append('w', width)
    if (height) params.append('h', height)
    params.append('q', quality)
    return `${url}?${params.toString()}`
  }

  return url
}

