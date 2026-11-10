import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { usePreferences } from "../../preferences";

const Dashboard = ({ url, token }) => {
  const { t } = usePreferences();
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    Promise.all([
      axios.get(`${url}/api/order/list`, { headers: { token } }),
      axios.get(`${url}/api/food/list`),
      axios.get(`${url}/api/user/list`, { headers: { token } }),
    ]).then(([ordersResponse, foodsResponse, customersResponse]) => {
      if (!ordersResponse.data.success || !foodsResponse.data.success || !customersResponse.data.success) throw new Error("Unable to load dashboard data");
      setOrders(ordersResponse.data.data);
      setFoods(foodsResponse.data.data);
      setCustomerCount(customersResponse.data.data.length);
    }).catch((error) => toast.error(error.response?.data?.message || error.message || "Unable to load dashboard"));
  }, [url, token]);

  const paidOrders = orders.filter((order) => order.payment);
  const revenue = paidOrders.reduce((sum, order) => sum + Number(order.amount), 0);
  const activeOrders = orders.filter((order) => order.payment && order.status !== "Delivered");
  const recentOrders = orders.slice(0, 5);
  const metrics = [
    [t("Total revenue"), `€${revenue.toFixed(2)}`, "↗", t("From paid orders")],
    [t("Orders"), orders.length, "▣", `${activeOrders.length} ${t("need attention")}`],
    [t("Menu items"), foods.length, "☷", t("Across your menu")],
    [t("Customers"), customerCount, "♙", t("Registered accounts")],
  ];

  return (
    <section className="admin-page dashboard">
      <div className="admin-page-heading"><span className="admin-eyebrow">{t("YOUR RESTAURANT AT A GLANCE")}</span><h1>{t("Good afternoon.")}</h1><p>{t("Here’s what’s happening across your store.")}</p></div>
      <div className="dashboard-metrics">
        {metrics.map(([label, value, icon, note]) => <article key={label} className="metric-card"><div><span>{label}</span><b aria-hidden="true">{icon}</b></div><strong>{value}</strong><small>{note}</small></article>)}
      </div>
      <div className="dashboard-section-heading"><div><span className="admin-eyebrow">{t("THE LATEST")}</span><h2>{t("Recent orders")}</h2></div><a href="/orders">{t("View all orders ↗")}</a></div>
      {recentOrders.length === 0 ? <div className="admin-empty">{t("No orders yet. Your first order will show up here.")}</div> : (
        <div className="dashboard-orders">
          {recentOrders.map((order) => <article key={order._id}><div className="order-avatar">{order.address?.firstName?.[0] || "F"}</div><div><strong>{order.address?.firstName} {order.address?.lastname}</strong><small>{order.items.map((item) => item.name).join(", ")}</small></div><span>{order.payment ? t(order.status) : t("Awaiting payment")}</span><b>€{Number(order.amount).toFixed(2)}</b></article>)}
        </div>
      )}
    </section>
  );
};

export default Dashboard;
