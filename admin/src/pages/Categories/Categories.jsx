import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { usePreferences } from "../../preferences";

const Categories = ({ url }) => {
  const { t } = usePreferences();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios.get(`${url}/api/food/list`)
      .then((response) => {
        if (!response.data.success) throw new Error(response.data.message || "Unable to load categories");
        const counts = response.data.data.reduce((result, item) => {
          result[item.category] = (result[item.category] || 0) + 1;
          return result;
        }, {});
        setCategories(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
      })
      .catch((error) => toast.error(error.response?.data?.message || error.message || "Unable to load categories"));
  }, [url]);

  return (
    <section className="admin-page">
      <div className="admin-page-heading"><span className="admin-eyebrow">{t("MENU ORGANIZATION")}</span><h1>{t("Categories")}</h1><p>{t("See how your menu is organized at a glance.")}</p></div>
      {categories.length ? <div className="category-grid">{categories.map(([name, count], index) => <article key={name}><span className="category-index">0{index + 1}</span><div><h2>{t(name)}</h2><p>{count} {t(count === 1 ? "dish" : "dishes")}</p></div><span className="category-arrow">↗</span></article>)}</div> : <div className="admin-empty">{t("Add menu items to see your categories here.")}</div>}
    </section>
  );
};

export default Categories;
