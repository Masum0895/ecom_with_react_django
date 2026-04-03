import { createContext, useContext, useState, useEffect } from "react";
import { authFetch, getAccessToken } from "../utils/auth";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);


    //Fetch Cart form BE

    const fetchCart = async () => {
        const token = getAccessToken();
        if (!token) {
            setCartItems([]);
            setTotal(0);
            return;
        }

        try {
            const response = await authFetch(`${BASEURL}/api/cart/`);
            if (response.ok) {
                const data = await response.json();
                setCartItems(data.items || []);
                setTotal(data.total || 0);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    }

    // Load cart when user is authenticated
    useEffect(() => {
        fetchCart();
    }, []);

    //Add Product to Cart
    const addToCart = async (productId) => {
        const token = getAccessToken();
        if (!token) {
            window.location.href = '/login';
            return;
        }

        setLoading(true);
        try {
            const response = await authFetch(`${BASEURL}/api/cart/add/`, {
                method: "POST",
                body: JSON.stringify({ product_id: productId }),
            });

            if (response.ok) {
                await fetchCart(); // Refresh cart after adding
                return true;
            } else {
                const error = await response.json();
                console.error("Error adding to cart:", error);
                return false;
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            return false;
        } finally {
            setLoading(false);
        }
    }

    //Remove Product from Cart
    const removeFromCart = async (itemId) => {
        const token = getAccessToken();
        if (!token) return;

        try {
            const response = await authFetch(`${BASEURL}/api/cart/remove/`, {
                method: "POST",
                body: JSON.stringify({ item_id: itemId }),
            });

            if (response.ok) {
                await fetchCart();
            }
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    }

    //Update Quantity
    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) {
            await removeFromCart(itemId);
            return;
        }
        
        try {
            const response = await authFetch(`${BASEURL}/api/cart/update/`, {
                method: "POST",
                body: JSON.stringify({ item_id: itemId, quantity: quantity }),
            });

            if (response.ok) {
                await fetchCart();
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    }

    // Clear Cart context
    const clearCart = () => {
        setCartItems([]);
        setTotal(0);
    }

    return (
        <CartContext.Provider
        value={{ cartItems,total, loading, addToCart, removeFromCart, updateQuantity, clearCart, fetchCart}}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);