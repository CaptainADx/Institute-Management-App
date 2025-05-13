import React from 'react'
import '../components/style.css'
import { Link, useLocation } from 'react-router-dom'

const SideNav = () => {

  const location = useLocation();
  
  return (
    <div className="navbar-container">
        <div className="brand-container">
            <div className='brand-logo-div'>
              <img alt="brand-logo" className="brand-logo" src={require('../assets/logo2.png')} />
            </div>
            <div className='branding-section'>
              <h2 className='brand-name'>ADX FutureTech</h2>
              <p className='brand-slogan'>Manage your app in easy way</p>
            </div>
        </div>
 
        <div className='menu-container'>
          <Link to='/dashboard/home' className={location.pathname === '/dashboard/home' ? 'menu-active-link' : 'menu-link'}><i className="dashboard-icons fa-solid fa-house"></i> Home</Link>
          <Link to='/dashboard/all-courses' className={location.pathname === '/dashboard/all-courses' ? 'menu-active-link' : 'menu-link'}><i className="dashboard-icons fa-solid fa-book"></i> All Courses</Link>
          <Link to='/dashboard/add-courses' className={location.pathname === '/dashboard/add-courses' ? 'menu-active-link' : 'menu-link'}><i className="dashboard-icons fa-solid fa-plus"></i> Add Courses</Link>
          <Link to='/dashboard/all-students' className={location.pathname === '/dashboard/all-students' ? 'menu-active-link' : 'menu-link'}><i className="dashboard-icons fa-solid fa-user"></i> All Students</Link>
          <Link to='/dashboard/add-students' className={location.pathname === '/dashboard/add-students' ? 'menu-active-link' : 'menu-link'}><i className="dashboard-icons fa-solid fa-user-plus"></i> Add Students</Link>
          <Link to='/dashboard/fee-collected' className={location.pathname === '/dashboard/fee-collected' ? 'menu-active-link' : 'menu-link'}><i className="dashboard-icons fa-solid fa-money-bill"></i> Fee Collected</Link>
          <Link to='/dashboard/payment-history' className={location.pathname === '/dashboard/payment-history' ? 'menu-active-link' : 'menu-link'}><i className="dashboard-icons fa-solid fa-list"></i> Payment History</Link>
        </div>
        <div className='contact-us'>
          <p className='contact-us-para'>Contact Us</p>
          <p><i className="dashboard-icons fa-duotone fa-solid fa-phone"></i> +91-9876543210</p>
        </div>
    </div>
  )
}

export default SideNav