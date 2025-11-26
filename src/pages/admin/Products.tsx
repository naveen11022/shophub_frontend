import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Search, Upload } from 'lucide-react'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'
import AdminNav from '@/components/AdminNav'

interface Product { id: number; name: string; price: number; discount_price?: number; brand: string; stock: number; category_id: number; is_featured: boolean; is_active: boolean; images?: string[]; slug?: string; description?: string; sku?: string }

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', price: '', discount_price: '', brand: '', sku: '', stock: '', category_id: '', is_featured: false, images: ['https://picsum.photos/500/500'] })

  useEffect(() => { fetchProducts(); fetchCategories() }, [])

  const fetchProducts = async () => { try { const response = await api.get('/api/products?limit=1000'); setProducts(response.data.products) } catch { toast.error('Failed to fetch products') } finally { setLoading(false) } }
  const fetchCategories = async () => { try { const response = await api.get('/api/categories'); setCategories(response.data) } catch { console.error('Failed to fetch categories') } }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const productData = { ...formData, price: parseFloat(formData.price), discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null, stock: parseInt(formData.stock), category_id: parseInt(formData.category_id) }
    try {
      if (editingProduct) { await api.put(`/api/products/${editingProduct.id}`, productData); toast.success('Product updated') }
      else { await api.post('/api/products', productData); toast.success('Product created') }
      setShowModal(false); resetForm(); fetchProducts()
    } catch (error: any) { toast.error(error.response?.data?.detail || 'Failed to save product') }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({ name: product.name, slug: product.slug || '', description: product.description || '', price: product.price.toString(), discount_price: product.discount_price?.toString() || '', brand: product.brand || '', sku: product.sku || '', stock: product.stock.toString(), category_id: product.category_id.toString(), is_featured: product.is_featured, images: product.images || ['https://picsum.photos/500/500'] })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => { if (!confirm('Delete this product?')) return; try { await api.delete(`/api/products/${id}`); toast.success('Product deleted'); fetchProducts() } catch { toast.error('Failed to delete') } }
  const resetForm = () => { setFormData({ name: '', slug: '', description: '', price: '', discount_price: '', brand: '', sku: '', stock: '', category_id: '', is_featured: false, images: ['https://picsum.photos/500/500'] }); setEditingProduct(null) }
  const handleAddNew = () => { resetForm(); setShowModal(true) }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]; if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please select an image'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be less than 5MB'); return }
    setUploading(true)
    const formDataUpload = new FormData(); formDataUpload.append('file', file)
    try {
      const response = await api.post('/api/upload/image', formDataUpload, { headers: { 'Content-Type': 'multipart/form-data' } })
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const newImages = [...formData.images]; newImages[index] = `${baseUrl}${response.data.url}`
      setFormData({ ...formData, images: newImages }); toast.success('Image uploaded')
    } catch (error: any) { toast.error(error.response?.data?.detail || 'Failed to upload') }
    finally { setUploading(false) }
  }

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand?.toLowerCase().includes(searchQuery.toLowerCase()))

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-xl">Loading...</div></div>

  return (
    <>
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Products Management</h1>
          <button onClick={handleAddNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"><Plus size={20} />Add Product</button>
        </div>
        <div className="mb-6"><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div></div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4">{product.images?.length ? <img src={product.images[0]} alt={product.name} className="h-12 w-12 rounded object-cover" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100' }} /> : <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Image</div>}</td>
                  <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{product.name}</div></td>
                  <td className="px-6 py-4"><div className="text-sm text-gray-500">{product.brand}</div></td>
                  <td className="px-6 py-4"><div className="text-sm text-gray-900">{formatPrice(product.price)}</div>{product.discount_price && <div className="text-sm text-green-600">{formatPrice(product.discount_price)}</div>}</td>
                  <td className="px-6 py-4"><div className={`text-sm ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>{product.stock}</div></td>
                  <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{product.is_active ? 'Active' : 'Inactive'}</span>{product.is_featured && <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Featured</span>}</td>
                  <td className="px-6 py-4 text-sm font-medium"><button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit size={18} /></button><button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Slug *</label><input type="text" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div></div>
                <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Price *</label><input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Discount Price</label><input type="number" step="0.01" value={formData.discount_price} onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div></div>
                <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Brand *</label><input type="text" required value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">SKU *</label><input type="text" required value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div></div>
                <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Stock *</label><input type="number" required value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Category *</label><select required value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option value="">Select Category</option>{categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></div></div>
                <div><label className="flex items-center"><input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="mr-2" /><span className="text-sm font-medium">Featured Product</span></label></div>
                <div><label className="block text-sm font-medium mb-2">Product Images</label><div className="space-y-3">{formData.images.map((image, index) => (<div key={index} className="space-y-2"><div className="flex gap-2 items-start"><input type="url" value={image} onChange={(e) => { const newImages = [...formData.images]; newImages[index] = e.target.value; setFormData({ ...formData, images: newImages }) }} placeholder="Enter image URL" className="flex-1 px-3 py-2 border rounded-lg" />{image && <img src={image} alt={`Preview ${index + 1}`} className="h-10 w-10 rounded object-cover" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100' }} />}{formData.images.length > 1 && <button type="button" onClick={() => { const newImages = formData.images.filter((_, i) => i !== index); setFormData({ ...formData, images: newImages }) }} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>}</div><label className="cursor-pointer"><input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, index)} className="hidden" disabled={uploading} /><span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"><Upload size={14} />{uploading ? 'Uploading...' : 'Upload File'}</span></label></div>))}<button type="button" onClick={() => setFormData({ ...formData, images: [...formData.images, 'https://picsum.photos/500/500'] })} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"><Plus size={16} />Add Another Image</button></div></div>
                <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => { setShowModal(false); resetForm() }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editingProduct ? 'Update' : 'Create'}</button></div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
