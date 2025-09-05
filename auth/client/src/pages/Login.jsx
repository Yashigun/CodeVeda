import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

const Login = () => {
  const [signedUpUser, setSignedUpUser] = useState("");
  useEffect(() => {
    setSignedUpUser(localStorage.getItem("signedUpUser"));
  }, []);

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      setError("Please fill all the fields");
      return;
    } else {
      setError("");
    }

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      const { success, message, jwtToken, name, error } = data;

      if (success) {
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        window.location.replace("http://localhost:5174/Dashboard");
      } else {
        const details = error?.details?.[0]?.message || message;
        setError(details || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen relative">
      {/* Blue box visible only on md+ screens */}
      <div className="hidden md:flex absolute right-0 w-1/2 h-full bg-[var(--color-primary)] items-center justify-center flex-col px-6 text-center">
        <h1 className="text-6xl font-bold text-[var(--color-secondary)] mb-3">
          Welcome Back! {signedUpUser}
        </h1>
        <p className="text-xl text-white opacity-90">
          We’re glad to see you again. Please login to continue.
        </p>
      </div>

      {/* Login form */}
      <div className="absolute left-0 w-full md:w-1/2 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center h-screen w-full px-6">
          <h1 className="text-3xl font-black p-6">Login here</h1>

          {/* Error message */}
          {error && <p className="text-red-500 font-medium mb-2">{error}</p>}

          <form className="w-full max-w-sm space-y-4" onSubmit={handleLogin}>
            {/* Email */}
            <div>
              <input
                name="email"
                onChange={handleChange}
                value={loginInfo.email}
                className="my-2 w-full p-3 border-none outline-none rounded-3xl bg-gray-100 shadow-[inset_4px_4px_6px_rgba(0,0,0,0.2),inset_-4px_-4px_6px_rgba(255,255,255,0.7)] focus:ring-2 focus:ring-transparent"
                type="email"
                placeholder="Enter email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <input
                name="password"
                onChange={handleChange}
                value={loginInfo.password}
                className="mb-2 w-full p-3 border-none outline-none rounded-3xl bg-gray-100 shadow-[inset_4px_4px_6px_rgba(0,0,0,0.2),inset_-4px_-4px_6px_rgba(255,255,255,0.7)] focus:ring-2 focus:ring-transparent"
                type="password"
                placeholder="Enter password"
                required
              />
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-40 p-3 rounded-3xl bg-[var(--color-primary)] text-white font-semibold hover:bg-cyan-700 transition"
              >
                Login
              </button>
            </div>

            {/* Link */}
            <span className="flex justify-center items-center mt-3 text-sm">
              Don&apos;t have an account?{" "}
              <Link className="text-[var(--color-primary)] hover:underline" to="/signup">
                Sign Up
              </Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
