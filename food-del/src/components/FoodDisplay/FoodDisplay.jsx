import { useContext } from 'react'
import { StoreContext } from '../../context/storeContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => {

  const { food_list, searchQuery, isLoadingMenu, t } = useContext(StoreContext)
  const visibleFoods = food_list.filter((item) => {
    const matchesCategory = category === "All" || category === item.category;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || `${item.name} ${item.description || ""} ${item.category} ${t(item.category)}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div className="food-display" id='food-display'>
        <div className="food-display-heading">
          <div><span className="section-kicker">{t("MADE FRESH, JUST FOR YOU")}</span><h2>{searchQuery ? `${t("Results for")} “${searchQuery}”` : t("Something delicious awaits.")}</h2></div>
          <p>{visibleFoods.length} {t(visibleFoods.length === 1 ? "dish" : "dishes")}</p>
        </div>
        <div className='food-display-list'>
          {isLoadingMenu && <div className="empty-menu"><span>✳</span><h3>{t("Freshness is loading")}</h3><p>{t("We’re setting the table.")}</p></div>}
          {!isLoadingMenu && visibleFoods.map((item) => (
            <FoodItem key={item._id} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} category={item.category} />
          ))}
          {!isLoadingMenu && visibleFoods.length === 0 && <div className="empty-menu"><span>⌕</span><h3>{t("No dishes found")}</h3><p>{t("Try another search or explore all our favorites.")}</p></div>}
        </div>
      </div>

    </div>
  )
}

export default FoodDisplay