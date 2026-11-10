import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { StoreContext } from "./storeContext";
import { translate } from "../i18n";

const StoreContextProvider = ({ children }) => {
    const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");
    const [food_list, setFoodList] = useState([]);
    const [isLoadingMenu, setIsLoadingMenu] = useState(true);
    const [deliveryFee, setDeliveryFee] = useState(2);
    const [coupon, setCoupon] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [theme, setTheme] = useState(() => localStorage.getItem("food-studio-theme") === "light" ? "light" : "dark");
    const [language, setLanguage] = useState(() => localStorage.getItem("food-studio-language") === "en" ? "en" : "sq");
    const anonymousCart = useRef({});

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("food-studio-theme", theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.lang = language;
        localStorage.setItem("food-studio-language", language);
    }, [language]);

    useEffect(() => {
        if (!token) anonymousCart.current = cartItems;
    }, [cartItems, token]);

    useEffect(() => {
        axios.get(`${url}/api/food/list`)
            .then((response) => {
                if (!response.data.success) throw new Error(response.data.message || "Unable to load menu");
                setFoodList(response.data.data);
            })
            .catch((error) => setErrorMessage(error.response?.data?.message || error.message || "Unable to connect to menu"))
            .finally(() => setIsLoadingMenu(false));
    }, [url]);

    useEffect(() => {
        axios.get(`${url}/api/settings/public`)
            .then((response) => {
                if (!response.data.success) throw new Error(response.data.message || "Unable to load store settings");
                setDeliveryFee(Number(response.data.data.deliveryFee));
            })
            .catch((error) => setErrorMessage(error.response?.data?.message || error.message || "Unable to load store settings"));
    }, [url]);

    useEffect(() => {
        if (!token) return;
        const guestCart = anonymousCart.current;
        axios.post(`${url}/api/cart/get`, {}, { headers: { token } })
            .then(async (response) => {
                if (!response.data.success) throw new Error(response.data.message || "Unable to load cart");
                const savedCart = response.data.cartData || response.data.cadData || {};
                if (Object.keys(guestCart).length === 0) {
                    setCartItems(savedCart);
                    return;
                }
                const mergedCart = { ...savedCart };
                Object.entries(guestCart).forEach(([id, quantity]) => {
                    mergedCart[id] = Math.min(99, Number(mergedCart[id] || 0) + Number(quantity));
                });
                const syncResponse = await axios.post(`${url}/api/cart/sync`, { cartData: mergedCart }, { headers: { token } });
                if (!syncResponse.data.success) throw new Error(syncResponse.data.message || "Unable to sync cart");
                setCartItems(syncResponse.data.cartData);
                anonymousCart.current = {};
            })
            .catch((error) => {
                setErrorMessage(error.response?.data?.message || error.message || "Unable to load cart");
                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    setToken("");
                }
            });
    }, [token, url]);

    const changeCart = async (itemId, change) => {
        setErrorMessage("");
        if (token) {
            try {
                const response = await axios.post(
                    `${url}/api/cart/${change > 0 ? "add" : "remove"}`,
                    { itemId },
                    { headers: { token } }
                );
                if (!response.data.success) throw new Error(response.data.message || "Unable to update cart");
                setCartItems(response.data.cartData || {});
            } catch (error) {
                setErrorMessage(error.response?.data?.message || error.message || "Unable to update cart");
            }
            return;
        }

        setCartItems((previous) => {
            const quantity = Math.max(0, Number(previous[itemId] || 0) + change);
            if (quantity === 0) {
                const updated = { ...previous };
                delete updated[itemId];
                return updated;
            }
            return { ...previous, [itemId]: quantity };
        });
    };

    const addToCart = (itemId) => changeCart(itemId, 1);
    const removeFromCart = (itemId) => changeCart(itemId, -1);
    const getTotalCartAmount = () => food_list.reduce((total, product) => (
        total + product.price * Number(cartItems[product._id] || 0)
    ), 0);

    return (
        <StoreContext.Provider value={{
            food_list, isLoadingMenu, cartItems, setCartItems, addToCart, removeFromCart,
            getTotalCartAmount, url, token, setToken, searchQuery, setSearchQuery,
            deliveryFee, coupon, setCoupon,
            errorMessage, setErrorMessage,
            theme, setTheme, language, setLanguage,
            t: (text) => translate(text, language),
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
