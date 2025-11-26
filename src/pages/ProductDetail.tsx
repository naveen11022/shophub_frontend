import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetProductQuery, useGetProductReviewsQuery, useAddToCartMutation, useAddToWishlistMutation } from '@/store/slices/apiSlice'
import { ProductDetailSkeleton } from '@/components/Skeleton'
import { formatPrice } from '@/lib/utils'
import { Heart, ShoppingCart, Star, Minus, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { data: product, isLoading } = useGetProductQuery(Number(id))
  const { data: reviews } = useGetProductReviewsQuery(Number(id))
  const [addToCart] = useAddToCartMutation()
  const [addToWishlist] = useAddToWishlistMutation()

  if (isLoading) return <ProductDetailSkeleton />
  if (!product) return <div className="container py-8">Product not found</div>

  const handleAddToCart = async () => {
    try {
      await addToCart({ product_id: product.id, quantity }).unwrap()
      toast.success('Added to cart!')
    } catch { toast.error('Please login to add items to cart') }
  }

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist(product.id).unwrap()
      toast.success('Added to wishlist!')
    } catch { toast.error('Please login to add items to wishlist') }
  }

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg overflow-hidden mb-4">
            <img src={product.images?.[selectedImage] || 'https://picsum.photos/600/600'} alt={product.name} className="w-full h-96 object-cover" onError={(e) => { e.currentTarget.src = 'https://picsum.photos/600/600' }} />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2">{product.images.map((img, i) => (
              <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === i ? 'border-primary-600' : 'border-transparent'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}</div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-4">{product.brand}</p>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center"><Star size={18} className="fill-yellow-400 text-yellow-400" /><span className="ml-1">{product.rating?.toFixed(1) || '0.0'}</span></div>
            <span className="text-gray-400">({product.review_count || 0} reviews)</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-primary-600">{formatPrice(product.discount_price || product.price)}</span>
            {product.discount_price && <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>}
          </div>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <div className="flex items-center gap-4 mb-6">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center border rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100"><Minus size={18} /></button>
              <span className="px-4">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100"><Plus size={18} /></button>
            </div>
            <span className="text-gray-500">{product.stock} in stock</span>
          </div>
          <div className="flex gap-4">
            <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700"><ShoppingCart size={20} />Add to Cart</button>
            <button onClick={handleAddToWishlist} className="p-3 border rounded-lg hover:bg-gray-100"><Heart size={20} /></button>
          </div>
        </div>
      </div>
      {reviews && reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          <div className="space-y-4">{reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg p-4 shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">{Array(5).fill(0).map((_, i) => <Star key={i} size={16} className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />)}</div>
                <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              {review.title && <h4 className="font-semibold">{review.title}</h4>}
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}</div>
        </div>
      )}
    </div>
  )
}
