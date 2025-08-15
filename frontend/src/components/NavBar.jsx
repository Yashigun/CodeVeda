import React from 'react'
import { NavLink } from 'react-router-dom'
import { Medimate2 } from '../assets/assets'

const NavBar = () => {
  return (
    <div>
      <img src={Medimate2} alt="img" />
      <ul>
        <NavLink>
          <li>HOME</li>
          <hr />
        </NavLink>
        <NavLink>
          <li>DOCTORS</li>
          <hr />
        </NavLink>
        <NavLink>
          <li>ABOUT</li>
          <hr />
        </NavLink>
        <NavLink>
          <li>CONTACT</li>
          <hr />
        </NavLink>
      </ul>
      <div>
        <button>Create account</button>
      </div>
    </div>
  )
}

export default NavBar;