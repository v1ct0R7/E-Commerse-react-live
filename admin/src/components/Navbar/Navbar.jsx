import { ToastContainer } from 'react-toastify'
import './Navbar.css'
import { assets } from '../../admin_assets/assets'

const Navbar = () => {
    return (
        <>
            <ToastContainer />
            <div className='navbar'>
                <img className='logo' src={assets.logo} alt="" />
                <img className='profile' src={assets.profile_image} alt="" />
            </div>
        </>

    )
}

export default Navbar