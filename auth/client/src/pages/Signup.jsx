import { Link, /*useNavigate*/ } from "react-router-dom";
import React, { useState } from "react";

const Signup = () => {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  //const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setSignupInfo({ ...signupInfo, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;

    if (!name || !email || !password) {
      setError("Please fill all the fields");
      return;
    } else {
      setError("");
    }

    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      console.log("Signup response:", data);

      const { success, message, error } = data;

      if (success) {
        localStorage.setItem("signedUpUser", name);
        window.location.replace("http://localhost:5174/Dashboard");
      } else {
        // show either detailed error or fallback to message
        const details = error?.details?.[0]?.message || message;
        setError(details || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen relative">
      {/* Blue box visible only on md+ screens */}
      <div className="hidden md:flex absolute left-0 w-1/2 h-full bg-[var(--color-primary)] items-center justify-center flex-col px-6 text-center">
        <h1 className="text-6xl font-bold text-[var(--color-secondary)] mb-3">
          Welcome!
        </h1>
        <p className="text-xl text-white opacity-90">
          Let's get you started on your wellness journey.
        </p>
      </div>

      {/* Signup form */}
      <div className="absolute right-0 w-full md:w-1/2 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center h-screen w-full px-6">
          <h1 className="text-3xl font-black p-6">Register</h1>

          {/* Error message */}
          {error && <p className="text-red-500 font-medium mb-2">{error}</p>}

          <form className="w-full max-w-sm space-y-4" onSubmit={handleSignup}>
            {/* Name */}
            <div>
              <input
                name="name"
                onChange={handleChange}
                className="mt-2 w-full p-3 border-none outline-none rounded-3xl bg-gray-100 shadow-[inset_4px_4px_6px_rgba(0,0,0,0.2),inset_-4px_-4px_6px_rgba(255,255,255,0.7)] focus:ring-2 focus:ring-transparent"
                type="text"
                placeholder="Enter name"
                value={signupInfo.name}
              />
            </div>

            {/* Email */}
            <div>
              <input
                name="email"
                onChange={handleChange}
                className="my-2 w-full p-3 border-none outline-none rounded-3xl bg-gray-100 shadow-[inset_4px_4px_6px_rgba(0,0,0,0.2),inset_-4px_-4px_6px_rgba(255,255,255,0.7)] focus:ring-2 focus:ring-transparent"
                type="email"
                placeholder="Enter email"
                value={signupInfo.email}
              />
            </div>

            {/* Password */}
            <div>
              <input
                name="password"
                onChange={handleChange}
                className="mb-2 w-full p-3 border-none outline-none rounded-3xl bg-gray-100 shadow-[inset_4px_4px_6px_rgba(0,0,0,0.2),inset_-4px_-4px_6px_rgba(255,255,255,0.7)] focus:ring-2 focus:ring-transparent"
                type="password"
                placeholder="Enter password"
                value={signupInfo.password}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-40 p-3 rounded-3xl bg-[var(--color-primary)] text-white font-semibold hover:bg-cyan-700 smooth  transition"
              >
                Sign Up
              </button>
            </div>

            {/* Link */}
            <span className="flex justify-center items-center mt-3 text-sm">
              Already have an account?{" "}
              <Link className="text-[var(--color-primary)] hover:underline" to="/login">
                Login
              </Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
