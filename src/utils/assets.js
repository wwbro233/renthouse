const createUrl = (path) => new URL(`../assets/images/${path}`, import.meta.url).href

export const assetUrl = (path) => createUrl(path)

export const propertyImageMap = {
  'city-loft': 'properties/property-a.svg',
  'garden-home': 'properties/property-b.svg',
  'tech-suite': 'properties/property-c.svg',
  'duplex': 'properties/property-d.svg',
  'co-living': 'properties/property-e.svg',
  'creative-hub': 'properties/property-f.svg',
  'family-home': 'properties/property-g.svg',
  'master-suite': 'properties/property-h.svg',
  'garden-villa': 'properties/property-i.svg',
  'metro-life': 'properties/property-j.svg',
  'digital-share': 'properties/property-k.svg',
  'cbd-elite': 'properties/property-l.svg'
}

export const getPropertyImage = (key = 'city-loft') => createUrl(propertyImageMap[key] || propertyImageMap['city-loft'])
