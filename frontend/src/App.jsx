import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Myprofile from './pages/Myprofile';
import About from './pages/About';
import Bookappointment from './pages/Bookappointment';
import Myappointments from './pages/Myappointments';
import NavBar from './components/NavBar';

const App = () => {
  return (
    <div>
      {/* className='mx-4 sm:mx-[10%]' */}
      <NavBar />
      
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path = '/doctors' element = {<Doctors/>}/>
        <Route path = '/doctors/:speciality' element = {<Doctors/>} />
        <Route path = '/login' element = {<Login/>}/>
        <Route path = '/about' element = {<About/>}/>
        <Route path = '/contact' element = {<Contact/>}/>
        <Route path = '/my-profile' element = {<Myprofile/>}/>
        <Route path = '/my-appointments' element = {<Myappointments/>}/>
        <Route path = '/book-appointments/:docID' element = {<Bookappointment/>}/>
      </Routes>
    </div>
  );
};

export default App;
