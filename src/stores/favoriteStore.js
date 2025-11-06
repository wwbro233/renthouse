import { reactive } from 'vue'
import { myFavorites as seedFavorites } from '../data/mockData'

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

const removeFavorite = (id) => {
  const index = state.favorites.findIndex((item) => item.id === id)
  if (index !== -1) {
    state.favorites.splice(index, 1)
    return true
  }
  return false
}

const isFavorite = (id) => {
  return state.favorites.some((item) => item.id === id)
}

const toggleFavorite = (property) => {
  if (isFavorite(property.id)) {
    removeFavorite(property.id)
    return false // 已取消收藏
  } else {
    addFavorite(property)
    return true // 已添加收藏
  }
}

export const useFavoriteStore = () => ({
  state,
  addFavorite,
  removeFavorite,
  isFavorite,
  toggleFavorite
})

