import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/storeContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";

const MyOrders = () => {
  const { url, token, setErrorMessage, t } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let active = true;
    const fetchOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.post(`${url}/api/order/userorders`, {}, { headers: { token } });
        if (!response.data.success) throw new Error(response.data.message || "Unable to load your orders");
        if (active) setOrders(response.data.data);
      } catch (error) {
        if (active) setErrorMessage(error.response?.data?.message || error.message || "Unable to load your orders");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchOrders();
    return () => { active = false; };
  }, [token, url, setErrorMessage, refresh]);

  return (
    <main className="my-orders page-shell">
      <div className="page-heading"><span className="section-kicker">{t("YOUR FOOD, ON ITS WAY")}</span><h1>{t("Order history")}<span>.</span></h1></div>
      <div className="container">
        {loading && <p>{t("Loading your orders…")}</p>}
        {!loading && orders.length === 0 && <div className="cart-empty"><span>✳</span><h2>{t("No orders yet.")}</h2><p>{t("Your next favorite meal is one click away.")}</p><a href="/#explore-menu">{t("Explore the menu")}</a></div>}
        {orders.map((order) => (
          <article key={order._id} className="my-orders-order">
            <img src={assets.parcel_icon} alt="" />
            <p>{order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}</p>
            <p>€{Number(order.amount).toFixed(2)}</p>
            <p>{t("Items:")} {order.items.reduce((total, item) => total + item.quantity, 0)}</p>
            <p><span>●</span> <b>{t(order.status)}</b></p>
            <button onClick={() => setRefresh((value) => value + 1)}>{t("Refresh status")}</button>
          </article>
        ))}
      </div>
    </main>
  );
};

export default MyOrders;
