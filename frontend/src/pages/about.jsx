import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom icons
const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [0, -35],
});

const hospitalIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [0, -35],
});

const pharmacyIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [0, -35],
});

// Recenter helper
const RecenterMap = ({ position }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
};

// Fallback hospitals
const fallbackHospitals = [
  { name: "AIIMS, New Delhi", coords: [28.5672, 77.2100], type: "hospital" },
  { name: "Safdarjung Hospital", coords: [28.5687, 77.2090], type: "hospital" },
  { name: "Apollo Hospital", coords: [28.5375, 77.2874], type: "hospital" },
  { name: "Fortis Hospital, Vasant Kunj", coords: [28.5320, 77.1507], type: "hospital" },
];

const MapComponent = () => {
  const [position, setPosition] = useState([28.6139, 77.2090]);
  const [places, setPlaces] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');

  useEffect(() => {
    let ticking = false;

    const updateScrollPosition = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      
      setScrollY(currentScrollY);
      setLastScrollY(currentScrollY);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const scrollSpeed = 0.3;
  const movementOffset = scrollDirection === 'down' ? -scrollY * scrollSpeed : scrollY * scrollSpeed;

  const fetchNearbyPlaces = async (lat, lon) => {
    const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:3000,${lat},${lon});
        node["amenity"="pharmacy"](around:3000,${lat},${lon});
      );
      out;
    `;
    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.elements?.length) {
        const nodes = data.elements.map((el) => ({
          name: el.tags?.name || "Unnamed Place",
          coords: [el.lat, el.lon],
          type: el.tags?.amenity,
        }));
        setPlaces(nodes);
      } else {
        setPlaces(fallbackHospitals);
      }
    } catch (err) {
      console.error("Overpass fetch error:", err);
      setPlaces(fallbackHospitals);
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const { latitude, longitude } = data;
        setPosition([latitude, longitude]);
        fetchNearbyPlaces(latitude, longitude);
      } catch (err) {
        console.error("IP Geolocation failed:", err);
        setPosition(fallbackHospitals[0].coords);
        setPlaces(fallbackHospitals);
      }
    };

    getLocation();
  }, []);

  return (
    <section className="w-full bg-primary py-16 md:py-20 lg:py-24 relative overflow-hidden">
      {/* Static floating background elements */}
      <div className="absolute top-20 left-10 w-8 h-8 bg-teal-200 rounded-full opacity-30 animate-bounce-gentle"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-teal-100 rounded-full opacity-40 animate-float-delayed"></div>
      <div className="absolute bottom-32 left-20 w-4 h-4 bg-white rounded-full opacity-50 animate-bounce-gentle"></div>
      <div className="absolute bottom-20 right-16 w-10 h-10 bg-teal-200 rounded-full opacity-30 animate-pulse-soft"></div>
      
      {/* Scroll-responsive floating elements */}
      <div 
        className="absolute top-60 left-45 w-60 h-60 bg-teal-300 rounded-full opacity-25 transition-transform duration-100 ease-out"
        style={{
          transform: `translateY(${movementOffset}px)`
        }}
      ></div>
      
      <div 
        className="absolute bottom-40 left-8 w-32 h-32 bg-white rounded-full opacity-30 transition-transform duration-120 ease-out"
        style={{
          transform: `translateY(${movementOffset * 1.2}px)`
        }}
      ></div>
      <div 
        className="absolute top-180 right-90 w-36 h-36 bg-teal-300 rounded-full opacity-35 transition-transform duration-110 ease-out"
        style={{
          transform: `translateY(${movementOffset * 0.8}px)`
        }}
      ></div>
      <div 
        className="absolute bottom-96 right-32 w-48 h-48 bg-teal-200 rounded-full opacity-15 transition-transform duration-140 ease-out"
        style={{
          transform: `translateY(${movementOffset * 0.9}px)`
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="text-5xl animate-wiggle">📍</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Nearby Healthcare
            </h2>
          </div>
          
          <p className="text-lg md:text-xl text-teal-100 max-w-3xl mx-auto leading-relaxed animate-slide-in-up animation-delay-300">
            Quickly find hospitals, clinics, and pharmacies near you to get the care you need, whenever you need it.
            <span className="inline-block ml-2 animate-wiggle">🏥</span>
          </p>
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-3xl p-8 shadow-xl relative overflow-hidden mb-16 animate-fade-in-up animation-delay-300">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 text-6xl animate-spin-very-slow text-teal-600">🏥</div>
            <div className="absolute top-8 right-8 text-4xl animate-bounce-gentle text-teal-500">💊</div>
            <div className="absolute bottom-6 left-8 text-5xl animate-wiggle text-teal-600">📍</div>
            <div className="absolute bottom-4 right-6 text-3xl animate-pulse-soft text-teal-500">🩺</div>
          </div>

          <div className="relative z-10">
            <MapContainer
              center={position}
              zoom={14}
              className="h-[600px] w-full rounded-2xl overflow-hidden shadow-lg ring-1 ring-teal-200"
            >
              <RecenterMap position={position} />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />

              {/* 3 km radius circle */}
              <Circle
                center={position}
                radius={3000}
                pathOptions={{ 
                  color: "#14b8a6", 
                  fillOpacity: 0.1,
                  weight: 2,
                  dashArray: "10, 10"
                }}
              />

              {/* User location */}
              <Marker position={position} icon={userIcon}>
                <Popup className="custom-popup">
                  <div className="text-center p-2">
                    <div className="font-semibold text-lg text-gray-800">📍 You are here</div>
                    <div className="text-sm text-gray-600 mt-1">Your approximate location</div>
                  </div>
                </Popup>
              </Marker>

              {/* Nearby hospitals/pharmacies */}
              {places.map((place, i) => (
                <Marker
                  key={i}
                  position={place.coords}
                  icon={place.type === "hospital" ? hospitalIcon : pharmacyIcon}
                >
                  <Popup className="custom-popup">
                    <div className="p-2">
                      <div className="font-semibold text-lg text-gray-800 mb-1">
                        {place.type === "hospital" ? "🏥" : "💊"} {place.name}
                      </div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        {place.type === "hospital" ? "Hospital" : "Pharmacy"}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Enhanced Legend */}
            <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-teal-100 min-w-[200px]">
              <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                <span className="animate-wiggle">🗺️</span>
                Map Legend
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center group hover:bg-teal-50 p-2 rounded-lg transition-colors">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 shadow-sm animate-pulse-soft"></div>
                  <span className="font-medium text-gray-700">Your Location</span>
                </div>
                
                <div className="flex items-center group hover:bg-red-50 p-2 rounded-lg transition-colors">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-3 shadow-sm"></div>
                  <span className="font-medium text-gray-700">Hospitals</span>
                </div>
                
                <div className="flex items-center group hover:bg-green-50 p-2 rounded-lg transition-colors">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3 shadow-sm"></div>
                  <span className="font-medium text-gray-700">Pharmacies</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-teal-200">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-3 h-3 border-2 border-teal-400 border-dashed rounded-full mr-2 animate-pulse-soft"></div>
                  <span>3km search radius</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-8 animate-fade-in-up animation-delay-500">
          <div 
            className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden"
            onMouseEnter={() => setHoveredCard(0)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute inset-0 bg-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
            
            <div className="relative z-10 text-center">
              <div className="text-5xl mb-6 animate-bounce-gentle group-hover:animate-wiggle">🏥</div>
              <div className="text-3xl font-bold text-primary mb-2">
                {places.filter(p => p.type === "hospital").length}
              </div>
              <div className="text-teal-600 font-medium">Hospitals Found</div>
            </div>

            {hoveredCard === 0 && (
              <>
                <div className="absolute top-4 right-4 text-teal-200 animate-float-heart">💖</div>
                <div className="absolute bottom-4 left-4 text-teal-300 animate-float-heart animation-delay-300">✨</div>
              </>
            )}
          </div>

          <div 
            className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden"
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute inset-0 bg-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
            
            <div className="relative z-10 text-center">
              <div className="text-5xl mb-6 animate-bounce-gentle group-hover:animate-wiggle">💊</div>
              <div className="text-3xl font-bold text-primary mb-2">
                {places.filter(p => p.type === "pharmacy").length}
              </div>
              <div className="text-teal-600 font-medium">Pharmacies Found</div>
            </div>

            {hoveredCard === 1 && (
              <>
                <div className="absolute top-4 right-4 text-teal-200 animate-float-heart">💖</div>
                <div className="absolute bottom-4 left-4 text-teal-300 animate-float-heart animation-delay-300">✨</div>
              </>
            )}
          </div>

          <div 
            className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden"
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute inset-0 bg-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
            
            <div className="relative z-10 text-center">
              <div className="text-5xl mb-6 animate-bounce-gentle group-hover:animate-wiggle">📍</div>
              <div className="text-3xl font-bold text-primary mb-2">3km</div>
              <div className="text-teal-600 font-medium">Search Radius</div>
            </div>

            {hoveredCard === 2 && (
              <>
                <div className="absolute top-4 right-4 text-teal-200 animate-float-heart">💖</div>
                <div className="absolute bottom-4 left-4 text-teal-300 animate-float-heart animation-delay-300">✨</div>
              </>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in-up animation-delay-800 mt-16">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 text-6xl animate-spin-very-slow text-teal-600">🏥</div>
              <div className="absolute top-8 right-8 text-4xl animate-bounce-gentle text-teal-500">💊</div>
              <div className="absolute bottom-6 left-8 text-5xl animate-wiggle text-teal-600">📍</div>
              <div className="absolute bottom-4 right-6 text-3xl animate-pulse-soft text-teal-500">🩺</div>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Need immediate medical assistance?
              </h3>
              <p className="text-teal-600 text-lg mb-8 max-w-2xl mx-auto">
                Use our map to quickly locate the nearest healthcare facilities and get the help you need.
                <span className="inline-block ml-2 animate-wiggle">🚑</span>
              </p>
              
              <button className="group bg-primary text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-teal-700 relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-3">
                  Find Healthcare Now
                  <span className="text-2xl group-hover:animate-bounce">🏥</span>
                </span>
                <div className="absolute inset-0 bg-teal-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-primary {
          background-color: #0f766e;
        }
        
        .text-primary {
          color: #0f766e;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { 
            transform: translateY(0px);
          }
          50% { 
            transform: translateY(-5px);
          }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        
        @keyframes float-heart {
          0% { 
            opacity: 0;
            transform: translateY(0px) scale(0.8);
          }
          50% { 
            opacity: 1;
            transform: translateY(-10px) scale(1);
          }
          100% { 
            opacity: 0;
            transform: translateY(-20px) scale(0.8);
          }
        }
        
        @keyframes pulse-soft {
          0%, 100% { 
            opacity: 0.1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.4;
            transform: scale(1.1);
          }
        }
        
        @keyframes spin-very-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite 1s;
        }
        
        .animate-float-heart {
          animation: float-heart 2s ease-in-out;
        }
        
        .animate-pulse-soft {
          animation: pulse-soft 5s ease-in-out infinite;
        }
        
        .animate-spin-very-slow {
          animation: spin-very-slow 20s linear infinite;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-800 {
          animation-delay: 0.8s;
        }

        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          border: 1px solid rgba(20, 184, 166, 0.2);
        }
        
        .custom-popup .leaflet-popup-tip {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </section>
  );
};

export default MapComponent;