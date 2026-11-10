import { useState } from 'react'
import { toast } from "react-toastify"
import { useEffect } from 'react'
import axios from 'axios'
import { assets } from '../../admin_assets/assets'
import { usePreferences } from "../../preferences";


const Orders = ({ url, token }) => {
  const { t } = usePreferences();

  const [orders, setOrders] = useState([])
  const [refresh, setRefresh] = useState(0)

  const statusHandler = async (event,orderId) => {
    try {
      const response = await axios.post(url+"/api/order/status",{
        orderId,
        status:event.target.value
      }, { headers: { token } })
      if (!response.data.success) throw new Error(response.data.message || "Unable to update order");
      setRefresh((current) => current + 1);
      toast.success("Order status updated")
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to update order")
    }
  }


  useEffect(() => {
    let active = true;
    axios.get(`${url}/api/order/list`, { headers: { token } })
      .then((response) => {
        if (!response.data.success) throw new Error(response.data.message || "Unable to load orders");
        if (active) setOrders(response.data.data);
      })
      .catch((error) => toast.error(error.response?.data?.message || error.message || "Unable to load orders"));
    return () => { active = false; };
  }, [url, token, refresh])


  return (
    <div className='order admin-page'>
      <div className="admin-page-heading"><span className="admin-eyebrow">{t("FULFILLMENT")}</span><h1>{t("Orders")}</h1><p>{t("Keep every meal moving from kitchen to doorstep.")}</p></div>
      <p className="list-count">{orders.length} {t("orders")}</p>
      <div className="order-list">
        {orders.map((order) => (
          <div key={order._id} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}
              </p>
              <p className='order-item-name'>{order.address?.firstName} {order.address?.lastname}</p>
              <div className="order-item-address">
                <p>{order.address?.street},</p>
                <p>{order.address?.city}, {order.address?.state}, {order.address?.country}, {order.address?.zipcode}</p>
              </div>
              <p className='order-item-phone'> {order.address?.phone} </p>
            </div>
            <p>{t("Items:")} {order.items.reduce((total, item) => total + item.quantity, 0)}</p>
            <p>€{Number(order.amount).toFixed(2)}</p>
            <select aria-label="Order status" disabled={!order.payment} onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
              {!order.payment && <option value="Awaiting payment">{t("Awaiting payment")}</option>}
              <option value="Food Processing">{t("Food Processing")}</option>
              <option value="Out for delivery">{t("Out for delivery")}</option>
              <option value="Delivered">{t("Delivered")}</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders