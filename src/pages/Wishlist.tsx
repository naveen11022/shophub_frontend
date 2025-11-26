import { Link } from 'react-router-dom'
import { useGetWishlistQuery, useRemoveFromWishlistMutation, useAddToCartMutation } from '@/store/slices/apiSlice'
import { formatPrice } from '@/lib/utils'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Wishlist() {
  const { data: wishlist, isLoading } = useGetWishlistQuery()
  const [removeFromWishlist] = useRemoveFromWishlistMutation()
  const [addToCart] = useAddToCartMutation()

  const handleRemove = async (productId: number) => {
    try { await removeFromWishlist(productId).unwrap(); toast.success('Removed from wishlist') } catch { toast.error('Failed to remove') }
  }

  const handleAddToCart = async (productId: number) => {
    try { await addToCart({ product_id: productId, quantity: 1 }).unwrap(); toast.success('Added to cart!') } catch { toast.error('Failed to add to cart') }
  }

  if (isLoading) return <div className="container py-8">Loading...</div>
  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="container py-16 text-center">
        <Heart size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Save items you love for later</p>
        <Link to="/products" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Link to={`/products/${item.product.id}`}>
              <img src={item.product.images?.[0] || 'https://picsum.photos/300/300'} alt={item.product.name} className="w-full h-48 object-cover" />
            </Link>
            <div className="p-4">
              <Link to={`/products/${item.product.id}`} className="font-semibold hover:text-primary-600">{item.product.name}</Link>
              <p className="text-primary-600 font-bold mt-2">{formatPrice(item.product.discount_price || item.product.price)}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleAddToCart(item.product.id)} className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"><ShoppingCart size={18} />Add</button>
                <button onClick={() => handleRemove(item.product.id)} className="p-2 border rounded-lg hover:bg-gray-100 text-red-500"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
