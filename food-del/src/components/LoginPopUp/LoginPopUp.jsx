import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound, X } from "lucide-react";
import { StoreContext } from "../../context/storeContext";
import "./LoginPopUp.css";

const LoginPopUp = ({ setShowLogIn }) => {
    const { url, setToken, t } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Login");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState({ name: "", email: "", password: "" });
    const isSignUp = currState === "Sign Up";

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !loading) setShowLogIn(false);
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [loading, setShowLogIn]);

    const onChangeHandler = (event) => {
        setData((previous) => ({ ...previous, [event.target.name]: event.target.value }));
        if (error) setError("");
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const endpoint = isSignUp ? "/api/user/register" : "/api/user/login";
            const body = isSignUp
                ? data
                : { email: data.email, password: data.password };
            const response = await axios.post(`${url}${endpoint}`, body);
            if (!response.data.success) {
                setError(response.data.message || "An error occurred");
                return;
            }

            localStorage.setItem("token", response.data.token);
            setToken(response.data.token);
            setShowLogIn(false);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    const changeState = () => {
        setCurrState(isSignUp ? "Login" : "Sign Up");
        setError("");
    };

    return (
        <div
            className="login-popup"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !loading) setShowLogIn(false);
            }}
        >
            <form
                onSubmit={onSubmit}
                className="login-popup-container"
                role="dialog"
                aria-modal="true"
                aria-labelledby="login-title"
                aria-describedby="login-description"
            >
                <button
                    className="login-popup-close"
                    type="button"
                    onClick={() => setShowLogIn(false)}
                    aria-label={t("Close")}
                    disabled={loading}
                >
                    <X size={19} />
                </button>

                <div className="login-popup-brand">
                    <span className="login-popup-brand-mark">F</span>
                    <span>FOOD STUDIO</span>
                </div>
                <div className="login-popup-heading">
                    <span className="login-popup-eyebrow">{t(isSignUp ? "JOIN OUR TABLE" : "YOUR ACCOUNT")}</span>
                    <h2 id="login-title">{t(isSignUp ? "Create your account" : "Welcome back")}</h2>
                    <p id="login-description">
                        {t(isSignUp ? "Enter your details to get started." : "Sign in to continue to your account.")}
                    </p>
                </div>

                <div className="login-popup-input">
                    {isSignUp && (
                        <label className="login-popup-field">
                            <span>{t("Your name")}</span>
                            <span className="login-popup-input-wrap">
                                <UserRound size={17} aria-hidden="true" />
                                <input
                                    autoComplete="name"
                                    name="name"
                                    onChange={onChangeHandler}
                                    value={data.name}
                                    type="text"
                                    placeholder={t("Enter your name")}
                                    required
                                    maxLength="100"
                                />
                            </span>
                        </label>
                    )}
                    <label className="login-popup-field">
                        <span>{t("Email address")}</span>
                        <span className="login-popup-input-wrap">
                            <Mail size={17} aria-hidden="true" />
                            <input
                                autoComplete="email"
                                name="email"
                                onChange={onChangeHandler}
                                value={data.email}
                                type="email"
                                placeholder="name@example.com"
                                required
                                maxLength="255"
                            />
                        </span>
                    </label>
                    <label className="login-popup-field">
                        <span>{t("Password")}</span>
                        <span className="login-popup-input-wrap">
                            <LockKeyhole size={17} aria-hidden="true" />
                            <input
                                autoComplete={isSignUp ? "new-password" : "current-password"}
                                name="password"
                                onChange={onChangeHandler}
                                value={data.password}
                                type={showPassword ? "text" : "password"}
                                placeholder={t("Enter your password")}
                                required
                                minLength="8"
                                maxLength="128"
                            />
                            <button
                                className="login-popup-password-toggle"
                                type="button"
                                onClick={() => setShowPassword((visible) => !visible)}
                                aria-label={t(showPassword ? "Hide password" : "Show password")}
                            >
                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </span>
                    </label>
                </div>

                {error && <p className="login-popup-error" role="alert">{t(error)}</p>}

                {isSignUp && (
                    <label className="login-popup-condition">
                        <input type="checkbox" required />
                        <span>{t("By continuing I agree to the terms of use & conditions")}</span>
                    </label>
                )}

                <button className="login-popup-submit" type="submit" disabled={loading}>
                    <span>{loading ? t("Please wait…") : t(isSignUp ? "Create account" : "Sign in")}</span>
                    {!loading && <ArrowRight size={17} aria-hidden="true" />}
                </button>

                <p className="login-popup-switch">
                    {t(isSignUp ? "Already have an account?" : "Create a new account?")}
                    <button type="button" onClick={changeState} disabled={loading}>
                        {t(isSignUp ? "Login here" : "Click here")}
                    </button>
                </p>

                <div className="login-popup-security">
                    <ShieldCheck size={16} aria-hidden="true" />
                    <span>{t("Your information is securely protected.")}</span>
                </div>
            </form>
        </div>
    );
};

export default LoginPopUp;