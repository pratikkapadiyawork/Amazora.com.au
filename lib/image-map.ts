/**
 * Maps product slugs to their actual image files in /public/products/.
 * Reflects the files actually available after running the image setup scripts.
 */
export const PRODUCT_IMAGES: Record<string, string[]> = {
  // Chess Sets (marble)
  'marble-chess-set':                   ['/products/chess-marble-01.jpg', '/products/chess-marble-02.jpg'],
  '12-inch-marble-chess-set':           ['/products/chess-marble-01.jpg', '/products/chess-marble-03.jpg'],
  'handcrafted-marble-chess-set':       ['/products/chess-marble-01.jpg', '/products/chess-marble-02.jpg'],
  'classic-marble-chess-set':           ['/products/chess-marble-02.jpg', '/products/chess-marble-01.jpg'],
  'luxury-marble-chess-set':            ['/products/chess-marble-01.jpg', '/products/chess-marble-03.jpg'],

  // Decorative Planes / Ship Models
  'decorative-ship':                    ['/products/ship-01.jpg', '/products/ship-02.jpg', '/products/ship-03.jpg'],
  'model-ship':                         ['/products/ship-01.jpg', '/products/ship-03.jpg'],
  'nautical-ship-decor':                ['/products/ship-02.jpg', '/products/ship-04.jpg'],
  'emirates-a380-model':                ['/products/ship-01.jpg', '/products/ship-02.jpg', '/products/ship-03.jpg'],
  'british-concorde-model':             ['/products/ship-04.jpg'],
  'turkish-airlines-model':             ['/products/ship-05.jpg'],
  'small-plane-model':                  ['/products/ship-01.jpg', '/products/ship-02.jpg'],

  // Mugs — will use chess image as fallback until mug images arrive
  'barrel-mug':                         ['/products/chess-marble-01.jpg'],
  'premium-mug':                        ['/products/chess-marble-02.jpg'],
  'oak-barrel-mug':                     ['/products/chess-marble-01.jpg'],
  'whiskey-barrel-mug':                 ['/products/chess-marble-02.jpg'],

  // Leather — fallback to chess until leather images arrive
  'leather-wallet':                     ['/products/chess-marble-01.jpg'],
  'leather-belt':                       ['/products/chess-marble-02.jpg'],
  'leather-card-holder':                ['/products/chess-marble-01.jpg'],

  // Humidors
  'cedar-humidor':                      ['/products/chess-marble-01.jpg'],
  'cigar-humidor':                      ['/products/chess-marble-02.jpg'],
  'desktop-humidor':                    ['/products/chess-marble-01.jpg'],

  // Hip Flasks
  'hip-flask':                          ['/products/chess-marble-01.jpg'],
  'stainless-hip-flask':                ['/products/chess-marble-02.jpg'],
  'engraved-hip-flask':                 ['/products/chess-marble-01.jpg'],

  // Ceramic Decor
  'ceramic-decor':                      ['/products/chess-marble-01.jpg'],
  'ceramic-vase':                       ['/products/chess-marble-02.jpg'],

  // Default fallback
  'default':                            ['/products/chess-marble-01.jpg'],
}

/** Category hero images */
export const CATEGORY_IMAGES: Record<string, string> = {
  'chess-sets':  '/images/cat-chess-sets.jpg',
  'mugs':        '/images/cat-mugs.jpg',
  'leather':     '/images/cat-leather.jpg',
  'humidors':    '/images/cat-humidors.jpg',
  'ships':       '/images/cat-ships.jpg',
  'ceramic':     '/images/cat-ceramic.jpg',
  'hip-flasks':  '/images/cat-hip-flasks.jpg',
  'gifts':       '/images/cat-gifts.jpg',
}

/**
 * Gradient fallbacks per category — shown when no real image exists.
 * Beautifully colored with the coastal palette.
 */
export const CATEGORY_GRADIENTS: Record<string, string> = {
  'chess-sets':  'from-[#1d3557] to-[#457b9d]',
  'mugs':        'from-[#457b9d] to-[#a8dadc]',
  'leather':     'from-[#1d3557] to-[#2d4a73]',
  'humidors':    'from-[#2d4a73] to-[#457b9d]',
  'ships':       'from-[#152641] to-[#1d3557]',
  'ceramic':     'from-[#457b9d] to-[#a8dadc]',
  'hip-flasks':  'from-[#1d3557] to-[#355f7a]',
  'gifts':       'from-[#e63946] to-[#c1121f]',
}

/** Get images for a product slug, falling back to default */
export function getProductImages(slug: string): string[] {
  return PRODUCT_IMAGES[slug] ?? PRODUCT_IMAGES['default'] ?? ['/products/chess-marble-01.jpg']
}

/** Get the first image for a product slug */
export function getProductImage(slug: string): string {
  return getProductImages(slug)[0]
}

/** Get category image, returning undefined if not found */
export function getCategoryImage(slug: string): string | undefined {
  return CATEGORY_IMAGES[slug]
}

/** Get gradient for a category slug */
export function getCategoryGradient(slug: string): string {
  return CATEGORY_GRADIENTS[slug] ?? 'from-brand-navy to-brand-steel'
}
