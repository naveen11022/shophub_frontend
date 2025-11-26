export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-6 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="container py-8 animate-pulse">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="h-96 bg-gray-200 rounded-lg" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
}
