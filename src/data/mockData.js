import { assetUrl, getPropertyImage, getServiceImage, getDiscoverImage, getGalleryImage } from '../utils/assets'

export const bannerSlides = [
  {
    id: 1,
    title: '满租安心季·签约享首月减免',
    description: '精选整租房源，首月立减 500 元，免费赠送深度保洁服务一次。',
    cover: assetUrl('banner-living.jpg'),
    link: '/activity/1'
  },
  {
    id: 2,
    title: '通勤找房上新 · 地铁周边好房限时抢',
    description: '地铁 30 分钟圈内优质房源，每日 10 点更新，先到先得。',
    cover: assetUrl('banner-commute.jpg'),
    link: '/want'
  },
  {
    id: 3,
    title: '搬家保洁套餐 · 一键预约更轻松',
    description: '搬家、保洁、维修一站式服务，专业团队保障，预约立享 9 折优惠。',
    cover: assetUrl('banner-service.jpg'),
    link: '/service'
  }
]

export const featuredProperties = [
  {
    id: 101,
    title: '望京 SOHO  双地铁 精装一居',
    price: 5600,
    rentType: '整租',
    desc: '1室1厅 · 56㎡ · 南向 · 中楼层',
    area: '朝阳区 · 望京',
    cover: getPropertyImage(101),
    tags: ['地铁 400m', '智能门锁', '配套齐全']
  },
  {
    id: 102,
    title: '世贸天阶 景观两居 带阳台',
    price: 7800,
    rentType: '整租',
    desc: '2室1厅 · 89㎡ · 南北通透',
    area: '朝阳区 · 国贸',
    cover: getPropertyImage(102),
    tags: ['商圈核心', '南北通透', '带地下车位']
  },
  {
    id: 103,
    title: '海淀黄庄 复式合租房',
    price: 3200,
    rentType: '合租',
    desc: '4室2厅 · 16㎡ · 朝南次卧',
    area: '海淀区 · 中关村',
    cover: getPropertyImage(103),
    tags: ['拎包入住', '智能家居', '高速宽带']
  },
  {
    id: 104,
    title: '亦庄金茂悦 精装三居',
    price: 6800,
    rentType: '整租',
    desc: '3室2厅 · 110㎡ · 南北通透',
    area: '大兴区 · 亦庄',
    cover: getPropertyImage(104),
    tags: ['学校旁', '大型社区', '健身房']
  }
]

export const serviceShortcuts = [
  {
    id: 'move',
    title: '搬家服务',
    icon: 'Van',
    desc: '专业搬家团队，省心又省力',
    link: '/service-detail/move'
  },
  {
    id: 'clean',
    title: '保洁清扫',
    icon: 'Brush',
    desc: '日常保洁 · 深度清洁 · 消杀除螨',
    link: '/service-detail/clean'
  },
  {
    id: 'repair',
    title: '上门维修',
    icon: 'Tools',
    desc: '水电维修 · 家电检修 · 门窗维护',
    link: '/service-detail/repair'
  },
  {
    id: 'home',
    title: '家电清洗',
    icon: 'Goblet',
    desc: '空调 · 洗衣机 · 热水器全搞定',
    link: '/service-detail/home'
  },
  {
    id: 'storage',
    title: '仓储托管',
    icon: 'Box',
    desc: '短租临时存放，安全托管',
    link: '/service-detail/storage'
  }
]

