import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Medimate4_png, pfp_png, dropdown } from "../assets/assets";

const NavBar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(true);
  const [notification, setNotification] = useState(null);

  const handleSOS = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Accurate GPS location
        const { latitude, longitude } = pos.coords;
        const mapLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        setNotification({
          message: `🚨 SOS Triggered! Your location (${latitude.toFixed(2)}, ${longitude.toFixed(2)}) has been sent. Emergency services will be in contact shortly.`,
          link: mapLink,
        });
        setTimeout(() => setNotification(null), 8000);
      },
      async () => {
        // Fallback to IP-based approximate location
        try {
          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();
          const { latitude, longitude } = data;
          const mapLink = `https://maps.google.com/?q=${latitude},${longitude}`;
          setNotification({
            message: `🚨 SOS Triggered! Your approximate location (${latitude.toFixed(2)}, ${longitude.toFixed(2)}) has been sent. Emergency services will be in contact shortly.`,
            link: mapLink,
          });
          setTimeout(() => setNotification(null), 8000);
        } catch {
          // Last fallback: no location
          setNotification({
            message: `🚨 SOS Triggered! Location unavailable. Emergency services will be in contact shortly.`,
            link: null,
          });
          setTimeout(() => setNotification(null), 8000);
        }
      }
    );
  } else {
    // Geolocation not supported, use IP fallback
    (async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const { latitude, longitude } = data;
        const mapLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        setNotification({
          message: `🚨 SOS Triggered! Your approximate location (${latitude.toFixed(2)}, ${longitude.toFixed(2)}) has been sent. Emergency services will be in contact shortly.`,
          link: mapLink,
        });
        setTimeout(() => setNotification(null), 8000);
      } catch {
        setNotification({
          message: `🚨 SOS Triggered! Location unavailable. Emergency services will be in contact shortly.`,
          link: null,
        });
        setTimeout(() => setNotification(null), 8000);
      }
    })();
  }
};


  return (
    <div className="bg-white fixed top-0 left-0 w-full z-50 shadow">
      <div className="mr-20 ml-10 mt-1 flex items-center justify-between text-sm py-4 mb-2">
        {/* Logo */}
        <NavLink to="/">
          <img
            className="w-50 cursor-pointer"
            src={Medimate4_png}
            alt="logo"
            onClick={() =>
              document.getElementById("home")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          />
        </NavLink>

        {/* Nav Links */}
        <ul className="hidden md:flex items-start gap-x-10 font-medium">
          <li
            className="py-3 text-primary cursor-pointer relative after:block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            onClick={() =>
              document.getElementById("home")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            HOME
          </li>
          <li
            className="py-3 text-primary cursor-pointer relative after:block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            onClick={() =>
              document.getElementById("about")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            ABOUT
          </li>
          <li
            className="py-3 text-primary cursor-pointer relative after:block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            onClick={() =>
              document.getElementById("map")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            MAP
          </li>
          <li
            className="py-3 text-primary cursor-pointer relative after:block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            CONTACT
          </li>
          <li
            className="py-3 text-primary cursor-pointer relative after:block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            onClick={() => navigate("/book-appointments")}
          >
            BOOK APPOINTMENT
          </li>
        </ul>

        {/* Right side: Profile + SOS */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSOS}
            className="bg-white text-red-600 border-2 px-4 py-2 rounded-full font-medium hover:bg-red-700 hover:text-white transition hover:cursor-pointer"
          >
            🚨 SOS
          </button>

          {token ? (
            <div className="flex items-center cursor-pointer group relative">
              <img
                className="w-10 rounded-full mr-1.5 border-1 border-primary"
                src={pfp_png}
                alt="profile pic"
              />
              <img className="w-3" src={dropdown} alt="" />
              <div className="absolute top-0 right-0 pt-14 text-base font-small text-secondary z-20 hidden group-hover:block">
                <div className="-m-3 min-w-48 bg-primary rounded flex flex-col gap-1.5">
                  <p
                    onClick={() => navigate("/Myprofile")}
                    className="pl-3 pt-2 pb-2 hover:bg-secondary"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate("/Myappointments")}
                    className="pl-3 pt-2 pb-2 hover:bg-secondary"
                  >
                    My Appointments
                  </p>
                  <p
                    onClick={() => setToken(false)}
                    className="pl-3 pt-2 pb-2 hover:bg-secondary"
                  >
                    Logout
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/Login")}
              className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
            >
              Create account
            </button>
          )}
        </div>
      </div>

      {/* Notification Popup */}
      {notification && (
        <div className="fixed bottom-5 right-5 bg-white shadow-lg border-l-4 border-red-600 p-4 rounded-md w-80 animate-slide-in">
          <p className="text-sm font-medium text-red-700">{notification.message}</p>
          {notification.link && (
            <a
              href={notification.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
            >
              View Location
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default NavBar;
