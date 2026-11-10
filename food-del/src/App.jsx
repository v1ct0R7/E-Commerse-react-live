import { useState, useContext } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopUp from './components/LoginPopUp/LoginPopUp'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import { StoreContext } from './context/storeContext'
import { Route, Routes, useLocation } from 'react-router-dom'
const App = () => {
    const [showLogin, setShowLogIn] = useState(false);
    const { errorMessage, setErrorMessage } = useContext(StoreContext);
    const location = useLocation();

    return (
        <>
            {showLogin ? <LoginPopUp setShowLogIn={setShowLogIn} /> : <></>}
            <div className='app'>
                <Navbar setShowLogIn={setShowLogIn} />
                {errorMessage && <div className="app-alert" role="alert">{errorMessage}<button onClick={() => setErrorMessage("")} aria-label="Dismiss message">×</button></div>}
                <Routes location={location}>
                    <Route path='/' element={<Home />} />
                    <Route path='/cart' element={<Cart setShowLogIn={setShowLogIn} />} />
                    <Route path='/order' element={<PlaceOrder setShowLogIn={setShowLogIn} />} />
                    <Route path='/verify' element={<Verify />} />
                    <Route path='/myorders' element={<MyOrders />} />
                    <Route path='*' element={<Home />} />
                </Routes>
            </div>
            <Footer />
        </>
    )
}

export default App