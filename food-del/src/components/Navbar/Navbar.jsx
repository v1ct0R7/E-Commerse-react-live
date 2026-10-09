import React, { useState } from 'react'
import './Navbar.css'
import {assets} from '../../assets/frontend_assets/assets'

// Krijojn navbar dhe e importojm ne app.jsx
const Navbar = () => {

    const [menu,setMenu] = useState("");

  return (
    <div className='navbar'>
      <img src={assets.logo} alt="" className='logo'/>
      <ul className="navbar-menu">
        <li onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>home</li>
        <li onClick={()=>setMenu("menu")} className={menu==="menu"?"active":""}>menu</li>
        <li onClick={()=>setMenu("mobile-app")} className={menu==="mobile-app"?"active":""}>mobile-app</li>
        <li onClick={()=>setMenu("contact-us")} className={menu==="contact-us"?"active":""}>contact us</li>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" className='shopping'/>
        <div className="navbar-search-icon">
          <img src={assets.basket_icon} alt="" className='searching'/>
          <div className="dot">
          </div>
        </div>
        <button>Sign in</button>
      </div>
    </div>
  )
}

export default Navbar;