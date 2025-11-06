/**
 * 真正不同的分类图片列表（经过去重验证）
 * 注意：category-deposit 和 category-one 是同一张图片
 *      category-share 和 category-short 是同一张图片
 * 实际只有6种不同的图片
 * 
 * 使用 public 目录下的图片，可以直接通过路径访问
 */
const allCategoryImages = [
  '/images/categories/category-large.jpg',    // 0 - 独特图片
  '/images/categories/category-small.jpg',    // 1 - 独特图片
  '/images/categories/category-studio.jpg',   // 2 - 独特图片
  '/images/categories/category-two.jpg',      // 3 - 独特图片
  '/images/categories/category-one.jpg',      // 4 - 独特图片 (deposit 也是这张)
  '/images/categories/category-share.jpg'     // 5 - 独特图片 (short 也是这张)
]

/**
 * 分类图片映射
 * 将分类ID映射到本地图片资源
 * 策略：确保同一组内的项目使用不同的图片（循环使用6种图片）
 */
export const categoryImageMap = {
  // 时长类 - 6个项目使用6种不同图片
  'short-rent': allCategoryImages[5],     // category-share/short
  'long-rent': allCategoryImages[0],      // category-large
  'daily-rent': allCategoryImages[1],     // category-small
  'quarter-rent': allCategoryImages[4],   // category-one/deposit
  'half-year': allCategoryImages[3],      // category-two
  'monthly': allCategoryImages[2],        // category-studio
  
  // 房型类 - 8个项目循环使用6种图片，确保相邻的不重复
  'share': allCategoryImages[5],          // category-share/short
  'studio': allCategoryImages[2],         // category-studio
  'one-room': allCategoryImages[4],       // category-one/deposit
  'two-room': allCategoryImages[3],       // category-two
  'single-apt': allCategoryImages[1],     // category-small
  'loft': allCategoryImages[0],           // category-large
  'villa': allCategoryImages[5],          // category-share/short (复用)
  'penthouse': allCategoryImages[2],      // category-studio (复用)
  
  // 区位配套类 - 6个项目使用6种不同图片
  'school': allCategoryImages[0],         // category-large
  'metro': allCategoryImages[3],          // category-two
  'business': allCategoryImages[1],       // category-small
  'scenic': allCategoryImages[5],         // category-share/short
  'hospital': allCategoryImages[4],       // category-one/deposit
  'park': allCategoryImages[2],           // category-studio
  
  // 装修风格类 - 6个项目使用6种不同图片
  'furnished': allCategoryImages[0],      // category-large
  'homestay': allCategoryImages[5],       // category-share/short
  'minimal': allCategoryImages[2],        // category-studio
  'luxury': allCategoryImages[4],         // category-one/deposit
  'modern': allCategoryImages[3],         // category-two
  'european': allCategoryImages[1],       // category-small
  
  // 特殊配置类 - 6个项目使用6种不同图片
  'balcony': allCategoryImages[4],        // category-one/deposit
  'pet-friendly': allCategoryImages[5],   // category-share/short
  'parking': allCategoryImages[3],        // category-two
  'smart-home': allCategoryImages[2],     // category-studio
  'gym': allCategoryImages[0],            // category-large
  'pool': allCategoryImages[1],           // category-small
  
  // 支付优惠类 - 5个项目循环使用不同图片
  'deposit': allCategoryImages[4],        // category-one/deposit
  'installment': allCategoryImages[3],    // category-two
  'first-month': allCategoryImages[0],    // category-large
  'discount': allCategoryImages[1],       // category-small
  'coupon': allCategoryImages[2],         // category-studio
}

/**
 * 获取分类图片
 * @param {string} categoryId - 分类ID
 * @returns {string} 图片URL
 */
export const getCategoryImage = (categoryId) => {
  return categoryImageMap[categoryId] || '/images/categories/category-one.jpg'
}