export const nearbyProperties = [
  {
    id: 201,
    cover: getPropertyImage(201), // 使用自己的ID
    title: '东直门银座 精装整租一居',
    price: 6200,
    layout: '1室1厅',
    rooms: 1,
    size: 52,
    rentType: '整租',
    district: '东城区',
    area: '东直门',
    address: '东城区 · 东直门',
    metroLines: ['2号线', '机场线'],
    nearMetro: true,
    hasElevator: true,
    petFriendly: false,
    loft: false,
    southFacing: true,
    parking: false,
    shortRent: false,
    depositFree: true,
    themes: ['one-room', 'small-living', 'studio', 'deposit'],
    release: '2025-03-01'
  },
  {
    id: 202,
    cover: getPropertyImage(202),
    title: '朝阳公园 复式 LOFT',
    price: 8900,
    layout: '2室1厅',
    rooms: 2,
    size: 95,
    rentType: '整租',
    district: '朝阳区',
    area: '朝阳公园',
    address: '朝阳区 · 朝阳公园',
    metroLines: ['10号线'],
    nearMetro: true,
    hasElevator: true,
    petFriendly: true,
    loft: true,
    southFacing: true,
    parking: true,
    shortRent: false,
    depositFree: false,
    themes: ['two-room', 'large-living'],
    release: '2025-03-05'
  },
  {
    id: 203,
    cover: getPropertyImage(203),
    title: '广渠门 合租大次卧',
    price: 3200,
    layout: '3室1厅',
    rooms: 1,
    size: 18,
    rentType: '合租',
    district: '东城区',
    area: '广渠门',
    address: '东城区 · 广渠门',
    metroLines: ['7号线'],
    nearMetro: true,
    hasElevator: false,
    petFriendly: true,
    loft: false,
    southFacing: false,
    parking: false,
    shortRent: false,
    depositFree: true,
    themes: ['share', 'small-living'],
    release: '2025-02-28'
  },
  {
    id: 204,
    cover: getPropertyImage(204),
    title: '望京小腰 精装两居',
    price: 7600,
    layout: '2室1厅',
    rooms: 2,
    size: 84,
    rentType: '整租',
    district: '朝阳区',
    area: '望京',
    address: '朝阳区 · 望京',
    metroLines: ['14号线', '15号线'],
    nearMetro: true,
    hasElevator: true,
    petFriendly: false,
    loft: false,
    southFacing: true,
    parking: true,
    shortRent: false,
    depositFree: false,
    themes: ['two-room', 'large-living'],
    release: '2025-02-26'
  },
  {
    id: 205,
    cover: getPropertyImage(205),
    title: '国贸 公寓短租一居',
    price: 6800,
    layout: '1室1厅',
    rooms: 1,
    size: 48,
    rentType: '短租',
    district: '朝阳区',
    area: '国贸',
    address: '朝阳区 · 国贸',
    metroLines: ['1号线', '10号线'],
    nearMetro: true,
    hasElevator: true,
    petFriendly: false,
    loft: false,
    southFacing: true,
    parking: false,
    shortRent: true,
    depositFree: true,
    themes: ['short-rent', 'one-room', 'studio'],
    release: '2025-03-02'
  },
  {
    id: 206,
    cover: getPropertyImage(206),
    title: '亦庄金茂悦 拎包入住四居',
    price: 9600,
    layout: '4室2厅',
    rooms: 4,
    size: 128,
    rentType: '整租',
    district: '大兴区',
    area: '亦庄',
    address: '大兴区 · 亦庄',
    metroLines: ['亦庄线'],
    nearMetro: false,
    hasElevator: true,
    petFriendly: false,
    loft: false,
    southFacing: true,
    parking: true,
    shortRent: false,
    depositFree: false,
    themes: ['large-living', 'two-room'],
    release: '2025-02-20'
  },
  {
    id: 207,
    cover: getPropertyImage(207),
    title: '中关村 科技公寓双卧',
    price: 8200,
    layout: '2室1厅',
    rooms: 2,
    size: 76,
    rentType: '整租',
    district: '海淀区',
    area: '中关村',
    address: '海淀区 · 中关村',
    metroLines: ['4号线', '10号线'],
    nearMetro: true,
    hasElevator: true,
    petFriendly: false,
    loft: false,
    southFacing: true,
    parking: false,
    shortRent: false,
    depositFree: false,
    themes: ['two-room', 'small-living'],
    release: '2025-02-22'
  },
  {
    id: 208,
    cover: getPropertyImage(203),
    title: '双井 轻奢合租主卧',
    price: 4200,
    layout: '3室2厅',
    rooms: 1,
    size: 22,
    rentType: '合租',
    district: '朝阳区',
    area: '双井',
    address: '朝阳区 · 双井',
    metroLines: ['7号线'],
    nearMetro: true,
    hasElevator: true,
    petFriendly: true,
    loft: false,
    southFacing: true,
    parking: false,
    shortRent: false,
    depositFree: true,
    themes: ['share', 'small-living'],
    release: '2025-03-03'
  },
  {
    id: 209,
    cover: getPropertyImage(204),
    title: '通州 运河畔 电梯三居',
    price: 5600,
    layout: '3室2厅',
    rooms: 3,
    size: 102,
    rentType: '整租',
    district: '通州区',
    area: '北运河',
    address: '通州区 · 北运河',
    metroLines: ['6号线'],
    nearMetro: true,
    hasElevator: true,
    petFriendly: false,
    loft: false,
    southFacing: true,
    parking: true,
    shortRent: false,
    depositFree: false,
    themes: ['two-room', 'large-living'],
    release: '2025-02-18'
  },
  {
    id: 210,
    cover: getPropertyImage(210),
    title: '回龙观 合租次卧可月付',
    price: 2800,
    layout: '4室2厅',
    rooms: 1,
    size: 15,
    rentType: '合租',
    district: '昌平区',
    area: '回龙观',
    address: '昌平区 · 回龙观',
    metroLines: ['13号线'],
    nearMetro: true,
    hasElevator: false,
    petFriendly: false,
    loft: false,
    southFacing: false,
    parking: false,
    shortRent: false,
    depositFree: true,
    themes: ['share', 'deposit'],
    release: '2025-03-04'
  },
  {
    id: 211,
    cover: getPropertyImage(211),
    title: '石景山 精装两居朝南',
    price: 5200,
    layout: '2室1厅',
    rooms: 2,
    size: 78,
    rentType: '整租',
    district: '石景山区',
    area: '古城',
    address: '石景山区 · 古城',
    metroLines: ['1号线'],
    nearMetro: true,
    hasElevator: true,
    petFriendly: false,
    loft: false,
    southFacing: true,
    parking: false,
    shortRent: false,
    depositFree: false,
    themes: ['two-room', 'small-living'],
    release: '2025-02-25'
  },
  {
    id: 212,
    cover: getPropertyImage(212),
    title: '顺义 国际社区 花园叠拼',
    price: 11800,
    layout: '4室2厅',
    rooms: 4,
    size: 165,
    rentType: '整租',
    district: '顺义区',
    area: '后沙峪',
    address: '顺义区 · 后沙峪',
    metroLines: ['15号线'],
    nearMetro: false,
    hasElevator: false,
    petFriendly: true,
    loft: false,
    southFacing: true,
    parking: true,
    shortRent: false,
    depositFree: false,
    themes: ['large-living'],
    release: '2025-02-16'
  },
  {
    id: 213,
    cover: getPropertyImage(213),
    title: '青年路 精装修小客厅一居',
    price: 5400,
    layout: '1室1厅',
    rooms: 1,
    size: 49,
    rentType: '整租',
    district: '朝阳区',
    area: '青年路',
    address: '朝阳区 · 青年路',
    metroLines: ['6号线'],
    nearMetro: true,
    hasElevator: true,
    petFriendly: true,
    loft: false,
    southFacing: true,
    parking: false,
    shortRent: false,
    depositFree: true,
    themes: ['small-living', 'one-room', 'studio'],
    release: '2025-02-21'
  },
  {
    id: 214,
    cover: getPropertyImage(204),
    title: '西单文化中心 精装两居',
    price: 6800,
    layout: '2室1厅',
    rooms: 2,
    size: 78,
    rentType: '整租',
    district: '西城区',
    area: '西单',
    address: '西城区 · 西单',
    metroLines: ['1号线', '8号线'],
    nearMetro: true,
    hasElevator: true,
    petFriendly: false,
    loft: false,
    southFacing: true,
    parking: false,
    shortRent: false,
    depositFree: false,
    themes: ['two-room', 'small-living'],
    release: '2025-03-03'
  },
  {
    id: 215,
    cover: getPropertyImage(211),
    title: '丰台丽泽 轻奢三居',
    price: 7200,
    layout: '3室2厅',
    rooms: 3,
    size: 96,
    rentType: '整租',
    district: '丰台区',
    area: '丽泽',
    address: '丰台区 · 丽泽',
    metroLines: ['10号线'],
    nearMetro: true,
    hasElevator: true,
    petFriendly: true,
    loft: false,
    southFacing: true,
    parking: true,
    shortRent: false,
    depositFree: false,
    themes: ['two-room', 'large-living'],
    release: '2025-03-04'
  },
  {
    id: 216,
    cover: getPropertyImage(205),
    title: '宋家庄 月付拎包公寓',
    price: 1800,
    layout: '1室0厅',
    rooms: 1,
    size: 28,
    rentType: '整租',
    district: '丰台区',
    area: '宋家庄',
    address: '丰台区 · 宋家庄',
    metroLines: ['10号线'],
    nearMetro: true,
    hasElevator: true,
    petFriendly: false,
    loft: false,
    southFacing: true,
    parking: false,
    shortRent: false,
    depositFree: true,
    themes: ['one-room', 'deposit', 'studio'],
    release: '2025-03-06'
  }
]

