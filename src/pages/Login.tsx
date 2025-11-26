import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/store/slices/authSlice'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/api/auth/login', { email, password })
      dispatch(setCredentials({ user: response.data.user, token: response.data.access_token }))
      toast.success('Login successful!')
      navigate('/')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <p className="text-center mt-4 text-gray-600">Don't have an account? <Link to="/register" className="text-primary-600 hover:underline">Register</Link></p>
      </div>
    </div>
  )
}
