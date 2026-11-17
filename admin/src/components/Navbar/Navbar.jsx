import { Link } from "react-router";
import { assets } from '../../admin_assets/assets'
import PreferenceControls from "../PreferenceControls";
import { usePreferences } from "../../preferences";

const Navbar = ({ adminName, onLogout, theme, setTheme, language, setLanguage }) => {
    const { t } = usePreferences();
    return (
        <>
            <div className='navbar'>
                <Link className="admin-brand" to="/">food<span>•</span>studio <small>ADMIN</small></Link>
                <div className="admin-navbar-right">
                    <PreferenceControls theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} />
                    <span>{t("Welcome,")} {adminName}</span>
                    <img className='profile' src={assets.profile_image} alt="" />
                    <button onClick={onLogout}>{t("Sign out")}</button>
                </div>
            </div>
        </>

    )
}

export default Navbar