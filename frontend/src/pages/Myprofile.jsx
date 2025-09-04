import React, { useState } from 'react'
import {assets, pfp_png } from "../assets/assets";

const Myprofile = () => {

  const [userData, setUserData] = useState({
    name:"Jane Doe",
    image: assets.pfp_png,
    email: "janedoe@email.com",
    phone: "+91 9988775550",
    address: {
      line1:"Phase 1, 14 Lady Hardinge Road",
      line2:"Connaught Place, New Delhi"
    },
    gender: "Female",
    bloodgroup: "B+",
    dob: '21-07-2000'
  })
  return (
    <div className='py-20 bg-gradient-to-r from-primary to-teal-700'>
      <div className="bg-gradient-to-r from-primary to-teal-700 flex-shrink-0 pt-10 pb-20">
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='py-6 sm:py-8'>
            <div className='flex items-center justify-between'>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                My Profile
              </h1>
            </div>
            <div className="hidden sm:flex items-center space-x-4"></div>
          </div>
          <div className='bg-white rounded-3xl pt-5 pb-5 max-w-7xl flex-shrink-0 mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
            <div className='text-primary text-3xl font-bold'>
              Information
              <div className='w-16 h-1 bg-gradient-to-r from-primary to-teal-700 rounded-full mt-0.5'></div>
              {/* actual profile content */}
              <div className='text-2xl p-5 flex items-center justify-center'>
                <img className='h-15 w-15 rounded-full' src={userData.image} alt="profile picture" />

              </div>


            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Myprofile
