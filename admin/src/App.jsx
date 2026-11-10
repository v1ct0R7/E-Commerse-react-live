import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./admin.css";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Orders from "./pages/Orders/Orders";
import List from "./pages/List/List";
import Add from "./pages/Add/Add";
import Dashboard from "./pages/Dashboard/Dashboard";
import Categories from "./pages/Categories/Categories";
import Customers from "./pages/Customers/Customers";
import Coupons from "./pages/Coupons/Coupons";
import Settings from "./pages/Settings/Settings";
import PreferenceControls from "./components/PreferenceControls";
import { PreferencesContext, translateAdmin } from "./preferences";

const url = import.meta.env.VITE_API_URL || "http://localhost:4000";

const AdminLogin = ({ onLogin, theme, setTheme, language, setLanguage }) => {
  const t = (text) => translateAdmin(text, language);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post(`${url}/api/user/login`, { email, password });
      if (!response.data.success) throw new Error(response.data.message || "Unable to sign in");
      if (response.data.role !== "admin") throw new Error("This account does not have administrator access");
      onLogin(response.data.token, response.data.name);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-login">
      <form onSubmit={submit} className="admin-login-card">
        <PreferenceControls theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} />
        <span className="admin-eyebrow">FOOD DELIVERY / ADMIN</span>
        <h1>{t("Welcome back.")}</h1>
        <p>{t("Sign in with your administrator account to continue.")}</p>
        <label>{t("Email address")}<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" /></label>
        <label>{t("Password")}<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /></label>
        <button disabled={submitting}>{submitting ? t("Signing in…") : t("Sign in to dashboard")}</button>
      </form>
    </main>
  );
};

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken") || "");
  const [adminName, setAdminName] = useState(() => localStorage.getItem("adminName") || "Administrator");
  const [checking, setChecking] = useState(Boolean(localStorage.getItem("adminToken")));
  const [theme, setTheme] = useState(() => localStorage.getItem("food-studio-admin-theme") === "light" ? "light" : "dark");
  const [language, setLanguage] = useState(() => localStorage.getItem("food-studio-admin-language") === "en" ? "en" : "sq");
  const t = (text) => translateAdmin(text, language);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("food-studio-admin-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem("food-studio-admin-language", language);
  }, [language]);

  const logout = useCallback(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    setToken("");
  }, []);

  useEffect(() => {
    if (!token) return;
    axios.get(`${url}/api/order/list`, { headers: { token } })
      .catch(() => logout())
      .finally(() => setChecking(false));
  }, [token, logout]);

  const login = (authToken, name) => {
    localStorage.setItem("adminToken", authToken);
    localStorage.setItem("adminName", name || "Administrator");
    setAdminName(name || "Administrator");
    setToken(authToken);
  };

  const preferences = { language, theme, t };

  return (
    <PreferencesContext.Provider value={preferences}>
      <ToastContainer />
      {checking ? <div className="admin-loading">{t("Checking admin access…")}</div> : !token ? (
        <AdminLogin onLogin={login} theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} />
      ) : (
        <div className="admin-app">
          <Navbar adminName={adminName} onLogout={logout} theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} />
          <div className="admin-layout">
            <Sidebar />
            <main className="admin-main">
              <Routes>
                <Route path="/" element={<Dashboard url={url} token={token} />} />
                <Route path="/add" element={<Add url={url} token={token} />} />
                <Route path="/list" element={<List url={url} token={token} />} />
                <Route path="/orders" element={<Orders url={url} token={token} />} />
                <Route path="/categories" element={<Categories url={url} token={token} />} />
                <Route path="/customers" element={<Customers url={url} token={token} />} />
                <Route path="/coupons" element={<Coupons url={url} token={token} />} />
                <Route path="/settings" element={<Settings url={url} token={token} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </PreferencesContext.Provider>
  );
};

export default App;
