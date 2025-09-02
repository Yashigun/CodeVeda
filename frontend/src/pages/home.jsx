import React from 'react';
import Header from '../components/Header';
import About from './About'
import MapComponent from './MapComponent';
import Contact from './Contact';

const Home = () => {
  return (
    <div id = 'home'>
      <Header/>
      <About/>
      <MapComponent />
      <Contact/>
    </div>
  );
};

export default Home;
