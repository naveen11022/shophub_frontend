export interface User {
  id: number
  email: string
  username: string
  full_name?: string
  phone?: string
  role: 'admin' | 'customer'
  is_active: boolean
  created_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  is_active: boolean
  created_at: string
}

export interface Product {
  id: number
  name: string
  slug: string
  description?: string
  price: number
  discount_price?: number
  brand?: string
  sku?: string
  stock: number
  images: string[]
  category_id: number
  category?: Category
  is_featured: boolean
  is_active: boolean
  rating: number
  review_count: number
  created_at: string
}

export interface CartItem {
  id: number
  product_id: number
  quantity: number
  product: Product
}

export interface Cart {
  id: number
  items: CartItem[]
}

export interface OrderItem {
  id: number
  product_id: number
  quantity: number
  price: number
  product?: Product
}

export interface Order {
  id: number
  order_number: string
  status: string
  total_amount: number
  shipping_address: Record<string, any>
  payment_method: string
  payment_status: string
  created_at: string
  items: OrderItem[]
}

export interface Review {
  id: number
  user_id: number
  product_id: number
  rating: number
  title?: string
  comment?: string
  created_at: string
  user?: User
}

export interface Wishlist {
  id: number
  product_id: number
  created_at: string
  product: Product
}

export interface Banner {
  id: number
  title: string
  subtitle?: string
  image: string
  link?: string
  position: number
  is_active: boolean
  created_at: string
}
