import { useContext, useState } from 'react'
import { assets } from '../../assets/frontend_assets/assets'
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from '../../context/storeContext';
import { Search, ShoppingBag, Sun, Moon } from "lucide-react";


// Krijojn navbar dhe e importojm ne app.jsx
const Navbar = ({ setShowLogIn }) => {

  const [menu, setMenu] = useState("");

  const { getTotalCartAmount, token, setToken, setCartItems, setCoupon, searchQuery, setSearchQuery, theme, setTheme, language, setLanguage, t } = useContext(StoreContext)

  const navigate = useNavigate()
  const logout = () =>{
    localStorage.removeItem("token")
    setCartItems({});
    setCoupon(null);
    setToken("");
    setSearchQuery("");
    navigate("/")
  }

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="" className='logo' /></Link>
      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>{t("Home")}</Link>
        <a href='/#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>{t("Menu")}</a>
        <a href='/#appdownload' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>{t("Our story")}</a>
        <a href='/#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>{t("Contact")}</a>
      </ul>
      <div className="navbar-right">
        <button className="preference-theme" type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={t(theme === "dark" ? "Light theme" : "Dark theme")} title={t(theme === "dark" ? "Light theme" : "Dark theme")}>
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <label className="language-picker">
          <span className="sr-only">{t("Language")}</span>
          <select aria-label={t("Language")} value={language} onChange={(event) => setLanguage(event.target.value)}>
            <option value="sq">SQ</option>
            <option value="en">EN</option>
          </select>
        </label>
        <label className="navbar-search">
          <Search size={18} aria-hidden="true" />
          <input
            aria-label={t("Search dishes")}
            placeholder={t("Search dishes")}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
        <div className="navbar-search-icon">
          <Link to='/cart' aria-label={t("Open cart")}><ShoppingBag size={21} /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}>
          </div>
        </div>
        {!token?<button onClick={() => setShowLogIn(true)}>{t("Sign in")}</button>
          : <div className='navbar-profile'>
            <img src={assets.profile_icon} alt={t("Orders")} />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>{t("Orders")}</p></li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>{t("Logout")}</p></li>
            </ul>
          </div>
        }
      </div>
    </div>
  )
}

export default Navbar;