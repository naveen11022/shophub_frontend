import { Link } from 'react-router-dom'
import { useGetProductsQuery, useGetCategoriesQuery, useGetBannersQuery } from '@/store/slices/apiSlice'
import ProductCard from '@/components/ProductCard'
import { ProductCardSkeleton } from '@/components/Skeleton'
import { ChevronRight } from 'lucide-react'

export default function Home() {
  const { data: bannersData } = useGetBannersQuery()
  const { data: categoriesData } = useGetCategoriesQuery()
  const { data: featuredData, isLoading: featuredLoading } = useGetProductsQuery({ is_featured: true, limit: 8 })
  const { data: newData, isLoading: newLoading } = useGetProductsQuery({ limit: 8 })

  return (
    <div>
      {bannersData && bannersData.length > 0 && (
        <div className="relative h-[500px] bg-gradient-to-r from-primary-600 to-primary-800">
          <img src={bannersData[0].image} alt={bannersData[0].title} className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 flex items-center">
            <div className="container">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">{bannersData[0].title}</h1>
              <p className="text-xl text-white mb-8">{bannersData[0].subtitle}</p>
              <Link to="/products" className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">Shop Now</Link>
            </div>
          </div>
        </div>
      )}
      {categoriesData && categoriesData.length > 0 && (
        <section className="container py-12">
          <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesData.map((category) => (
              <Link key={category.id} to={`/products?category_id=${category.id}`} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">{category.name[0]}</span>
                </div>
                <h3 className="font-semibold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link to="/products?is_featured=true" className="flex items-center text-primary-600 hover:text-primary-700">View All <ChevronRight size={20} /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredLoading ? Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />) : featuredData?.products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
      <section className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">New Arrivals</h2>
          <Link to="/products" className="flex items-center text-primary-600 hover:text-primary-700">View All <ChevronRight size={20} /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newLoading ? Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />) : newData?.products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </div>
  )
}
