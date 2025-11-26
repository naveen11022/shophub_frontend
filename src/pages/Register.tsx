import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export default function Register() {
  const [formData, setFormData] = useState({ email: '', username: '', full_name: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/auth/register', formData)
      toast.success('Registration successful! Please login.')
      navigate('/login')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">{loading ? 'Registering...' : 'Register'}</button>
        </form>
        <p className="text-center mt-4 text-gray-600">Already have an account? <Link to="/login" className="text-primary-600 hover:underline">Login</Link></p>
      </div>
    </div>
  )
}