export const commuteRecommendations = [
  {
    id: 301,
    cover: getPropertyImage(301),
    title: '国贸 CBD 品质公寓',
    price: 6800,
    commuteTime: '18分钟',
    layout: '1室1厅',
    size: 45,
    address: '朝阳区 · 国贸',
    transport: '地铁 1 号线',
    tags: ['距离地铁 260m', '可短租', '带清洁']
  },
  {
    id: 302,
    cover: getPropertyImage(201),
    title: '双井 整租南向一居',
    price: 5800,
    commuteTime: '23分钟',
    layout: '1室1厅',
    size: 52,
    address: '朝阳区 · 双井',
    transport: '公交 312 路',
    tags: ['步行上班', '智能门锁', '开放式厨房']
  },
  {
    id: 303,
    cover: getPropertyImage(203),
    title: '潘家园 精装合租主卧',
    price: 3200,
    commuteTime: '28分钟',
    layout: '4室2厅',
    size: 20,
    address: '朝阳区 · 潘家园',
    transport: '地铁 10 号线',
    tags: ['租期灵活', '阳台房', '共享客厅']
  }
]

export const mapMarkers = [
  {
    id: 301,
    title: '国贸 CBD 品质公寓',
    price: 6800,
    lat: 39.90965,
    lng: 116.45668
  },
  {
    id: 302,
    title: '双井 整租南向一居',
    price: 5800,
    lat: 39.89465,
    lng: 116.46568
  },
  {
    id: 303,
    title: '潘家园 精装合租主卧',
    price: 3200,
    lat: 39.87642,
    lng: 116.45812
  },
  {
    id: 304,
    title: '劲松花园 智能合租',
    price: 3500,
    lat: 39.8841,
    lng: 116.46157
  }
]

