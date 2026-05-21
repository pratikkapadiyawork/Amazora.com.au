import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true } }),
  ])
  const base = 'https://amazora.com.au'
  const now = new Date()
  return [
    { url: base, priority: 1.0, changeFrequency: 'daily', lastModified: now },
    { url: `${base}/shop`, priority: 0.95, changeFrequency: 'daily', lastModified: now },
    { url: `${base}/about`, priority: 0.7, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/contact`, priority: 0.7, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/shipping`, priority: 0.65, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/returns`, priority: 0.65, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/blog`, priority: 0.8, changeFrequency: 'weekly', lastModified: now },
    { url: `${base}/saved`, priority: 0.5, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/privacy`, priority: 0.4, changeFrequency: 'yearly', lastModified: now },
    { url: `${base}/terms`, priority: 0.4, changeFrequency: 'yearly', lastModified: now },
    ...['gifts-for-him-australia','gifts-for-her-australia','gifts-for-home-australia','australian-gifts-ned-kelly','milestone-birthday-gifts','cigar-gifts-australia']
      .map(slug => ({ url: `${base}/blog/${slug}`, priority: 0.75, changeFrequency: 'monthly' as const, lastModified: now })),
    ...categories.map(c => ({ url: `${base}/category/${c.slug}`, priority: 0.9, changeFrequency: 'weekly' as const, lastModified: now })),
    ...products.map(p => ({ url: `${base}/shop/${p.slug}`, priority: 0.8, changeFrequency: 'monthly' as const, lastModified: p.updatedAt })),
  ]
}
