import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Medimate1_png, Medimate4_png, pfp_png, dropdown } from '../assets/assets'

const NavBar = () => {

    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false)
    const [token, setToken] = useState(true)

  return (
    <div className='mr-20 ml-10 mt-1 flex items-center justify-between text-sm py-4 mb-2 '>
      <img className='w-50 cursor pointer' src={Medimate4_png} alt="img" />
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/'>
          <li className='py-3 text-primary'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
        </NavLink>
        <NavLink to='/Doctors'>
          <li className='py-3 text-primary'>DOCTORS</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
        </NavLink>
        <NavLink to='#About'>
          <li className='py-3 text-primary'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
        </NavLink>
        <NavLink to='/Contact'>
          <li className='py-3 text-primary'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
        </NavLink>
      </ul>
      
      <div className='flex items-center gap-4'>
        {
            token
            ? <div className='flex items-center cursor-pointer group relative'>
                <img className='w-10 rounded-full mr-1.5 border-1 border-primary'src={pfp_png} alt="profile pic" />
                <img className='w-3' src={dropdown} alt="" />
                <div className='absolute top-0 right-0 pt-14 text-base font-small text-secondary z-20 hidden group-hover:block'>
                    <div className='-m-3 min-w-48 bg-primary rounded flex flex-col gap-1.5'>
                        <p onClick={()=>navigate('Myprofile')} className='pl-3 pt-2 pb-2 hover:cursor-pointer hover:text-primary hover:bg-secondary'>My Profile</p>
                        <p onClick={()=>navigate('Myappointments')} className='pl-3 pt-2 pb-2 hover:cursor-pointer hover:text-primary hover:bg-secondary'>My Appointments</p>
                        <p onClick={()=>setToken(false)} className='pl-3 pt-2 pb-2 hover:cursor-pointer hover:text-primary hover:bg-secondary'>Logout</p>
                    </div>
                </div>
            </div>
            : <button onClick={()=>navigate('/Login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create account</button>
        }
      </div>
    </div>
  )
}

export default NavBar;