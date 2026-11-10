import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { StoreContext } from "../../context/storeContext";

const PlaceOrder = ({ setShowLogIn }) => {
  const { getTotalCartAmount, token, food_list, cartItems, url, setErrorMessage, deliveryFee, coupon, t } = useContext(StoreContext);
  const navigate = useNavigate();
  const subtotal = getTotalCartAmount();
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({
    firstName: "", lastname: "", email: "", street: "", city: "",
    state: "", zipcode: "", country: "", phone: "",
  });

  const onChangeHandler = (event) => {
    setData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    const items = food_list
      .filter((item) => Number(cartItems[item._id]) > 0)
      .map((item) => ({ _id: item._id, quantity: Number(cartItems[item._id]) }));

    try {
      const response = await axios.post(`${url}/api/order/place`, { address: data, items, couponCode: coupon?.code }, { headers: { token } });
      if (!response.data.success) throw new Error(response.data.message || "Unable to start checkout");
      window.location.assign(response.data.session_url);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || "Unable to start checkout");
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setShowLogIn(true);
      navigate("/cart");
    } else if (subtotal === 0) navigate("/cart");
  }, [token, subtotal, navigate, setShowLogIn]);

  const fields = [
    ["firstName", t("First name")], ["lastname", t("Last name")], ["email", t("Email address")],
    ["street", t("Street address")], ["city", t("City")], ["state", t("Region / state")],
    ["zipcode", t("Postal code")], ["country", t("Country")], ["phone", t("Phone number")],
  ];

  return (
    <form onSubmit={placeOrder} className="place-order page-shell">
      <div className="place-order-left">
        <span className="section-kicker">{t("ALMOST THERE")}</span>
        <h1>{t("Where should we deliver?")}</h1>
        <p>{t("Just the essentials. We’ll take it from here.")}</p>
        <div className="delivery-fields">
          {fields.map(([name, label]) => (
            <label key={name} className={name === "street" || name === "email" || name === "phone" ? "field-wide" : ""}>
              <span>{label}</span>
              <input
                required
                name={name}
                onChange={onChangeHandler}
                value={data[name]}
                type={name === "email" ? "email" : name === "phone" ? "tel" : "text"}
                autoComplete={name === "zipcode" ? "postal-code" : name}
              />
            </label>
          ))}
        </div>
      </div>
      <aside className="cart-total checkout-summary">
        <span className="section-kicker">{t("THE TOTAL")}</span>
        <h2>{t("Order summary")}</h2>
        <div className="cart-total-details"><p>{t("Subtotal")}</p><p>€{subtotal.toFixed(2)}</p></div>
        <div className="cart-total-details"><p>{t("Delivery")}</p><p>€{deliveryFee.toFixed(2)}</p></div>
        {coupon && <div className="cart-total-details coupon-savings"><p>{coupon.code} · {coupon.discountPercent}% {t("off")}</p><p>−€{(Math.round((subtotal + deliveryFee) * coupon.discountPercent) / 100).toFixed(2)}</p></div>}
        <div className="cart-total-details total"><p>{t("Total")}</p><p>€{(subtotal + deliveryFee - (coupon ? Math.round((subtotal + deliveryFee) * coupon.discountPercent) / 100 : 0)).toFixed(2)}</p></div>
        <p className="secure-note">{t("Secure checkout powered by Stripe")}</p>
        <button disabled={submitting} type="submit">{submitting ? t("Connecting to checkout…") : t("Continue to secure payment")} <ArrowRight size={17} /></button>
      </aside>
    </form>
  );
};

export default PlaceOrder;
