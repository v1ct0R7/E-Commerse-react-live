import { NavLink } from 'react-router'
import { usePreferences } from "../../preferences";

const Sidebar = () => {
  const { t } = usePreferences();
  const links = [
    { to: "/", label: "Overview", icon: "◈", end: true },
    { to: "/orders", label: "Orders", icon: "▣" },
    { to: "/list", label: "Menu items", icon: "☷" },
    { to: "/categories", label: "Categories", icon: "⊞" },
    { to: "/customers", label: "Customers", icon: "♙" },
    { to: "/coupons", label: "Coupons", icon: "%" },
    { to: "/settings", label: "Settings", icon: "⚙" },
    { to: "/add", label: "Add a dish", icon: "＋" },
  ];
  return (
    <div className='sidebar'>
      <p className="sidebar-label">{t("WORKSPACE")}</p>
      <div className="sidebar-options">
        {links.map(({ to, label, icon, end }) => (
          <NavLink key={to} to={to} end={end} className="sidebar-option">
            <span aria-hidden="true">{icon}</span>
            <span>{t(label)}</span>
          </NavLink>
        ))}
      </div>
      <div className="sidebar-note"><span>✦</span><p>{t("Good food starts here.")}</p><small>{t("Make someone's day.")}</small></div>
    </div>
  )
}

export default Sidebar