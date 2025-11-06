/**
 * 获取资源URL
 * 使用 public 目录下的图片，可以直接通过路径访问
 * @param {string} path - 资源路径（相对于 public/images/）
 * @returns {string} 资源URL
 */
export const assetUrl = (path) => {
  // 如果路径已经包含扩展名，直接使用
  if (path.includes('.')) {
    return `/images/${path}`
  }
  
  // 如果没有扩展名，优先使用jpg
  return `/images/${path}.jpg`
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
 * 所有可用的房源图片列表（使用 public 目录路径）
 */
export const allPropertyImages = [
  '/images/properties/property-a.jpg',
  '/images/properties/property-b.jpg',
  '/images/properties/property-c.jpg',
  '/images/properties/property-d.jpg',
  '/images/properties/property-e.jpg',
  '/images/properties/property-f.jpg',
  '/images/properties/property-g.jpg',
  '/images/properties/property-h.jpg',
  '/images/properties/property-i.jpg',
  '/images/properties/property-j.jpg',
  '/images/properties/property-k.jpg',
  '/images/properties/property-l.jpg'
]

/**
 * 所有可用的画廊图片列表（使用 public 目录路径）
 */
export const allGalleryImages = [
  '/images/gallery/property-gallery-1.jpg',
  '/images/gallery/property-gallery-2.jpg',
  '/images/gallery/property-gallery-3.jpg',
  '/images/gallery/property-gallery-4.jpg'
]

/**
 * 所有可用的服务图片列表（使用 public 目录路径）
 */
export const allServiceImages = [
  '/images/services/service-clean-basic.jpg',
  '/images/services/service-clean-plus.jpg',
  '/images/services/service-newbie.jpg',
  '/images/services/service-strip-move.jpg',
  '/images/services/service-strip-smart.jpg',
  '/images/services/service-vip-a.jpg',
  '/images/services/service-vip-b.jpg',
  '/images/services/service-vip-c.jpg'
]

/**
 * 所有可用的发现活动图片列表（使用 public 目录路径）
 */
export const allDiscoverImages = [
  '/images/discover/discover-activity-garden.jpg',
  '/images/discover/discover-activity-party.jpg',
  '/images/discover/discover-activity-run.jpg',
  '/images/discover/discover-benefit.jpg',
  '/images/discover/discover-movie.jpg'
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
    return `/images/${imageKey}.jpg`
  }
  
  // 如果是数字ID，根据ID循环选择图片，确保多样性
  if (typeof idOrKey === 'number') {
    const index = idOrKey % allPropertyImages.length
    return allPropertyImages[index]
  }
  
  // 默认使用第一张
  return allPropertyImages[0]
}

/**
 * 根据ID获取画廊图片
 * @param {number} index - 图片索引
 * @returns {string} 图片URL
 */
export const getGalleryImage = (index = 0) => {
  const imgIndex = index % allGalleryImages.length
  return allGalleryImages[imgIndex]
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
  return allServiceImages[index]
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
  return allDiscoverImages[index]
}
