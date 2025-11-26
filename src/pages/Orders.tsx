import { useGetOrdersQuery } from '@/store/slices/apiSlice'
import { formatPrice, formatDate } from '@/lib/utils'
import { Package } from 'lucide-react'

export default function Orders() {
  const { data: orders, isLoading } = useGetOrdersQuery()

  if (isLoading) return <div className="container py-8">Loading...</div>
  if (!orders || orders.length === 0) {
    return (
      <div className="container py-16 text-center">
        <Package size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
        <p className="text-gray-500">Start shopping to see your orders here</p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-wrap justify-between items-start mb-4">
              <div>
                <p className="font-semibold">Order #{order.order_number}</p>
                <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{order.status}</span>
                <p className="font-bold mt-2">{formatPrice(order.total_amount)}</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-2">Items: {order.items?.length || 0}</p>
              <p className="text-sm text-gray-600">Payment: {order.payment_method} ({order.payment_status})</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
