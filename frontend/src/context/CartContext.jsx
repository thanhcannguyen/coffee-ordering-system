
import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import {
    getCartApi,
    addToCartApi,
    updateCartItemApi,
    removeCartItemApi,
    clearCartApi,
} from '../api/cartApi'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const { user } = useAuth()
    const [cart, setCart] = useState(null)   // toàn bộ cart object
    const [loading, setLoading] = useState(false)

    // ----------------------------------------
    // Fetch cart khi user đăng nhập
    // Xóa cart khi user đăng xuất
    // ----------------------------------------
    useEffect(() => {
        if (user) {
            fetchCart()
        } else {
            setCart(null)
        }
    }, [user])

    const fetchCart = async () => {
        try {
            const res = await getCartApi()
            setCart(res.data.data)
        } catch (error) {
            console.error('Lỗi fetchCart:', error)
        }
    }

    // ----------------------------------------
    // Thêm vào giỏ
    // Trả về true/false để component biết kết quả
    // ----------------------------------------
    const addToCart = async (productId, quantity = 1) => {
        try {
            setLoading(true)
            const res = await addToCartApi(productId, quantity)
            setCart(res.data.data)
            return true
        } catch (error) {
            console.error('Lỗi addToCart:', error)
            return false
        } finally {
            setLoading(false)
        }
    }

    // ----------------------------------------
    // Cập nhật số lượng — quantity=0 thì service tự xóa item
    // ----------------------------------------
    const updateItem = async (productId, quantity) => {
        try {
            const res = await updateCartItemApi(productId, quantity)
            setCart(res.data.data)
        } catch (error) {
            console.error('Lỗi updateItem:', error)
        }
    }

    // ----------------------------------------
    // Xóa 1 item
    // ----------------------------------------
    const removeItem = async (productId) => {
        try {
            const res = await removeCartItemApi(productId)
            setCart(res.data.data)
        } catch (error) {
            console.error('Lỗi removeItem:', error)
        }
    }

    // ----------------------------------------
    // Xóa toàn bộ giỏ
    // ----------------------------------------
    const clearCart = async () => {
        try {
            await clearCartApi()
            setCart(prev => ({ ...prev, items: [], totalAmount: 0 }))
        } catch (error) {
            console.error('Lỗi clearCart:', error)
        }
    }

    // ----------------------------------------
    // Tổng số lượng sản phẩm — hiển thị trên badge Header
    // VD: 2 Latte + 3 Trà sữa = badge hiện 5
    // ----------------------------------------
    const cartCount = cart?.items?.reduce(
        (sum, item) => sum + item.quantity, 0
    ) ?? 0

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            cartCount,
            addToCart,
            updateItem,
            removeItem,
            clearCart,
            fetchCart,
        }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)