import { useContext, useState } from "react";
import { StoreContext } from "../../context/storeContext";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Trash2 } from "lucide-react";
import axios from "axios";

const Cart = ({ setShowLogIn }) => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, deliveryFee, coupon, setCoupon, token, t } = useContext(StoreContext);
  const navigate = useNavigate();
  const subtotal = getTotalCartAmount();
  const items = food_list.filter((item) => Number(cartItems[item._id]) > 0);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const discount = coupon ? Math.round((subtotal + deliveryFee) * coupon.discountPercent) / 100 : 0;
  const applyCoupon = async (event) => {
    event.preventDefault();
    setCouponLoading(true);
    setCouponMessage("");
    try {
      const response = await axios.post(`${url}/api/coupon/validate`, { code: couponCode });
      if (!response.data.success) throw new Error(response.data.message || "Coupon could not be applied");
      setCoupon(response.data.data);
      setCouponCode(response.data.data.code);
      setCouponMessage(`${response.data.data.discountPercent}% ${t("discount applied")}`);
    } catch (error) {
      setCoupon(null);
      setCouponMessage(error.response?.data?.message || error.message || "Coupon could not be applied");
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <div className="cart page-shell">
      <div className="page-heading">
        <span className="section-kicker">{t("YOUR ORDER, YOUR WAY")}</span>
        <h1>{t("Your cart")}<span>.</span></h1>
        <p>{t("Review your picks before we get cooking.")}</p>
      </div>
      {items.length ? (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <article key={item._id} className="cart-row">
                <img src={item.image?.startsWith("http") ? item.image : `${url}/images/${item.image}`} alt={item.name} />
                <div className="cart-row-info"><h3>{item.name}</h3><p>€{Number(item.price).toFixed(2)} {t("each")}</p></div>
                <span className="cart-row-quantity">× {cartItems[item._id]}</span>
                <strong>€{(item.price * cartItems[item._id]).toFixed(2)}</strong>
                <button onClick={() => removeFromCart(item._id)} className="cross" aria-label={`Remove ${item.name}`}><Trash2 size={17} /></button>
              </article>
            ))}
          </div>
          <aside className="cart-total">
            <span className="section-kicker">{t("THE TOTAL")}</span>
            <h2>{t("Order summary")}</h2>
            <div className="cart-total-details"><p>{t("Subtotal")}</p><p>€{subtotal.toFixed(2)}</p></div>
            <div className="cart-total-details"><p>{t("Delivery")}</p><p>€{deliveryFee.toFixed(2)}</p></div>
            {coupon && <div className="cart-total-details coupon-savings"><p>{coupon.code} · {coupon.discountPercent}% {t("off")}</p><p>−€{discount.toFixed(2)}</p></div>}
            <div className="cart-total-details total"><p>{t("Total")}</p><p>€{(subtotal + deliveryFee - discount).toFixed(2)}</p></div>
            <form className="cart-coupon" onSubmit={applyCoupon}>
              <label htmlFor="coupon-code">{t("Have a coupon?")}</label>
              <div><input id="coupon-code" value={couponCode} onChange={(event) => { setCouponCode(event.target.value.toUpperCase()); setCoupon(null); setCouponMessage(""); }} placeholder={t("Enter code")} required /><button type="submit" disabled={couponLoading}>{couponLoading ? "…" : t("Apply")}</button></div>
              {couponMessage && <p role="status" className={coupon ? "success" : ""}>{couponMessage}</p>}
              {coupon && <button className="remove-coupon" type="button" onClick={() => { setCoupon(null); setCouponCode(""); setCouponMessage(""); }}>{t("Remove coupon")}</button>}
            </form>
            <button onClick={() => token ? navigate("/order") : setShowLogIn(true)}>{token ? t("Continue to checkout") : t("Sign in to checkout")} <ArrowRight size={17} /></button>
            <Link to="/#explore-menu">← {t("Keep exploring")}</Link>
          </aside>
        </div>
      ) : (
        <div className="cart-empty"><span>✳</span><h2>{t("Your cart is taking a break.")}</h2><p>{t("Find something delicious and make its day.")}</p><Link to="/#explore-menu">{t("Explore the menu")} <ArrowRight size={17} /></Link></div>
      )}
    </div>
  );
};

export default Cart;
