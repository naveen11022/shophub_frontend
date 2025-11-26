import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Users, FolderTree } from 'lucide-react'

export default function AdminNav() {
  const location = useLocation()
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/categories', label: 'Categories', icon: FolderTree },
  ]

  return (
    <nav className="bg-white shadow-md mb-6">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  isActive ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}>
                <Icon size={18} />{item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
