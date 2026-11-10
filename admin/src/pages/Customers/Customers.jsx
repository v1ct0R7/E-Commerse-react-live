import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { usePreferences } from "../../preferences";

const Customers = ({ url, token }) => {
  const { t } = usePreferences();
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");
  useEffect(() => {
    axios.get(`${url}/api/user/list`, { headers: { token } })
      .then((response) => {
        if (!response.data.success) throw new Error(response.data.message || "Unable to load customers");
        setCustomers(response.data.data);
      })
      .catch((error) => toast.error(error.response?.data?.message || error.message || "Unable to load customers"));
  }, [url, token]);

  const filtered = customers.filter((customer) => `${customer.name} ${customer.email}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <section className="admin-page">
      <div className="admin-page-heading"><span className="admin-eyebrow">{t("YOUR COMMUNITY")}</span><h1>{t("Customers")}</h1><p>{t("People who have signed up for a taste of the good stuff.")}</p></div>
      <label className="admin-search"><span>⌕</span><input aria-label={t("Search customers by name or email")} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("Search customers by name or email")} /></label>
      <div className="customer-list">
        {filtered.map((customer) => <article key={customer._id}><span className="customer-avatar">{customer.name?.[0]?.toUpperCase() || "C"}</span><div><strong>{customer.name}</strong><small>{customer.email}</small></div><span className="customer-role">{customer.role}</span></article>)}
        {!filtered.length && <div className="admin-empty">{t(query ? "No customers match that search." : "No customers yet.")}</div>}
      </div>
    </section>
  );
};

export default Customers;
