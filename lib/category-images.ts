/** Category hero images — first image in each category folder under /public/images */
export const CATEGORY_IMAGES: Record<string, string> = {
  'chess-sets':  '/images/Marble_Chess_Sets.jpeg',
  'mugs':        '/images/Premium_Mugs_.jpeg',
  'leather':     '/images/Leather_&_Accessories_.jpeg',
  'humidors':    '/images/Humidors_.jpeg',
  'ships':       '/images/Ships,_Planes_.jpeg',
  'ceramic':     '/images/Ceramic_&_Glass_Decor_.jpeg',
  'hip-flasks':  '/images/Hip_Flasks_.jpeg',
  'gifts':       '/images/australia_special.jpeg',
}

export function categoryImage(slug: string, fallback?: string | null): string {
  return CATEGORY_IMAGES[slug] ?? fallback ?? '/images/australia_special.jpeg'
}
