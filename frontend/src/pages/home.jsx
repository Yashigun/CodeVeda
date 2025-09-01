import React from 'react';
import Header from '../components/Header';
import About from './About'
import MapComponent from './MapComponent';

const Home = () => {
  return (
    <div>
      <Header/>
      <About/>
      <MapComponent />
    </div>
  );
};

export default Home;
