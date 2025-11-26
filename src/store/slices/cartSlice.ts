import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Cart } from '@/types'

interface CartState {
  cart: Cart | null
  itemCount: number
}

const initialState: CartState = {
  cart: null,
  itemCount: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload
      state.itemCount = action.payload.items.reduce((sum, item) => sum + item.quantity, 0)
    },
    clearCart: (state) => {
      state.cart = null
      state.itemCount = 0
    },
  },
})

export const { setCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
