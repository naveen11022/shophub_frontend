import { useEffect, useState } from 'react'
import { Edit, Trash2, Search, UserPlus } from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import AdminNav from '@/components/AdminNav'

interface User { id: number; email: string; username: string; full_name: string; role: string; is_active: boolean; created_at: string }

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({ email: '', username: '', full_name: '', password: '', role: 'customer', is_active: true })

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => { try { const response = await api.get('/api/admin/users'); setUsers(response.data) } catch { toast.error('Failed to fetch users') } finally { setLoading(false) } }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingUser) {
        const updateData: any = { email: formData.email, username: formData.username, full_name: formData.full_name, role: formData.role, is_active: formData.is_active }
        if (formData.password) updateData.password = formData.password
        await api.put(`/api/admin/users/${editingUser.id}`, updateData); toast.success('User updated')
      } else { await api.post('/api/admin/users', formData); toast.success('User created') }
      setShowModal(false); resetForm(); fetchUsers()
    } catch (error: any) { toast.error(error.response?.data?.detail || 'Failed to save user') }
  }

  const handleEdit = (user: User) => { setEditingUser(user); setFormData({ email: user.email, username: user.username, full_name: user.full_name, password: '', role: user.role, is_active: user.is_active }); setShowModal(true) }
  const handleDelete = async (id: number) => { if (!confirm('Delete this user?')) return; try { await api.delete(`/api/admin/users/${id}`); toast.success('User deleted'); fetchUsers() } catch { toast.error('Failed to delete') } }
  const resetForm = () => { setFormData({ email: '', username: '', full_name: '', password: '', role: 'customer', is_active: true }); setEditingUser(null) }
  const handleAddNew = () => { resetForm(); setShowModal(true) }
  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(searchQuery.toLowerCase()) || u.username.toLowerCase().includes(searchQuery.toLowerCase()))

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-xl">Loading...</div></div>

  return (
    <>
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6"><h1 className="text-3xl font-bold">Users Management</h1><button onClick={handleAddNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"><UserPlus size={20} />Add User</button></div>
        <div className="mb-6"><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div></div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{user.username}</div><div className="text-sm text-gray-500">{user.full_name}</div></td>
                  <td className="px-6 py-4"><div className="text-sm text-gray-900">{user.email}</div></td>
                  <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>{user.role}</span></td>
                  <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm font-medium"><button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit size={18} /></button><button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4">{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">Email *</label><input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">Username *</label><input type="text" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">Full Name *</label><input type="text" required value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">Password {editingUser && '(leave blank to keep current)'}</label><input type="password" required={!editingUser} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">Role *</label><select required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option value="customer">Customer</option><option value="admin">Admin</option></select></div>
                <div><label className="flex items-center"><input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="mr-2" /><span className="text-sm font-medium">Active</span></label></div>
                <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => { setShowModal(false); resetForm() }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editingUser ? 'Update' : 'Create'}</button></div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
