import { assetUrl } from './assets'

/**
 * 分类图片映射
 * 将分类ID映射到本地图片资源
 */
export const categoryImageMap = {
  // 时长类
  'short-rent': assetUrl('categories/category-short.jpg'),
  'long-rent': assetUrl('categories/category-large.jpg'),
  'daily-rent': assetUrl('categories/category-short.jpg'),
  'quarter-rent': assetUrl('categories/category-one.jpg'),
  'half-year': assetUrl('categories/category-two.jpg'),
  'monthly': assetUrl('categories/category-one.jpg'),
  
  // 房型类
  'share': assetUrl('categories/category-share.jpg'),
  'studio': assetUrl('categories/category-studio.jpg'),
  'one-room': assetUrl('categories/category-one.jpg'),
  'two-room': assetUrl('categories/category-two.jpg'),
  'single-apt': assetUrl('categories/category-studio.jpg'),
  'loft': assetUrl('categories/category-large.jpg'),
  'villa': assetUrl('categories/category-large.jpg'),
  'penthouse': assetUrl('categories/category-large.jpg'),
  
  // 区位配套类
  'school': assetUrl('categories/category-large.jpg'),
  'metro': assetUrl('categories/category-one.jpg'),
  'business': assetUrl('categories/category-two.jpg'),
  'scenic': assetUrl('categories/category-large.jpg'),
  'hospital': assetUrl('categories/category-one.jpg'),
  'park': assetUrl('categories/category-large.jpg'),
  
  // 装修风格类
  'furnished': assetUrl('categories/category-large.jpg'),
  'homestay': assetUrl('categories/category-one.jpg'),
  'minimal': assetUrl('categories/category-studio.jpg'),
  'luxury': assetUrl('categories/category-large.jpg'),
  'modern': assetUrl('categories/category-two.jpg'),
  'european': assetUrl('categories/category-large.jpg'),
  
  // 特殊配置类
  'balcony': assetUrl('categories/category-large.jpg'),
  'pet-friendly': assetUrl('categories/category-one.jpg'),
  'parking': assetUrl('categories/category-two.jpg'),
  'smart-home': assetUrl('categories/category-studio.jpg'),
  'gym': assetUrl('categories/category-large.jpg'),
  'pool': assetUrl('categories/category-large.jpg'),
  
  // 支付优惠类
  'deposit': assetUrl('categories/category-deposit.jpg'),
  'installment': assetUrl('categories/category-deposit.jpg'),
  'first-month': assetUrl('categories/category-deposit.jpg'),
  'discount': assetUrl('categories/category-deposit.jpg'),
  'coupon': assetUrl('categories/category-deposit.jpg'),
}

/**
 * 获取分类图片
 * @param {string} categoryId - 分类ID
 * @returns {string} 图片URL
 */
export const getCategoryImage = (categoryId) => {
  return categoryImageMap[categoryId] || assetUrl('categories/category-one.jpg')
}


