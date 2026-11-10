import { useContext, useState } from 'react'
import { assets } from '../../assets/frontend_assets/assets'
import { StoreContext } from '../../context/storeContext'
import axios from 'axios'


const LoginPopUp = ({ setShowLogIn }) => {

    const {url,setToken,setErrorMessage,t} = useContext(StoreContext)

    const [currState, setCurrState] = useState("Login")
    const [data,setData]= useState({
        name:"",
        email:"",
        password:""
    })

    const onChangeHandler = (event) =>{
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({...data,[name]:value}))
    }

    const onLogin = async (event) => {
        event.preventDefault();
        let newUrl = url
        if (currState === "Login") {
            newUrl += "/api/user/login"
        }
        else {
            newUrl += "/api/user/register"
        }
        try {
            const response = await axios.post(newUrl, data);
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token)
                setShowLogIn(false)
            }
            else {
                setErrorMessage(response.data.message || "An error occurred")
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(error.response?.data?.message || "Failed to connect to server")
        }
    }

    return (
        <div className="login-popup">
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{t(currState)}</h2>
                    <img onClick={() => setShowLogIn(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-input">
                    {currState === "Login" ? <></> : <input aria-label={t("Your name")} name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder={t("Your name")} required />}
                    <input aria-label={t("Your email")} name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder={t("Your email")} required />
                    <input aria-label={t("Password")} name='password' onChange={onChangeHandler} value={data.password} type="password" minLength="8" placeholder={t("Password")} required />
                </div>
                <button type='submit'>{currState === "Sign Up" ? t("Create account") : t("Login")}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>{t("By continuing I agree to the terms of use & conditions")}</p>
                </div>
                {currState === "Login"
                    ? <p>{t("Create a new account?")} <span onClick={()=>setCurrState("Sign Up")}>{t("Click here")}</span></p>
                    : <p>{t("Already have an account?")} <span onClick={()=>setCurrState("Login")}>{t("Login here")}</span></p>
                }
            </form>
        </div>
    )
}

export default LoginPopUp