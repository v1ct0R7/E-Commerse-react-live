import { useContext } from 'react'
import { assets } from '../../assets/frontend_assets/assets'
import { StoreContext } from '../../context/storeContext'

const Footer = () => {
    const { t } = useContext(StoreContext)
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo} alt="" />
                    <p>{t("Good ingredients, honest cooking, and the kind of meals that make an ordinary day feel a little special.")}</p>
                </div>
                <div className="footer-content-center">
                    <h2>{t("Explore")}</h2>
                    <ul>
                    <li><a href="/">{t("Home")}</a></li>
                    <li><a href="/#explore-menu">{t("Our menu")}</a></li>
                    <li><a href="/#appdownload">{t("Our story")}</a></li>
                    <li><a href="/#footer">{t("Contact")}</a></li>
                    </ul>

                </div>
                <div className="footer-content-right">
                    <h2>{t("Say hello")}</h2>
                    <ul>
                        <li>{t("Need an update?")}</li>
                        <li><a href="/myorders">{t("Track your order")}</a></li>
                    </ul>

                </div>
            </div>
            <hr />
            <p className="footer-copyright">© {new Date().getFullYear()} Food Studio. {t("Made with a little extra care.")}</p>
        </div>
    )
}

export default Footer