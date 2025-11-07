/**
 * 收藏状态管理 Store
 * 负责房源收藏功能的管理
 * 使用种子数据（mockData）初始化
 */
import { reactive } from 'vue'
import { myFavorites as seedFavorites } from '../data/mockData'

/**
 * 收藏状态对象
 * favorites: 收藏的房源列表
 */
const state = reactive({
  favorites: seedFavorites.map((item) => ({
    id: item.id,
    title: item.title,
    price: item.price,
    layout: item.layout,
    size: item.size,
    address: item.address,
    favoriteAt: item.favoriteAt,
    cover: item.cover
  }))
})

/**
 * 添加收藏
 * @param {Object} property - 房源信息对象
 * @param {string} property.id - 房源ID
 * @param {string} property.title - 房源标题
 * @param {number} property.price - 房源价格
 * @param {string} property.layout - 户型
 * @param {number} property.size - 面积
 * @param {string} property.address - 地址
 * @param {string} property.cover - 封面图
 * @returns {boolean} true表示添加成功，false表示已存在
 */
const addFavorite = (property) => {
  // 检查是否已经存在
  const exists = state.favorites.find((item) => item.id === property.id)
  if (exists) {
    return false // 已经存在，返回 false
  }

  // 添加到列表开头
  state.favorites.unshift({
    id: property.id,
    title: property.title,
    price: property.price,
    layout: property.layout,
    size: property.area || property.size,
    address: property.address,
    favoriteAt: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/\//g, '-'),
    cover: property.cover || property.gallery?.[0]
  })
  return true // 添加成功
}

/**
 * 取消收藏
 * @param {string} id - 房源ID
 * @returns {boolean} true表示删除成功，false表示不存在
 */
const removeFavorite = (id) => {
  const index = state.favorites.findIndex((item) => item.id === id)
  if (index !== -1) {
    state.favorites.splice(index, 1)
    return true
  }
  return false
}

/**
 * 判断是否已收藏
 * @param {string} id - 房源ID
 * @returns {boolean} true表示已收藏，false表示未收藏
 */
const isFavorite = (id) => {
  return state.favorites.some((item) => item.id === id)
}

/**
 * 切换收藏状态
 * 如果已收藏则取消，未收藏则添加
 * @param {Object} property - 房源信息对象
 * @returns {boolean} true表示已添加收藏，false表示已取消收藏
 */
const toggleFavorite = (property) => {
  if (isFavorite(property.id)) {
    removeFavorite(property.id)
    return false // 已取消收藏
  } else {
    addFavorite(property)
    return true // 已添加收藏
  }
}

/**
 * 导出 favoriteStore 实例
 * 提供收藏相关的所有方法和状态
 */
export const useFavoriteStore = () => ({
  state,
  addFavorite,
  removeFavorite,
  isFavorite,
  toggleFavorite
})