export const vipServices = [
  {
    id: 'vip-1',
    title: '尊享居住顾问',
    desc: '全程陪看、1对1签约指导，专属客服随时响应，保障租房流程顺畅。',
    cover: getServiceImage('vip-1'),
    perks: ['陪看专车', '个性化房源甄选', '专家在线答疑']
  },
  {
    id: 'vip-2',
    title: '管家式服务包',
    desc: '7×24 托管服务，日常保洁、维修、缴费全覆盖，让租住更省心。',
    cover: getServiceImage('vip-2'),
    perks: ['每周保洁', '维修优先', '生活缴费提醒']
  },
  {
    id: 'vip-3',
    title: '豪华搬家体验',
    desc: '专业团队+包装耗材全免，提供家具拆装、家电安置，入住零负担。',
    cover: getServiceImage('vip-3'),
    perks: ['全程搬运', '空调移机', '赠送保洁']
  }
]

export const homeServices = [
  {
    id: '搬家',
    title: '精品搬家',
    icon: 'Van',
    desc: '高效搬家团队，上门打包拆装',
    link: '/service-detail/move'
  },
  {
    id: '保洁',
    title: '深度保洁',
    icon: 'MagicStick',
    desc: '全屋清洁除螨，入住如新',
    link: '/service-detail/clean'
  },
  {
    id: '维修',
    title: '极速维修',
    icon: 'Link',
    desc: '水电家电 2 小时响应',
    link: '/service-detail/repair'
  },
  {
    id: '家电',
    title: '家电清洗',
    icon: 'Refrigerator',
    desc: '全套家电深度保养',
    link: '/service-detail/home'
  },
  {
    id: '收纳',
    title: '收纳整理',
    icon: 'CollectionTag',
    desc: '专业收纳师上门服务',
    link: '/service-detail/storage'
  },
  {
    id: '租赁',
    title: '家具租赁',
    icon: 'OfficeBuilding',
    desc: '按需租赁，月付更轻松',
    link: '/service-detail/rental'
  }
]

export const calendarAvailabilities = [
  {
    date: '2025-03-08',
    slots: [
      { time: '09:00-11:00', status: 'available' },
      { time: '13:00-15:00', status: 'booked' },
      { time: '16:00-18:00', status: 'available' }
    ]
  },
  {
    date: '2025-03-09',
    slots: [
      { time: '09:00-11:00', status: 'booked' },
      { time: '13:30-15:30', status: 'available' }
    ]
  },
  {
    date: '2025-03-10',
    slots: [
      { time: '10:00-12:00', status: 'available' },
      { time: '15:00-17:00', status: 'available' }
    ]
  }
]

export const serviceCampaigns = [
  {
    id: 'camp-1',
    title: '3 月搬家早鸟礼',
    date: '2025-03-05 至 2025-03-31',
    cover: getServiceImage('camp-1'),
    desc: '提前 10 天预约搬家服务，赠送 200 元搬家券+免费纸箱 6 个。'
  },
  {
    id: 'camp-2',
    title: '春季保洁焕新季',
    date: '2025-03-08 至 2025-04-08',
    cover: getServiceImage('camp-2'),
    desc: '深度保洁套餐限时 8.8 折，针对厨房、卫生间特殊去污。'
  }
]

export const discoverActivities = [
  {
    id: 'act-1',
    title: '周末露天电影派对',
    time: '2025-03-15 19:00',
    location: '望京·优设社区花园',
    cover: getDiscoverImage('act-1'),
    desc: '露天电影+社交派对，提供爆米花、饮品，入住用户享报名优先权。',
    tag: '报名中'
  },
  {
    id: 'act-2',
    title: '城市探索跑',
    time: '2025-03-22 08:30',
    location: '国贸CBD集合',
    cover: getDiscoverImage('act-2'),
    desc: '8km 城市慢跑路线，专业教练领跑，赛后提供能量补给。',
    tag: '报名中'
  },
  {
    id: 'act-3',
    title: '室内园艺工作坊',
    time: '2025-03-29 14:00',
    location: '朝阳北路社区客厅',
    cover: getDiscoverImage('act-3'),
    desc: '手作多肉绿植盆栽，学习打造高颜值阳台花园。',
    tag: '即将开始'
  }
]

export const discoverBenefits = [
  {
    id: 'ben-1',
    title: '春季保洁 100 元优惠券',
    type: '优惠券',
    expire: '2025-04-30',
    cover: getDiscoverImage('ben-1'),
    desc: '适用于全品类保洁服务，订单满 300 元可用。'
  },
  {
    id: 'ben-2',
    title: '合租配套免费试用',
    type: '免费试用',
    expire: '2025-03-31',
    cover: getServiceImage('ben-2'),
    desc: '限新用户，提供智能门锁+空气净化器 14 天试用。'
  },
  {
    id: 'ben-3',
    title: '社区商家积分兑换',
    type: '积分兑换',
    expire: '2025-05-15',
    cover: getServiceImage('ben-3'),
    desc: '积分 500 起兑咖啡券、美甲体验、健身体验课。'
  }
]

