import { useContext } from 'react'
import { assets } from '../../assets/frontend_assets/assets'
import { Star } from 'lucide-react'
import { StoreContext } from '../../context/storeContext'



const FoodItem = ({ id, name, price, description, image, category }) => {

    const {cartItems, addToCart,removeFromCart, url, t} = useContext(StoreContext);


    return (
        
        <div className='food-item'>
            <div className="food-item-img-container">
                <img className='food-item-image' src={image?.startsWith("http") ? image : `${url}/images/${image}`} alt={name} loading="lazy" />
                <span className="food-item-category">{t(category)}</span>
                {!cartItems[id]
                    ?<button className='add' onClick={()=>addToCart(id)} aria-label={`${t("Add to cart")}: ${name}`}><img src={assets.add_icon_white} alt="" /></button>
                    :<div className='food-item-counter'>
                        <button onClick={()=>removeFromCart(id)} aria-label={`Remove one ${name}`}><img src={assets.remove_icon_red} alt="" /></button>
                        <p>{cartItems[id]}</p>
                        <button onClick={()=>addToCart(id)} aria-label={`Add one ${name}`}><img src={assets.add_icon_green} alt="" /></button>
                        </div>
                }
            </div>
            <div className="food-item-info">
                                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <div className="food-item-rating-stars">
                        <Star size={16} fill="#ff6347" color="#ff6347" />
                        <Star size={16} fill="#ff6347" color="#ff6347" />
                        <Star size={16} fill="#ff6347" color="#ff6347" />
                        <Star size={16} fill="#ff6347" color="#ff6347" />
                        <Star size={16} fill="#ff6347" color="#ff6347" />
                    </div>
                </div>

                <p className="food-item-description">{description || ""}</p>
                <p className="food-item-price">€{Number(price).toFixed(2)}</p>
            </div>


        </div>
    )
}

export default FoodItem