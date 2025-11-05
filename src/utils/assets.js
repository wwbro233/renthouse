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
 * 获取房源图片URL
 * @param {string} key - 房源图片key
 * @returns {string} 图片URL
 */
export const getPropertyImage = (key = 'city-loft') => {
  const imageKey = propertyImageMap[key] || propertyImageMap['city-loft']
  // 优先使用jpg
  return assetUrl(`${imageKey}.jpg`)
}
