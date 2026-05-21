import { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/account', '/checkout'] },
    ],
    sitemap: 'https://amazora.com.au/sitemap.xml',
    host: 'https://amazora.com.au',
  }
}
