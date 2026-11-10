import { useContext } from 'react'
import { ArrowRight, Search } from "lucide-react";
import { StoreContext } from "../../context/storeContext";

const Header = () => {
  const { searchQuery, setSearchQuery, t } = useContext(StoreContext);

  const exploreMenu = (event) => {
    event.preventDefault();
    document.getElementById("food-display")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className='header'>
        <div className="header-contents">
            <span className="hero-kicker"><span /> {t("GOOD FOOD, GOOD MOOD")}</span>
            <h2>{t("Real food.")}<br /><em>{t("Real good.")}</em></h2>
            <p>{t("Freshly made favorites, delivered to your door. Your next great meal is just a few taps away.")}</p>
            <form className="hero-search" onSubmit={exploreMenu}>
              <Search size={20} aria-hidden="true" />
              <input
                aria-label={t("Search dishes")}
                placeholder={t("What are you craving today?")}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <button aria-label={t("Find dishes")} type="submit"><ArrowRight size={19} /></button>
            </form>
            <div className="hero-note"><span>✦</span> {t("Good ingredients. No compromises.")}</div>
        </div>
        
    </div>
  )
}

export default Header