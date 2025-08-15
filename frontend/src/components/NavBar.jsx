import React from 'react'
import { NavLink } from 'react-router-dom'
import { Medimate1_png } from '../assets/assets'

const NavBar = () => {
  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
      <img className='w-65 cursor pointer' src={Medimate1_png} alt="img" />
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink>
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto'/>
        </NavLink>
        <NavLink>
          <li className='py-1'>DOCTORS</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto'/>
        </NavLink>
        <NavLink>
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto'/>
        </NavLink>
        <NavLink>
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto'/>
        </NavLink>
      </ul>
      <div>
        <button>Create account</button>
      </div>
    </div>
  )
}

export default NavBar;