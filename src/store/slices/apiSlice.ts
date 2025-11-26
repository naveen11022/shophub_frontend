import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Product, Category, Cart, Order, Review, Wishlist, Banner } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('access_token')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Products', 'Cart', 'Orders', 'Wishlist', 'Reviews', 'Categories', 'Banners'],
  endpoints: (builder) => ({
    getProducts: builder.query<{ products: Product[]; total: number }, any>({
      query: (params) => ({ url: '/api/products', params }),
      providesTags: ['Products'],
    }),
    getProduct: builder.query<Product, number>({
      query: (id) => `/api/products/${id}`,
      providesTags: ['Products'],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => '/api/categories',
      providesTags: ['Categories'],
    }),
    getCart: builder.query<Cart, void>({
      query: () => '/api/cart',
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<Cart, { product_id: number; quantity: number }>({
      query: (data) => ({ url: '/api/cart/items', method: 'POST', body: data }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<Cart, { id: number; quantity: number }>({
      query: ({ id, quantity }) => ({ url: `/api/cart/items/${id}`, method: 'PUT', body: { quantity } }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation<Cart, number>({
      query: (id) => ({ url: `/api/cart/items/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    createOrder: builder.mutation<Order, any>({
      query: (data) => ({ url: '/api/orders', method: 'POST', body: data }),
      invalidatesTags: ['Orders', 'Cart'],
    }),
    getOrders: builder.query<Order[], void>({
      query: () => '/api/orders',
      providesTags: ['Orders'],
    }),
    getWishlist: builder.query<Wishlist[], void>({
      query: () => '/api/wishlist',
      providesTags: ['Wishlist'],
    }),
    addToWishlist: builder.mutation<Wishlist, number>({
      query: (productId) => ({ url: `/api/wishlist/${productId}`, method: 'POST' }),
      invalidatesTags: ['Wishlist'],
    }),
    removeFromWishlist: builder.mutation<void, number>({
      query: (productId) => ({ url: `/api/wishlist/${productId}`, method: 'DELETE' }),
      invalidatesTags: ['Wishlist'],
    }),
    getProductReviews: builder.query<Review[], number>({
      query: (productId) => `/api/products/${productId}/reviews`,
      providesTags: ['Reviews'],
    }),
    createReview: builder.mutation<Review, any>({
      query: (data) => ({ url: '/api/reviews', method: 'POST', body: data }),
      invalidatesTags: ['Reviews', 'Products'],
    }),
    getBanners: builder.query<Banner[], void>({
      query: () => '/api/banners',
      providesTags: ['Banners'],
    }),
  }),
})

export const {
  useGetProductsQuery, useGetProductQuery, useGetCategoriesQuery, useGetCartQuery,
  useAddToCartMutation, useUpdateCartItemMutation, useRemoveFromCartMutation,
  useCreateOrderMutation, useGetOrdersQuery, useGetWishlistQuery, useAddToWishlistMutation,
  useRemoveFromWishlistMutation, useGetProductReviewsQuery, useCreateReviewMutation, useGetBannersQuery,
} = apiSlice
