/**
 * 创建资源URL
 * @param {string} path - 资源路径
 * @returns {string} 资源URL
 */
const createUrl = (path) => {
  try {
    return new URL(`../assets/images/${path}`, import.meta.url).href
  } catch (error) {
    console.warn(`Failed to create URL for path: ${path}`, error)
    return `/assets/images/${path}`
  }
}

/**
 * 获取资源URL，优先使用jpg，如果不存在则使用svg
 * @param {string} path - 资源路径
 * @returns {string} 资源URL
 */
export const assetUrl = (path) => {
  // 如果路径已经包含扩展名，直接使用
  if (path.includes('.')) {
    return createUrl(path)
  }
  
  // 如果没有扩展名，优先使用jpg
  return createUrl(`${path}.jpg`)
}

/**
 * 房源图片映射表
 */
export const propertyImageMap = {
  'city-loft': 'properties/property-a',
  'garden-home': 'properties/property-b',
  'tech-suite': 'properties/property-c',
  'duplex': 'properties/property-d',
  'co-living': 'properties/property-e',
  'creative-hub': 'properties/property-f',
  'family-home': 'properties/property-g',
  'master-suite': 'properties/property-h',
  'garden-villa': 'properties/property-i',
  'metro-life': 'properties/property-j',
  'digital-share': 'properties/property-k',
  'cbd-elite': 'properties/property-l'
}

/**
 * 所有可用的房源图片列表（按字母顺序）
 */
export const allPropertyImages = [
  'properties/property-a',
  'properties/property-b',
  'properties/property-c',
  'properties/property-d',
  'properties/property-e',
  'properties/property-f',
  'properties/property-g',
  'properties/property-h',
  'properties/property-i',
  'properties/property-j',
  'properties/property-k',
  'properties/property-l'
]

/**
 * 所有可用的画廊图片列表
 */
export const allGalleryImages = [
  'gallery/property-gallery-1',
  'gallery/property-gallery-2',
  'gallery/property-gallery-3',
  'gallery/property-gallery-4'
]

/**
 * 所有可用的服务图片列表
 */
export const allServiceImages = [
  'services/service-clean-basic',
  'services/service-clean-plus',
  'services/service-newbie',
  'services/service-strip-move',
  'services/service-strip-smart',
  'services/service-vip-a',
  'services/service-vip-b',
  'services/service-vip-c'
]

/**
 * 所有可用的发现活动图片列表
 */
export const allDiscoverImages = [
  'discover/discover-activity-garden',
  'discover/discover-activity-party',
  'discover/discover-activity-run',
  'discover/discover-benefit',
  'discover/discover-movie'
]

/**
 * 根据ID或索引获取房源图片（确保图片多样化）
 * @param {string|number} idOrKey - 房源ID、key或索引
 * @returns {string} 图片URL
 */
export const getPropertyImage = (idOrKey = 'city-loft') => {
  // 如果是已知的key，使用映射表
  if (typeof idOrKey === 'string' && propertyImageMap[idOrKey]) {
    const imageKey = propertyImageMap[idOrKey]
    return assetUrl(`${imageKey}.jpg`)
  }
  
  // 如果是数字ID，根据ID循环选择图片，确保多样性
  if (typeof idOrKey === 'number') {
    const index = idOrKey % allPropertyImages.length
    return assetUrl(`${allPropertyImages[index]}.jpg`)
  }
  
  // 默认使用第一张
  return assetUrl(`${allPropertyImages[0]}.jpg`)
}

/**
 * 根据ID获取画廊图片
 * @param {number} index - 图片索引
 * @returns {string} 图片URL
 */
export const getGalleryImage = (index = 0) => {
  const imgIndex = index % allGalleryImages.length
  return assetUrl(`${allGalleryImages[imgIndex]}.jpg`)
}

/**
 * 根据ID获取服务图片
 * @param {number|string} idOrIndex - 服务ID或索引
 * @returns {string} 图片URL
 */
export const getServiceImage = (idOrIndex = 0) => {
  let index = 0
  if (typeof idOrIndex === 'number') {
    index = idOrIndex % allServiceImages.length
  } else {
    // 如果是字符串ID，转换为数字
    const id = String(idOrIndex).split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
    index = id % allServiceImages.length
  }
  return assetUrl(`${allServiceImages[index]}.jpg`)
}

/**
 * 根据ID获取发现活动图片
 * @param {number|string} idOrIndex - 活动ID或索引
 * @returns {string} 图片URL
 */
export const getDiscoverImage = (idOrIndex = 0) => {
  let index = 0
  if (typeof idOrIndex === 'number') {
    index = idOrIndex % allDiscoverImages.length
  } else {
    const id = String(idOrIndex).split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
    index = id % allDiscoverImages.length
  }
  return assetUrl(`${allDiscoverImages[index]}.jpg`)
}
