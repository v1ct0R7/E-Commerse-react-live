import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { usePreferences } from "../../preferences";

const Settings = ({ url, token }) => {
  const { t } = usePreferences();
  const [deliveryFee, setDeliveryFee] = useState("2.00");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    axios.get(`${url}/api/settings/`, { headers: { token } })
      .then((response) => {
        if (!response.data.success) throw new Error(response.data.message || "Unable to load settings");
        if (active) setDeliveryFee(Number(response.data.data.deliveryFee).toFixed(2));
      })
      .catch((error) => toast.error(error.response?.data?.message || error.message || "Unable to load settings"))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [url, token]);

  const save = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.patch(`${url}/api/settings/`, { deliveryFee }, { headers: { token } });
      if (!response.data.success) throw new Error(response.data.message || "Unable to save settings");
      toast.success(response.data.message);
      setDeliveryFee(Number(response.data.data.deliveryFee).toFixed(2));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to save settings");
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page-heading"><span className="admin-eyebrow">{t("YOUR RESTAURANT")}</span><h1>{t("Settings")}</h1><p>{t("Small details that make the whole experience feel right.")}</p></div>
      <form className="settings-form" onSubmit={save}>
        <div><h2>{t("Delivery fee")}</h2><p>{t("Applied to every checkout. Customers see this before paying.")}</p></div>
        <label><span>{t("Amount (EUR)")}</span><input aria-label={t("Amount (EUR)")} type="number" min="0" max="100" step="0.01" required value={deliveryFee} onChange={(event) => setDeliveryFee(event.target.value)} /></label>
        <button disabled={loading} type="submit">{t("Save changes")}</button>
      </form>
      <p className="settings-note">{t("Prices and payments are processed in EUR. Payment credentials and permitted frontend domains are configured in the backend environment file.")}</p>
    </section>
  );
};

export default Settings;
