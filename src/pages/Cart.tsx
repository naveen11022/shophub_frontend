import { Link } from 'react-router-dom'
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation } from '@/store/slices/apiSlice'
import { formatPrice } from '@/lib/utils'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Cart() {
  const { data: cart, isLoading } = useGetCartQuery()
  const [updateCartItem] = useUpdateCartItemMutation()
  const [removeFromCart] = useRemoveFromCartMutation()

  const handleUpdateQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) return
    try { await updateCartItem({ id, quantity }).unwrap() } catch { toast.error('Failed to update quantity') }
  }

  const handleRemove = async (id: number) => {
    try { await removeFromCart(id).unwrap(); toast.success('Item removed') } catch { toast.error('Failed to remove item') }
  }

  if (isLoading) return <div className="container py-8">Loading...</div>
  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products to get started</p>
        <Link to="/products" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700">Browse Products</Link>
      </div>
    )
  }

  const subtotal = cart.items.reduce((sum, item) => sum + (item.product.discount_price || item.product.price) * item.quantity, 0)

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex gap-4">
              <img src={item.product.images?.[0] || 'https://picsum.photos/100/100'} alt={item.product.name} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <Link to={`/products/${item.product.id}`} className="font-semibold hover:text-primary-600">{item.product.name}</Link>
                <p className="text-gray-500 text-sm">{item.product.brand}</p>
                <p className="text-primary-600 font-bold">{formatPrice(item.product.discount_price || item.product.price)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => handleRemove(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button>
                <div className="flex items-center border rounded">
                  <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-100"><Minus size={16} /></button>
                  <span className="px-3">{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-100"><Plus size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
            <div className="border-t pt-2 flex justify-between font-bold"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
          </div>
          <Link to="/checkout" className="block w-full bg-primary-600 text-white text-center py-3 rounded-lg hover:bg-primary-700">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  )
}
