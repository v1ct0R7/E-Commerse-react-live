import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { usePreferences } from "../../preferences";

const Coupons = ({ url, token }) => {
  const { t, language } = usePreferences();
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("10");
  const [expiresAt, setExpiresAt] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let active = true;
    axios.get(`${url}/api/coupon/list`, { headers: { token } })
      .then((response) => {
        if (!response.data.success) throw new Error(response.data.message || "Unable to load coupons");
        if (active) setCoupons(response.data.data);
      })
      .catch((error) => toast.error(error.response?.data?.message || error.message || "Unable to load coupons"));
    return () => { active = false; };
  }, [url, token, refresh]);

  const addCoupon = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${url}/api/coupon/add`, { code, discountPercent, expiresAt: expiresAt || undefined }, { headers: { token } });
      if (!response.data.success) throw new Error(response.data.message || "Unable to create coupon");
      toast.success(response.data.message);
      setCode("");
      setExpiresAt("");
      setRefresh((value) => value + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to create coupon");
    }
  };

  const removeCoupon = async (id) => {
    try {
      const response = await axios.post(`${url}/api/coupon/remove`, { id }, { headers: { token } });
      if (!response.data.success) throw new Error(response.data.message || "Unable to remove coupon");
      toast.success(response.data.message);
      setRefresh((value) => value + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to remove coupon");
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page-heading"><span className="admin-eyebrow">{t("LITTLE EXTRAS")}</span><h1>{t("Coupons")}</h1><p>{t("Create a reason for someone to order their next favorite.")}</p></div>
      <form className="coupon-form" onSubmit={addCoupon}>
        <label>{t("Coupon code")}<input aria-label={t("Coupon code")} required minLength="3" maxLength="32" pattern="[A-Za-z0-9_-]+" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="e.g. GOODFOOD" /></label>
        <label>{t("Discount %")}<input aria-label={t("Discount %")} required type="number" min="1" max="90" step="1" value={discountPercent} onChange={(event) => setDiscountPercent(event.target.value)} /></label>
        <label>{t("Expires (optional)")}<input aria-label={t("Expires (optional)")} type="date" min={new Date().toISOString().slice(0, 10)} value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} /></label>
        <button type="submit">{t("Create coupon")}</button>
      </form>
      <div className="coupon-list">
        {coupons.map((coupon) => <article key={coupon._id}><div><strong>{coupon.code}</strong><small>{coupon.expiresAt ? `${t("Expires")} ${new Date(coupon.expiresAt).toLocaleDateString(language)}` : t("No expiry")} · {t(coupon.active ? "Active" : "Inactive")}</small></div><span>{coupon.discountPercent}% {t("off")}</span><button onClick={() => removeCoupon(coupon._id)}>{t("Remove")}</button></article>)}
        {!coupons.length && <div className="admin-empty">{t("No coupons yet. Make a little deal?")}</div>}
      </div>
    </section>
  );
};

export default Coupons;