export const myFavorites = [
  {
    id: 101,
    title: '望京 SOHO  双地铁 精装一居',
    price: 5600,
    layout: '1室1厅',
    size: 56,
    address: '朝阳区 · 望京',
    favoriteAt: '2025-03-02 18:32',
    cover: getPropertyImage(301)
  },
  {
    id: 204,
    title: '望京小腰 精装两居',
    price: 7600,
    layout: '2室1厅',
    size: 84,
    address: '朝阳区 · 望京',
    favoriteAt: '2025-02-26 10:12',
    cover: getPropertyImage(204)
  },
  {
    id: 103,
    title: '海淀黄庄 复式合租房',
    price: 3200,
    layout: '4室2厅',
    size: 16,
    address: '海淀区 · 中关村',
    favoriteAt: '2025-02-20 14:06',
    cover: getPropertyImage(210)
  }
]

export const myFootprints = [
  {
    id: 11,
    title: '北京欢乐谷春日活动',
    type: '活动',
    visitedAt: '2025-03-03 21:12',
    cover: getDiscoverImage('act-1')
  },
  {
    id: 12,
    title: '深度保洁 3 小时套餐',
    type: '服务',
    visitedAt: '2025-03-01 16:45',
    cover: getServiceImage('clean')
  },
  {
    id: 201,
    title: '东直门银座 精装整租一居',
    type: '房源',
    visitedAt: '2025-02-28 13:26',
    cover: getPropertyImage(201)
  }
]

export const myAppointments = [
  {
    id: 101,
    title: '望京 SOHO  双地铁 精装一居',
    type: '约看',
    time: '2025-03-06 14:30',
    status: '已确认',
    cover: getPropertyImage(301)
  },
  {
    id: 22,
    title: '深度保洁 3 小时套餐',
    type: '服务',
    time: '2025-03-07 09:00',
    status: '待服务',
    cover: getServiceImage('clean')
  },
  {
    id: 23,
    title: '周末露天电影派对',
    type: '活动',
    time: '2025-03-15 19:00',
    status: '已报名',
    cover: getDiscoverImage('act-1')
  }
]

export const myShareList = [
  {
    id: 31,
    title: '朝阳大悦城 合租次卧转租',
    shareType: '招租',
    address: '朝阳区 · 大悦城',
    releaseAt: '2025-03-01 10:20',
    status: '进行中'
  },
  {
    id: 32,
    title: '望京 SOHO 寻找合租伙伴',
    shareType: '求租',
    address: '朝阳区 · 望京',
    releaseAt: '2025-02-24 18:02',
    status: '已完成'
  }
]

export const propertyDetail = {
  id: 101,
  title: '国贸 CBD 品质公寓',
  price: 6800,
  layout: '1室1厅1卫',
  area: 45,
  orientation: '南',
  floor: '中层 / 28层',
  decoration: '精装修',
  release: '2025-02-20',
  address: '北京市朝阳区国贸核心区',
  landlord: {
    name: '李先生',
    avatar: assetUrl('avatars/avatar-landlord.jpg'),
    phone: '134-****-8890',
    rating: 4.9
  },
  gallery: [
    getGalleryImage(0),
    getGalleryImage(1),
    getGalleryImage(2),
    getGalleryImage(3)
  ],
  highlights: ['地铁 200 米', 'CBD 核心区', '租期灵活', '拎包入住'],
  description:
    '房源位于国贸 CBD 核心区，距离地铁仅 200 米，周边配套完善：大型购物中心、写字楼、健身房、餐厅等一应俱全。房屋采用北欧简约设计，全屋品牌家电、24 小时智能安防，支持月付与长租，适合高效生活的都市白领。',
  facilities: ['中央空调', '地暖', '智能门锁', '洗烘一体机', '洗碗机', '投影仪', '高速宽带'],
  traffic: '步行 3 分钟可抵达地铁 1/10 号线国贸站；500 米范围内有 8 条公交线路；距东三环主路 1.2 公里，驾车通勤 20 分钟可到三里屯。',
  map: {
    lat: 39.90965,
    lng: 116.45668
  }
}

