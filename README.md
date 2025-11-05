# 链房 (Link House) - 租房平台

一个基于 Vue 3 + Vite 构建的现代化租房平台 Web 应用。

## ✨ 特性

- 🏠 **房源浏览** - 丰富的房源展示和筛选功能
- 🔍 **智能搜索** - 支持地铁、商圈、小区等多维度搜索
- 📅 **预约看房** - 便捷的在线预约系统
- 🛠️ **家居服务** - 搬家、保洁、维修等一站式服务
- 📰 **新鲜资讯** - 社区活动和福利信息
- 👤 **用户中心** - 个人资料、想看、足迹、约看管理
- 💬 **AI客服** - 集成 Coze AI 智能客服

## 🚀 快速开始

### 环境要求

- Node.js >= 20.19.0 或 >= 22.12.0
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 📦 项目结构

```
src/
├── assets/          # 静态资源（图片、样式）
│   ├── images/      # 图片资源
│   └── *.css        # 样式文件
├── components/      # 公共组件
├── composables/     # 组合式函数
├── data/           # Mock数据
├── plugins/        # 插件（Coze AI客服）
├── router/         # 路由配置
├── stores/         # 状态管理
├── utils/          # 工具函数
└── views/          # 页面视图
```

## 🖼️ 图片资源管理

项目使用真实的 JPG 图片资源。所有图片已通过脚本自动下载。

### 下载图片

如果需要重新下载或更新图片，运行：

```bash
# 安装 Python 依赖（如果还没有）
pip3 install requests

# 运行下载脚本
python3 download_images.py
```

脚本会从 Unsplash 下载高质量图片到 `src/assets/images/` 目录。

### 图片目录结构

- `avatars/` - 用户头像
- `banners/` - 横幅图片
- `categories/` - 分类图片
- `properties/` - 房源图片
- `services/` - 服务图片
- `discover/` - 发现页图片
- `gallery/` - 图库图片
- `support/` - 客服页图片

## 🛠️ 技术栈

- **框架**: Vue 3.5.22 (Composition API)
- **构建工具**: Vite 7.1.11
- **路由**: Vue Router 4.4.5
- **UI组件**: Element Plus 2.11.7
- **HTTP客户端**: Axios 1.12.2
- **动画**: GSAP 3.13.0
- **平滑滚动**: Lenis 1.3.13

## 📝 主要功能

### 路由系统

- `/` - 首页
- `/want` - 找房
- `/service` - 家居服务
- `/discover` - 新鲜资讯
- `/support` - 客服中心
- `/my` - 个人中心
- `/property/:id` - 房源详情
- `/service-detail/:id` - 服务详情
- `/login` - 登录/注册

### 状态管理

项目使用 Vue 3 Composition API 实现轻量级状态管理：

- `authStore` - 用户认证管理
- `bookingStore` - 预约管理

### 图片加载优化

- 自动回退机制（JPG → SVG）
- 懒加载支持
- 错误处理

## 🎨 代码优化

### 已完成的优化

1. ✅ 路由滚动行为优化（支持平滑滚动和锚点）
2. ✅ 图片资源管理优化（优先使用JPG，自动回退SVG）
3. ✅ 全局错误处理
4. ✅ 图片加载工具函数
5. ✅ 代码注释和文档

### 性能优化建议

1. **图片懒加载** - 使用 `v-lazy` 指令或 Intersection Observer
2. **路由懒加载** - 已实现动态导入
3. **代码分割** - Vite 自动处理
4. **缓存策略** - 配置适当的 HTTP 缓存头

## 🔧 开发工具

推荐使用 VS Code 并安装以下插件：

- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier

## 📄 许可证

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

- 客服热线: 400-860-8888
- 服务时间: 每日 8:00-22:00

---

**灵感源自安居客，为你打造可信赖的找房体验。**
