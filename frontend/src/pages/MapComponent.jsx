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
    <div
      className="map-section"
      style={{
        padding: "1.5rem",
        background: "oklch(0.3495 0.0708 232.77)",
        position: "relative",
      }}
    >
      <h2
        style={{
          fontSize: "3rem",
          fontWeight: "900",
          marginTop: "3rem",
          marginBottom: "1.5rem",
          color: "#fff",
          textAlign: "center",
        }}
      >
        Nearby Hospitals & Pharmacies
      </h2>
      <p
        style={{
          fontSize: "1.3rem",
          color: "#bdf1f1",
          textAlign: "center",
          maxWidth: "700px",
          margin: "0 auto 3rem",
        }}
      >
        Quickly find hospitals, clinics, and pharmacies near you to get the care you need, whenever you need it.
      </p>

      <MapContainer
        center={position}
        zoom={14}
        style={{
          height: "550px",
          width: "100%",
          borderRadius: "16px",
          border: "2px solid #ddd",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
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
          pathOptions={{ color: "#1E90FF", fillOpacity: 0.15 }}
        />

        {/* User location */}
        <Marker position={position} icon={userIcon}>
          <Popup>Your approximate location</Popup>
        </Marker>

        {/* Nearby hospitals/pharmacies */}
        {places.map((place, i) => (
          <Marker
            key={i}
            position={place.coords}
            icon={place.type === "hospital" ? hospitalIcon : pharmacyIcon}
          >
            <Popup>
              <strong>{place.name}</strong> <br />
              Type: {place.type}
            </Popup>
          </Marker>
        ))}

        {/* Legend */}
        <div
          style={{
            position: "absolute",
            top: "30px",
            right: "30px",
            background: "rgba(255,255,255,0.9)",
            padding: "10px 15px",
            borderRadius: "8px",
            boxShadow: "20 20px 12px rgba(0,0,0,0.15)",
            fontSize: "18px",
            lineHeight: "1.6",
            zIndex: 1000,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginTop: "5px" }}>
            <div
              style={{
                width: "15px",
                height: "15px",
                backgroundColor: "#1E90FF",
                borderRadius: "50%",
                marginRight: "8px",
              }}
            ></div>
            Your Location
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: "5px" }}>
            <div
              style={{
                width: "15px",
                height: "15px",
                backgroundColor: "#ff3333",
                borderRadius: "50%",
                marginRight: "8px",
              }}
            ></div>
            Hospital
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: "5px" }}>
            <div
              style={{
                width: "15px",
                height: "15px",
                backgroundColor: "#33cc33",
                borderRadius: "50%",
                marginRight: "8px",
              }}
            ></div>
            Pharmacy
          </div>
        </div>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
