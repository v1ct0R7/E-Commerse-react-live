import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { usePreferences } from "../../preferences";

const List = ({ url, token }) => {
  const { t } = usePreferences();

  const [list, setList] = useState([])
  const [refresh, setRefresh] = useState(0)

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId }, { headers: { token } })
      if (!response.data.success) throw new Error(response.data.message || "Unable to remove item");
      toast.success(response.data.message)
      setRefresh((current) => current + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to remove item")
    }
  }

  useEffect(() => {
    let active = true;
    axios.get(`${url}/api/food/list`)
      .then((response) => {
        if (!response.data.success) throw new Error(response.data.message || "Unable to load menu");
        if (active) setList(response.data.data);
      })
      .catch((error) => toast.error(error.response?.data?.message || error.message || "Unable to load menu"));
    return () => { active = false; };
  }, [url, refresh])

  return (
    <div className='list admin-page'>
      <div className="admin-page-heading"><span className="admin-eyebrow">{t("MENU MANAGEMENT")}</span><h1>{t("Your menu")}</h1><p>{t("Keep your lineup fresh and irresistible.")}</p></div>
      <p className="list-count">{list.length} {t("dishes")}</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>{t("Image")}</b>
          <b>{t("Name")}</b>
          <b>{t("Category")}</b>
          <b>{t("Price")}</b>
          <b>{t("Action")}</b>
        </div>
        {list.map((item) => {
          return (
            <div key={item._id} className='list-table-format'>
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{t(item.category)}</p>
              <p>€{Number(item.price).toFixed(2)}</p>
              <button onClick={() => removeFood(item._id)} className='cursor' aria-label={`${t("Remove")} ${item.name}`}>{t("Remove")}</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List