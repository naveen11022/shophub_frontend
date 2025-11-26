import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Search, Upload } from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import AdminNav from '@/components/AdminNav'

interface Category { id: number; name: string; slug: string; description?: string; image?: string; is_active: boolean }

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', image: '', is_active: true })

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => { try { const response = await api.get('/api/admin/categories'); setCategories(response.data) } catch { toast.error('Failed to fetch categories') } finally { setLoading(false) } }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCategory) { await api.put(`/api/admin/categories/${editingCategory.id}`, formData); toast.success('Category updated') }
      else { await api.post('/api/categories', formData); toast.success('Category created') }
      setShowModal(false); resetForm(); fetchCategories()
    } catch (error: any) { toast.error(error.response?.data?.detail || 'Failed to save category') }
  }

  const handleEdit = (category: Category) => { setEditingCategory(category); setFormData({ name: category.name, slug: category.slug, description: category.description || '', image: category.image || '', is_active: category.is_active }); setShowModal(true) }
  const handleDelete = async (id: number) => { if (!confirm('Delete this category?')) return; try { await api.delete(`/api/admin/categories/${id}`); toast.success('Category deleted'); fetchCategories() } catch { toast.error('Failed to delete') } }
  const resetForm = () => { setFormData({ name: '', slug: '', description: '', image: '', is_active: true }); setEditingCategory(null) }
  const handleAddNew = () => { resetForm(); setShowModal(true) }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please select an image'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be less than 5MB'); return }
    setUploading(true)
    const formDataUpload = new FormData(); formDataUpload.append('file', file)
    try {
      const response = await api.post('/api/upload/image', formDataUpload, { headers: { 'Content-Type': 'multipart/form-data' } })
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      setFormData({ ...formData, image: `${baseUrl}${response.data.url}` }); toast.success('Image uploaded')
    } catch (error: any) { toast.error(error.response?.data?.detail || 'Failed to upload') }
    finally { setUploading(false) }
  }

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.slug.toLowerCase().includes(searchQuery.toLowerCase()))

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-xl">Loading...</div></div>

  return (
    <>
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6"><h1 className="text-3xl font-bold">Categories Management</h1><button onClick={handleAddNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"><Plus size={20} />Add Category</button></div>
        <div className="mb-6"><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder="Search categories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div></div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{category.name}</div></td>
                  <td className="px-6 py-4"><div className="text-sm text-gray-500">{category.slug}</div></td>
                  <td className="px-6 py-4"><div className="text-sm text-gray-500 max-w-xs truncate">{category.description || '-'}</div></td>
                  <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{category.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-6 py-4 text-sm font-medium"><button onClick={() => handleEdit(category)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit size={18} /></button><button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">Name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">Slug *</label><input type="text" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">Image</label><div className="flex gap-2 items-center"><input type="url" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="Image URL" className="flex-1 px-3 py-2 border rounded-lg" />{formData.image && <img src={formData.image} alt="Preview" className="h-10 w-10 rounded object-cover" />}</div><label className="cursor-pointer mt-2 inline-block"><input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} /><span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"><Upload size={14} />{uploading ? 'Uploading...' : 'Upload File'}</span></label></div>
                <div><label className="flex items-center"><input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="mr-2" /><span className="text-sm font-medium">Active</span></label></div>
                <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => { setShowModal(false); resetForm() }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editingCategory ? 'Update' : 'Create'}</button></div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
