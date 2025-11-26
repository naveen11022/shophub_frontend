import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useGetCartQuery } from './store/slices/apiSlice'
import { setCart } from './store/slices/cartSlice'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Wishlist from './pages/Wishlist'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/admin/Dashboard'
import AdminOrders from './pages/admin/Orders'
import AdminProducts from './pages/admin/Products'
import AdminUsers from './pages/admin/Users'
import AdminCategories from './pages/admin/Categories'

function App() {
  const dispatch = useDispatch()
  const { data: cart } = useGetCartQuery(undefined, {
    skip: !localStorage.getItem('access_token'),
  })

  useEffect(() => {
    if (cart) {
      dispatch(setCart(cart))
    }
  }, [cart, dispatch])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/*" element={
            <ProtectedRoute adminOnly>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/orders" element={<AdminOrders />} />
                <Route path="/products" element={<AdminProducts />} />
                <Route path="/users" element={<AdminUsers />} />
                <Route path="/categories" element={<AdminCategories />} />
              </Routes>
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
