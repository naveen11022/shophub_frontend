import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { formatPrice, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import AdminNav from '@/components/AdminNav'

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try { const response = await api.get('/api/admin/orders'); setOrders(response.data) }
    catch { toast.error('Failed to fetch orders') }
    finally { setLoading(false) }
  }

  const updateOrderStatus = async (orderId: number, status: string) => {
    try { await api.put(`/api/admin/orders/${orderId}/status?status=${status}`); toast.success('Order status updated'); fetchOrders() }
    catch { toast.error('Failed to update status') }
  }

  if (loading) return <div className="container py-8">Loading...</div>

  return (
    <>
      <AdminNav />
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center"><p className="text-gray-500">No orders yet</p></div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4"><div className="font-medium">{order.order_number}</div></td>
                    <td className="px-6 py-4"><div className="text-sm">{order.user?.email || 'N/A'}</div></td>
                    <td className="px-6 py-4 font-medium">{formatPrice(order.total_amount)}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{order.status}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.created_at)}</td>
                    <td className="px-6 py-4">
                      <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className="px-2 py-1 border rounded text-sm">
                        <option value="pending">Pending</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
