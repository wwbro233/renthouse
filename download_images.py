#!/usr/bin/env python3
"""
图片下载脚本 - 从Unsplash下载免费图片
需要安装: pip install requests pillow
"""

import os
import requests
from pathlib import Path
import time

# 项目根目录
BASE_DIR = Path(__file__).parent
IMAGES_DIR = BASE_DIR / 'src' / 'assets' / 'images'

# Unsplash API (使用公开的Source API，无需密钥)
UNSPLASH_SOURCE = "https://source.unsplash.com/featured"

# 图片映射配置
IMAGE_CONFIGS = {
    # 头像
    'avatars/avatar-default.jpg': {
        'url': 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
        'keywords': 'person,profile,avatar'
    },
    'avatars/avatar-landlord.jpg': {
        'url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        'keywords': 'businessman,professional,landlord'
    },
    'avatars/avatar-review-1.jpg': {
        'url': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
        'keywords': 'woman,smile,review'
    },
    'avatars/avatar-review-2.jpg': {
        'url': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
        'keywords': 'man,smile,review'
    },
    
    # 横幅
    'banner-living.jpg': {
        'url': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=400&fit=crop',
        'keywords': 'apartment,living,room'
    },
    'banner-commute.jpg': {
        'url': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=400&fit=crop',
        'keywords': 'subway,metro,commute'
    },
    'banner-service.jpg': {
        'url': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=400&fit=crop',
        'keywords': 'cleaning,service,home'
    },
    
    # 首页视觉
    'hero-visual.jpg': {
        'url': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=600&fit=crop',
        'keywords': 'modern,apartment,building'
    },
    
    # 预约默认
    'booking-default.jpg': {
        'url': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
        'keywords': 'apartment,booking,house'
    },
    
    # 分类图片
    'categories/category-share.jpg': {
        'url': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop',
        'keywords': 'shared,room,apartment'
    },
    'categories/category-studio.jpg': {
        'url': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=200&fit=crop',
        'keywords': 'studio,apartment,modern'
    },
    'categories/category-one.jpg': {
        'url': 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=300&h=200&fit=crop',
        'keywords': 'one,bedroom,apartment'
    },
    'categories/category-two.jpg': {
        'url': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&h=200&fit=crop',
        'keywords': 'two,bedroom,apartment'
    },
    'categories/category-small.jpg': {
        'url': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop',
        'keywords': 'small,living,room'
    },
    'categories/category-large.jpg': {
        'url': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
        'keywords': 'large,living,room'
    },
    'categories/category-short.jpg': {
        'url': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop',
        'keywords': 'short,rent,apartment'
    },
    'categories/category-deposit.jpg': {
        'url': 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=300&h=200&fit=crop',
        'keywords': 'apartment,modern,home'
    },
    
    # 房源图片
    'properties/property-a.jpg': {
        'url': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        'keywords': 'loft,apartment,modern'
    },
    'properties/property-b.jpg': {
        'url': 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800&h=600&fit=crop',
        'keywords': 'garden,home,house'
    },
    'properties/property-c.jpg': {
        'url': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
        'keywords': 'tech,suite,modern'
    },
    'properties/property-d.jpg': {
        'url': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'keywords': 'duplex,apartment'
    },
    'properties/property-e.jpg': {
        'url': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
        'keywords': 'co-living,shared'
    },
    'properties/property-f.jpg': {
        'url': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'keywords': 'creative,hub,workspace'
    },
    'properties/property-g.jpg': {
        'url': 'https://images.unsplash.com/photo-1560448075-cbc16ba4ae9b?w=800&h=600&fit=crop',
        'keywords': 'family,home,house'
    },
    'properties/property-h.jpg': {
        'url': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
        'keywords': 'master,suite,bedroom'
    },
    'properties/property-i.jpg': {
        'url': 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop',
        'keywords': 'garden,villa,house'
    },
    'properties/property-j.jpg': {
        'url': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop',
        'keywords': 'metro,life,apartment'
    },
    'properties/property-k.jpg': {
        'url': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        'keywords': 'digital,share,modern'
    },
    'properties/property-l.jpg': {
        'url': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
        'keywords': 'cbd,elite,luxury'
    },
    
    # 图库
    'gallery/property-gallery-1.jpg': {
        'url': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        'keywords': 'apartment,living,room'
    },
    'gallery/property-gallery-2.jpg': {
        'url': 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800&h=600&fit=crop',
        'keywords': 'bedroom,modern'
    },
    'gallery/property-gallery-3.jpg': {
        'url': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
        'keywords': 'kitchen,modern'
    },
    'gallery/property-gallery-4.jpg': {
        'url': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'keywords': 'bathroom,modern'
    },
    
    # 服务图片
    'services/service-clean-basic.jpg': {
        'url': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop',
        'keywords': 'cleaning,service'
    },
    'services/service-clean-plus.jpg': {
        'url': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&h=400&fit=crop',
        'keywords': 'deep,cleaning'
    },
    'services/service-newbie.jpg': {
        'url': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop',
        'keywords': 'newbie,service'
    },
    'services/service-strip-move.jpg': {
        'url': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
        'keywords': 'moving,service'
    },
    'services/service-strip-smart.jpg': {
        'url': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop',
        'keywords': 'smart,home'
    },
    'services/service-vip-a.jpg': {
        'url': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
        'keywords': 'vip,service'
    },
    'services/service-vip-b.jpg': {
        'url': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
        'keywords': 'vip,service'
    },
    'services/service-vip-c.jpg': {
        'url': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
        'keywords': 'vip,service'
    },
    
    # 发现页图片
    'discover/discover-activity-party.jpg': {
        'url': 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop',
        'keywords': 'party,event,activity'
    },
    'discover/discover-activity-run.jpg': {
        'url': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=600&h=400&fit=crop',
        'keywords': 'running,event,activity'
    },
    'discover/discover-activity-garden.jpg': {
        'url': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop',
        'keywords': 'garden,workshop,activity'
    },
    'discover/discover-benefit.jpg': {
        'url': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
        'keywords': 'benefit,coupon'
    },
    'discover/discover-movie.jpg': {
        'url': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop',
        'keywords': 'movie,cinema'
    },
    
    # 客服页
    'support/support-hero.jpg': {
        'url': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
        'keywords': 'support,customer,service'
    },
}

def download_image(url, filepath):
    """下载图片到指定路径"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        # 确保目录存在
        filepath.parent.mkdir(parents=True, exist_ok=True)
        
        # 保存图片
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        print(f"✓ 下载成功: {filepath}")
        return True
    except Exception as e:
        print(f"✗ 下载失败: {filepath} - {str(e)}")
        return False

def main():
    """主函数"""
    print("=" * 60)
    print("开始下载图片资源...")
    print("=" * 60)
    
    # 确保图片目录存在
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    
    success_count = 0
    fail_count = 0
    
    for rel_path, config in IMAGE_CONFIGS.items():
        filepath = IMAGES_DIR / rel_path
        url = config['url']
        
        # 如果文件已存在且大小合理，跳过
        if filepath.exists() and filepath.stat().st_size > 1000:
            print(f"⚠ 文件已存在，跳过: {rel_path}")
            success_count += 1
            continue
        elif filepath.exists():
            print(f"⚠ 文件已存在但可能损坏，重新下载: {rel_path}")
            filepath.unlink()
        
        if download_image(url, filepath):
            success_count += 1
        else:
            fail_count += 1
        
        # 避免请求过快
        time.sleep(0.5)
    
    print("=" * 60)
    print(f"下载完成！成功: {success_count}, 失败: {fail_count}")
    print("=" * 60)

if __name__ == '__main__':
    main()

