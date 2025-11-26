import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, User, Search, LogOut } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { logout } from '@/store/slices/authSlice'
import { useState } from 'react'

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const { itemCount } = useSelector((state: RootState) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600">ShopHub</Link>
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input type="text" placeholder="Search products..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </form>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/wishlist" className="text-gray-600 hover:text-primary-600"><Heart size={24} /></Link>
                <Link to="/cart" className="text-gray-600 hover:text-primary-600 relative">
                  <ShoppingCart size={24} />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{itemCount}</span>
                  )}
                </Link>
                <div className="relative">
                  <button onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-2 text-gray-600 hover:text-primary-600">
                    <User size={24} /><span className="hidden md:inline">{user?.username}</span>
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                      {user?.role === 'admin' && <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowMenu(false)}>Admin Dashboard</Link>}
                      <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowMenu(false)}>My Orders</Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><LogOut size={18} />Logout</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg">Login</Link>
                <Link to="/register" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
