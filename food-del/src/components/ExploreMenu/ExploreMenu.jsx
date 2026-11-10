import { menu_list } from '../../assets/frontend_assets/assets'
import { useContext } from 'react'
import { StoreContext } from '../../context/storeContext'

const ExploreMenu = ({category,setCategory}) => {
  const { t } = useContext(StoreContext)

  return (
    <div className='explore-menu' id='explore-menu'>
        <div><span className="section-kicker">{t("A LITTLE SOMETHING FOR EVERY MOOD")}</span><h1>{t("Explore the menu")}</h1></div>
        <p className='explore-menu-text'>{t("Choose from a diverse menu featuring a delectable array of dishes.")}</p>
        <div className="explore-menu-list">
            {menu_list.map((item,index) => {
                return(
                    <button type="button" aria-pressed={category === item.menu_name} onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} key={index} className='explore-menu-list-item'>
                        <img className={category===item.menu_name?"active":""} src={item.menu_image} alt="" />
                        <p>{t(item.menu_name)}</p>
                    </button>
                )
            })}
        </div>
        <hr />
    </div>
  )
}

export default ExploreMenu