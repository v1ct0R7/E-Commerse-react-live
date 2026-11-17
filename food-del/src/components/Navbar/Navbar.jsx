import { useContext, useEffect, useRef, useState } from 'react'
import { assets } from '../../assets/frontend_assets/assets'
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from '../../context/storeContext';
import { Search, ShoppingBag, Sun, Moon, UserRound, ClipboardList, LogOut, ChevronDown } from "lucide-react";


// Krijojn navbar dhe e importojm ne app.jsx
const Navbar = ({ setShowLogIn }) => {

  const [menu, setMenu] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const { getTotalCartAmount, token, setToken, setCartItems, setCoupon, searchQuery, setSearchQuery, theme, setTheme, language, setLanguage, t } = useContext(StoreContext)

  const navigate = useNavigate()
  useEffect(() => {
    if (!profileOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!profileRef.current?.contains(event.target)) setProfileOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setProfileOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [profileOpen]);

  const logout = () =>{
    localStorage.removeItem("token")
    localStorage.removeItem("guestCart")
    setCartItems({});
    setCoupon(null);
    setToken("");
    setSearchQuery("");
    setProfileOpen(false);
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
        {!token ? <button onClick={() => setShowLogIn(true)}>{t("Sign in")}</button>
          : <div className="navbar-profile" ref={profileRef}>
            <button
              className="navbar-profile-trigger"
              type="button"
              aria-label={t("Account menu")}
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              onClick={() => setProfileOpen((open) => !open)}
            >
              <UserRound size={19} aria-hidden="true" />
              <ChevronDown size={14} aria-hidden="true" />
            </button>
            {profileOpen && (
              <ul className="nav-profile-dropdown" role="menu">
                <li role="none">
                  <Link role="menuitem" to="/myorders" onClick={() => setProfileOpen(false)}>
                    <ClipboardList size={17} aria-hidden="true" />
                    <span>{t("Orders")}</span>
                  </Link>
                </li>
                <li className="nav-profile-divider" role="separator" />
                <li role="none">
                  <button type="button" role="menuitem" onClick={logout}>
                    <LogOut size={17} aria-hidden="true" />
                    <span>{t("Logout")}</span>
                  </button>
                </li>
              </ul>
            )}
          </div>
        }
      </div>
    </div>
  )
}

export default Navbar;