export const serviceDetail = {
  id: 'clean',
  title: '深度保洁 4 小时套餐',
  price: 399,
  duration: '4 小时',
  rating: 4.95,
  appointmentCount: 1823,
  cover: assetUrl('services/service-clean-plus.jpg'),
  video: 'https://player.vimeo.com/video/76979871?h=8272103f6e',
  description:
    '适用于 90㎡ 以下家庭，包含厨房油污、卫生间除垢、卧室除螨三大模块。标准化流程，专业工具到位，保证每一处角落焕然一新。',
  packages: [
    {
      id: 'basic',
      name: '基础焕新',
      price: 299,
      desc: '2 小时，适合 60㎡ 以下户型，包含客厅+卧室除尘。',
      perks: ['客厅卧室全屋除尘', '地面消毒', '桌面整理']
    },
    {
      id: 'deep',
      name: '深度保洁',
      price: 399,
      desc: '4 小时，两名保洁师，包含厨房+卫生间深度清洁。',
      perks: ['厨房油污处理', '卫生间除垢消毒', '家电表面清洁']
    },
    {
      id: 'pro',
      name: '尊享除螨',
      price: 499,
      desc: '4 小时，两名保洁师+除螨设备，适合敏感家庭。',
      perks: ['全屋深度保洁', '沙发床垫除螨', '空气消杀']
    }
  ],
  notice: [
    '标准服务时长 4 小时，90㎡ 以上房型建议加时或升级套餐。',
    '服务前请提前收纳贵重物品，避免清洁过程中损坏。',
    '如需更改预约时间，请至少提前 4 小时联系专属客服。'
  ],
  reviews: [
    {
      id: 'rv-1',
      user: 'Lisa',
      avatar: assetUrl('avatars/avatar-review-1.jpg'),
      comment: '两个保洁阿姨很专业，厨房油烟机和灶台都擦得很干净，床垫除螨后睡觉更安心了。',
      rate: 5,
      date: '2025-02-28'
    },
    {
      id: 'rv-2',
      user: '陈先生',
      avatar: assetUrl('avatars/avatar-review-2.jpg'),
      comment: '预约流程顺畅，阿姨带来蒸汽机和除螨仪，细节到位，还贴心地帮我整理了衣柜。',
      rate: 5,
      date: '2025-02-25'
    }
  ]
}

export const activityDetail = {
  id: 'act-1',
  title: '周末露天电影派对',
  cover: assetUrl('discover/discover-activity-party.jpg'),
  time: '2025-03-15 19:00-22:00',
  location: '望京·优设社区花园',
  host: 'Link House 社区团队',
  status: '报名中',
  description:
    '来一场星空下的电影体验！现场提供高清巨幕、环绕音响，还有精心准备的爆米花、小食和饮品。电影结束后还有社交小游戏，帮助你认识更多兴趣相投的小伙伴。',
  agenda: [
    { time: '18:30', content: '签到入场，自由社交' },
    { time: '19:00', content: '电影放映：《放牛班的春天》' },
    { time: '21:00', content: '互动小游戏 + 抽奖环节' },
    { time: '21:30', content: '放松音乐派对，自由交流' }
  ],
  faq: [
    '活动提供户外坐垫，如遇降温请自备外套。',
    '报名成功后会收到短信提醒，活动前一天再进行一次确认。',
    '现场设有饮品补给站，支持积分兑换咖啡、奶茶等。'
  ]
}

export const benefitDetail = {
  id: 'ben-1',
  title: '春季保洁 100 元优惠券',
  cover: assetUrl('discover/discover-benefit.jpg'),
  type: '优惠券',
  start: '2025-03-01',
  end: '2025-04-30',
  description:
    '针对春季焕新需求推出的保洁专享优惠券，适用于深度保洁、开荒保洁等所有保洁类服务。单笔订单实际支付金额满 300 元可使用，支持与会员折扣同享。',
  usage: [
    '领取后在“服务预约-下单页”选择使用该优惠券。',
    '每位用户限领取 1 张，使用后不可退回。',
    '适用于所有服务城市，部分偏远区域可能需加收交通费用。'
  ],
  rules: [
    '优惠券有效期内未使用将自动失效，不支持延期。',
    '如订单取消，优惠券将在 30 分钟内退回账户，仍需在有效期内使用。',
    '如遇恶意刷券行为，平台有权收回优惠权益。'
  ]
}

export const mapBoundary = {
  north: 39.95,
  south: 39.85,
  east: 116.48,
  west: 116.38
}
