import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Myprofile from './pages/Myprofile';
import About from './pages/About';
import Bookappointment from './pages/Bookappointment';
import Myappointments from './pages/Myappointments';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import LoginToContinue from './pages/logintocontinue';
import Dashboard from './pages/dashboard';

const App = () => {
  return (
    <AuthProvider>
      <div>
        {/* className='mx-4 sm:mx-[10%]' */}
        <NavBar className = 'sticky top-0' />
        
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path = '/doctors' element = {<Doctors/>}/>
          <Route path = '/login' element = {<Login/>}/>
          <Route path = '/about' element = {<About/>}/>
          <Route path = '/contact' element = {<Contact/>}/>
          <Route path = '/my-profile' element = {<Myprofile/>}/>
          <Route path = '/book-appointments' element = {<Bookappointment/>}/>
          <Route path='/redirecting' element={<LoginToContinue/>}></Route>
          <Route path = '/dashboard' element = {<Dashboard/>}/>
        </Routes>
        <Footer className='sticky bottom-0'/>
        
      </div>
    </AuthProvider>
  );
};

export default App;