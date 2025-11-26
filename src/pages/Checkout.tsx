import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetCartQuery, useCreateOrderMutation } from '@/store/slices/apiSlice'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { data: cart } = useGetCartQuery()
  const [createOrder, { isLoading }] = useCreateOrderMutation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ full_name: '', phone: '', address: '', city: '', state: '', zip_code: '', payment_method: 'cod' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createOrder({ shipping_address: { full_name: formData.full_name, phone: formData.phone, address: formData.address, city: formData.city, state: formData.state, zip_code: formData.zip_code }, payment_method: formData.payment_method }).unwrap()
      toast.success('Order placed successfully!')
      navigate('/orders')
    } catch { toast.error('Failed to place order') }
  }

  if (!cart || cart.items.length === 0) return <div className="container py-8">Your cart is empty</div>
  const subtotal = cart.items.reduce((sum, item) => sum + (item.product.discount_price || item.product.price) * item.quantity, 0)

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm font-medium mb-2">Full Name</label><input type="text" required value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-2">Phone</label><input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
          </div>
          <div className="mb-4"><label className="block text-sm font-medium mb-2">Address</label><input type="text" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div><label className="block text-sm font-medium mb-2">City</label><input type="text" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-2">State</label><input type="text" required value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-2">ZIP Code</label><input type="text" required value={formData.zip_code} onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
          </div>
          <h2 className="text-xl font-bold mb-4">Payment Method</h2>
          <div className="space-y-2 mb-6">
            <label className="flex items-center gap-2"><input type="radio" name="payment" value="card" checked={formData.payment_method === 'card'} onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })} /><span>Credit/Debit Card</span></label>
            <label className="flex items-center gap-2"><input type="radio" name="payment" value="cod" checked={formData.payment_method === 'cod'} onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })} /><span>Cash on Delivery</span></label>
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50">{isLoading ? 'Placing Order...' : 'Place Order'}</button>
        </form>
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">{cart.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm"><span>{item.product.name} x {item.quantity}</span><span>{formatPrice((item.product.discount_price || item.product.price) * item.quantity)}</span></div>
          ))}</div>
          <div className="border-t pt-4 flex justify-between font-bold"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
        </div>
      </div>
    </div>
  )
}
