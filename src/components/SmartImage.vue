<script setup>
import { computed, toRef, useAttrs } from 'vue'
import { useImageLoader } from '../composables/useImageLoader'
import { assetUrl } from '../utils/assets'

const props = defineProps({
  src: { type: [String], required: true },
  alt: { type: String, default: '' },
  loading: { type: String, default: 'lazy' }
})

const attrs = useAttrs()
const srcRef = toRef(props, 'src')
const { isLoading, isError, currentSrc, reload } = useImageLoader(srcRef)

const placeholder = assetUrl('booking-default.jpg')

const displaySrc = computed(() => {
  // 如果已经加载成功，使用加载的图片
  if (currentSrc.value) {
    return currentSrc.value
  }
  // 如果加载失败，使用占位图
  if (isError.value) {
    return placeholder
  }
  // 如果正在加载，尝试使用原始 src（可能立即加载成功）
  if (isLoading.value && props.src) {
    return props.src
  }
  // 其他情况返回空，显示骨架屏
  return ''
})
</script>

<template>
  <div class="smart-image">
    <img
      v-if="displaySrc || isLoading"
      :src="displaySrc || placeholder"
      :alt="alt"
      :loading="loading"
      :class="attrs.class"
      @error="reload"
    />
    <div v-else class="image-skeleton" :class="attrs.class"></div>
  </div>
</template>

<style scoped>
.smart-image {
  width: 100%;
  height: 100%;
  display: block;
}
.smart-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.image-skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 0%, #e8efe8 50%, #f0f0f0 100%);
}
</style>
