import { useContext } from 'react'
import { StoreContext } from '../../context/storeContext'

const AppDownload = () => {
  const { t } = useContext(StoreContext)
  return (
    <div className='app-download' id='appdownload'>
        <div><span className="section-kicker">{t("WHY GOOD FOOD FEELS DIFFERENT")}</span><h2>{t("A little more care.")}<br /><em>{t("A lot more flavor.")}</em></h2></div>
        <div className="app-download-points">
            <article><span>01</span><div><h3>{t("Made fresh")}</h3><p>{t("Every order starts with real ingredients and a little kitchen love.")}</p></div></article>
            <article><span>02</span><div><h3>{t("Delivered with care")}</h3><p>{t("Thoughtful packaging, reliable delivery, and food that arrives happy.")}</p></div></article>
            <article><span>03</span><div><h3>{t("Always worth it")}</h3><p>{t("Big flavor, fair prices, and something for every kind of craving.")}</p></div></article>
        </div>
    </div>

  )
}

export default AppDownload