import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { formatPrice, formatDate } from '@/lib/utils'
import AdminNav from '@/components/AdminNav'

interface AdminStats {
  total_products: number; total_orders: number; total_users: number; total_revenue: number
  recent_orders: any[]; low_stock_products: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStats() }, [])

  const fetchStats = async () => {
    try { const response = await api.get('/api/admin/stats'); setStats(response.data) }
    catch (error) { console.error('Failed to fetch stats:', error) }
    finally { setLoading(false) }
  }

  if (loading) return <div className="container py-8">Loading...</div>

  return (
    <>
      <AdminNav />
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6"><div className="flex items-center justify-between mb-2"><h3 className="text-gray-600">Total Products</h3><Package className="text-primary-600" size={24} /></div><p className="text-3xl font-bold">{stats?.total_products || 0}</p></div>
          <div className="bg-white rounded-lg shadow-md p-6"><div className="flex items-center justify-between mb-2"><h3 className="text-gray-600">Total Orders</h3><ShoppingCart className="text-green-600" size={24} /></div><p className="text-3xl font-bold">{stats?.total_orders || 0}</p></div>
          <div className="bg-white rounded-lg shadow-md p-6"><div className="flex items-center justify-between mb-2"><h3 className="text-gray-600">Total Users</h3><Users className="text-blue-600" size={24} /></div><p className="text-3xl font-bold">{stats?.total_users || 0}</p></div>
          <div className="bg-white rounded-lg shadow-md p-6"><div className="flex items-center justify-between mb-2"><h3 className="text-gray-600">Revenue</h3><DollarSign className="text-yellow-600" size={24} /></div><p className="text-3xl font-bold">{formatPrice(stats?.total_revenue || 0)}</p></div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><TrendingUp size={20} />Recent Orders</h2>
            {stats?.recent_orders?.length ? (
              <div className="space-y-3">{stats.recent_orders.map((order) => (
                <div key={order.id} className="border-b pb-3 last:border-0"><div className="flex justify-between items-start"><div><p className="font-semibold">{order.order_number}</p><p className="text-sm text-gray-500">{formatDate(order.created_at)}</p></div><div className="text-right"><p className="font-bold text-primary-600">{formatPrice(order.total_amount)}</p><span className={`text-xs px-2 py-1 rounded ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{order.status}</span></div></div></div>
              ))}</div>
            ) : <p className="text-gray-500">No orders yet</p>}
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><AlertCircle size={20} className="text-red-500" />Low Stock Alert</h2>
            {stats?.low_stock_products?.length ? (
              <div className="space-y-3">{stats.low_stock_products.map((product) => (
                <div key={product.id} className="border-b pb-3 last:border-0"><div className="flex justify-between items-start"><div><p className="font-semibold">{product.name}</p><p className="text-sm text-gray-500">{formatPrice(product.price)}</p></div><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">{product.stock} left</span></div></div>
              ))}</div>
            ) : <p className="text-gray-500">All products well stocked</p>}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Link to="/admin/products" className="block px-4 py-3 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 text-center font-semibold">Manage Products</Link>
            <Link to="/admin/orders" className="block px-4 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-center font-semibold">Manage Orders</Link>
            <Link to="/admin/users" className="block px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-center font-semibold">Manage Users</Link>
            <Link to="/admin/categories" className="block px-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 text-center font-semibold">Manage Categories</Link>
            <button onClick={fetchStats} className="block px-4 py-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 text-center font-semibold w-full">Refresh Stats</button>
          </div>
        </div>
      </div>
    </>
  )
}
