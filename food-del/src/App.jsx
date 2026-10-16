import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopUp from './components/LoginPopUp/LoginPopUp'
import Verify from './pages/Verify/Verify'

const App = () => {

    const [showLogin, setShowLogIn] = useState(false);


    return (
        <>
            {showLogin ? <LoginPopUp setShowLogIn={setShowLogIn} /> : <></>}
            <div className='app'>
                <Navbar setShowLogIn={setShowLogIn} />
                < Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/order' element={<PlaceOrder />} />
                    <Route path='/verify' element={<Verify />} />
                </Routes>
            </div>
            <Footer />
        </>
    )
}

export default App