import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useAddToCartMutation, useAddToWishlistMutation } from '@/store/slices/apiSlice'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [addToCart] = useAddToCartMutation()
  const [addToWishlist] = useAddToWishlistMutation()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await addToCart({ product_id: product.id, quantity: 1 }).unwrap()
      toast.success('Added to cart!')
    } catch {
      toast.error('Please login to add items to cart')
    }
  }

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await addToWishlist(product.id).unwrap()
      toast.success('Added to wishlist!')
    } catch {
      toast.error('Please login to add items to wishlist')
    }
  }

  return (
    <Link to={`/products/${product.id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img src={product.images?.[0] || 'https://picsum.photos/400/300'} alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          onError={(e) => { e.currentTarget.src = 'https://picsum.photos/400/300' }} />
        {product.discount_price && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
            {Math.round((1 - product.discount_price / product.price) * 100)}% OFF
          </span>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleAddToWishlist} className="p-2 bg-white rounded-full shadow hover:bg-gray-100"><Heart size={18} /></button>
          <button onClick={handleAddToCart} className="p-2 bg-white rounded-full shadow hover:bg-gray-100"><ShoppingCart size={18} /></button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.brand}</p>
        <div className="flex items-center gap-1 mt-1">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-600">{product.rating?.toFixed(1) || '0.0'} ({product.review_count || 0})</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-primary-600">{formatPrice(product.discount_price || product.price)}</span>
          {product.discount_price && <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>}
        </div>
      </div>
    </Link>
  )
}
