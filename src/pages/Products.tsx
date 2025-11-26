import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useGetCategoriesQuery } from '@/store/slices/apiSlice'
import { api } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import { ProductCardSkeleton } from '@/components/Skeleton'
import { Filter, Loader2 } from 'lucide-react'
import { Product } from '@/types'

const PRODUCTS_PER_PAGE = 20

export default function Products() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [, setPage] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const [filters, setFilters] = useState({
    category_id: searchParams.get('category_id') || '',
    search: searchParams.get('search') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    brand: searchParams.get('brand') || '',
  })

  const { data: categoriesData } = useGetCategoriesQuery()

  const fetchProducts = useCallback(async (pageNum: number, reset = false) => {
    if (reset) {
      setLoading(true)
      setProducts([])
    } else {
      setLoadingMore(true)
    }

    try {
      const params = new URLSearchParams()
      params.set('skip', String(pageNum * PRODUCTS_PER_PAGE))
      params.set('limit', String(PRODUCTS_PER_PAGE))
      
      if (filters.category_id) params.set('category_id', filters.category_id)
      if (filters.search) params.set('search', filters.search)
      if (filters.min_price) params.set('min_price', filters.min_price)
      if (filters.max_price) params.set('max_price', filters.max_price)
      if (filters.brand) params.set('brand', filters.brand)

      const response = await api.get(`/api/products?${params.toString()}`)
      const newProducts = response.data.products || []
      
      if (reset) {
        setProducts(newProducts)
      } else {
        setProducts(prev => [...prev, ...newProducts])
      }
      
      setHasMore(newProducts.length === PRODUCTS_PER_PAGE)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [filters])

  // Initial load and filter changes
  useEffect(() => {
    setPage(0)
    fetchProducts(0, true)
  }, [filters.category_id, filters.search, filters.min_price, filters.max_price, filters.brand])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          setPage(prev => {
            const nextPage = prev + 1
            fetchProducts(nextPage)
            return nextPage
          })
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => observerRef.current?.disconnect()
  }, [hasMore, loading, loadingMore, fetchProducts])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({ category_id: '', search: '', min_price: '', max_price: '', brand: '' })
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button onClick={() => setShowFilters(!showFilters)} className="md:hidden flex items-center gap-2 px-4 py-2 border rounded-lg">
          <Filter size={20} /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-64 flex-shrink-0`}>
          <div className="bg-white rounded-lg shadow-md p-4 space-y-4 sticky top-20">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select value={filters.category_id} onChange={(e) => handleFilterChange('category_id', e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                <option value="">All Categories</option>
                {categoriesData?.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input type="text" placeholder="Search..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price Range</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={filters.min_price} onChange={(e) => handleFilterChange('min_price', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                <input type="number" placeholder="Max" value={filters.max_price} onChange={(e) => handleFilterChange('max_price', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <input type="text" placeholder="Brand name" value={filters.brand} onChange={(e) => handleFilterChange('brand', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <button onClick={clearFilters} className="w-full px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50">Clear Filters</button>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(12).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <>
              <p className="text-gray-600 mb-4">Showing {products.length} products</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Load More Trigger */}
              <div ref={loadMoreRef} className="py-8 flex justify-center">
                {loadingMore && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="animate-spin" size={24} />
                    <span>Loading more products...</span>
                  </div>
                )}
                {!hasMore && products.length > 0 && (
                  <p className="text-gray-500">No more products to load</p>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found</p>
              <button onClick={clearFilters} className="mt-4 text-primary-600 hover:underline">Clear filters</button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
