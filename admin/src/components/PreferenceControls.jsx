import { usePreferences } from "../preferences";

const PreferenceControls = ({ theme, setTheme, language, setLanguage }) => {
  const { t } = usePreferences();
  return (
    <div className="admin-preferences">
      <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={t(theme === "dark" ? "Light theme" : "Dark theme")} title={t(theme === "dark" ? "Light theme" : "Dark theme")}>
        <span aria-hidden="true">{theme === "dark" ? "☼" : "◐"}</span>
      </button>
      <label>
        <span className="sr-only">{t("Language")}</span>
        <select aria-label={t("Language")} value={language} onChange={(event) => setLanguage(event.target.value)}>
          <option value="sq">SQ</option>
          <option value="en">EN</option>
        </select>
      </label>
    </div>
  );
};

export default PreferenceControls;
