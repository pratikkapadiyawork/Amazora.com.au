import type { Product, Category, Order, OrderItem, Review, Variant } from '@prisma/client'

export type ProductWithRelations = Product & {
  category: Category
  reviews:  Review[]
  variants: Variant[]
  _count?:  { reviews: number }
}

export type ProductCard = Product & {
  category: Pick<Category, 'id' | 'name' | 'slug'>
  reviews:  Pick<Review, 'rating'>[]
}

export type OrderWithItems = Order & {
  items: (OrderItem & { product: Pick<Product, 'id' | 'name' | 'images'> })[]
}

export interface CheckoutFormData {
  email?:          string
  firstName?:      string
  lastName?:       string
  phone?:          string
  address1?:       string
  address2?:       string
  city?:           string
  state?:          string
  postcode?:       string
  country?:        string
  shippingMethod?: 'standard' | 'express' | 'overnight'
  saveAddress?:    boolean
}

export interface ShopFilters {
  category?: string
  sort?:     'popular' | 'newest' | 'price-asc' | 'price-desc'
  min?:      number
  max?:      number
  rating?:   number
  page?:     number
  q?:        string
}

export const AU_STATES = [
  { value: 'NSW', label: 'New South Wales'              },
  { value: 'VIC', label: 'Victoria'                     },
  { value: 'QLD', label: 'Queensland'                   },
  { value: 'WA',  label: 'Western Australia'            },
  { value: 'SA',  label: 'South Australia'              },
  { value: 'TAS', label: 'Tasmania'                     },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT',  label: 'Northern Territory'           },
] as const
