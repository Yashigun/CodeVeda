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
        headers: { "Content-Type": "application/json" },
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
      {/* Right panel */}
      <div className="hidden md:flex absolute right-0 w-1/2 h-full bg-[var(--color-primary)] items-center justify-center flex-col px-8 text-center">
        <img
          src="/login.png"
          alt="Miffy"
          className="w-2xl mb-6 drop-shadow-lg"
        />
        <h1 className="text-4xl font-bold text-[var(--color-secondary)] mb-4">
          It's Good To See You Again{signedUpUser ? `, ${signedUpUser}` : " !"}
        </h1>
      </div>

      {/* Left panel - Login form */}
      <div className="absolute left-0 w-full md:w-1/2 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center h-screen w-full px-8">
          <h1 className="text-3xl text-[var(--color-primary)] font-bold pb-10">Welcome Back!</h1>

          {/* Error message */}
          {error && <p className="text-red-500 font-medium mb-3">{error}</p>}

          <form className="w-full max-w-sm space-y-6" onSubmit={handleLogin}>
            {/* Email */}
            <input
              name="email"
              onChange={handleChange}
              value={loginInfo.email}
              className="w-full px-4 py-3 rounded-3xl bg-gray-100 shadow-inner focus:ring-2 focus:ring-cyan-400"
              type="email"
              placeholder="Enter email"
              required
            />

            {/* Password */}
            <input
              name="password"
              onChange={handleChange}
              value={loginInfo.password}
              className="w-full px-4 py-3 rounded-3xl bg-gray-100 shadow-inner focus:ring-2 focus:ring-cyan-400"
              type="password"
              placeholder="Enter password"
              required
            />

            {/* Submit */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="w-40 py-3 rounded-3xl bg-[var(--color-primary)] text-white font-semibold hover:bg-cyan-700 transition"
              >
                Login
              </button>
            </div>

            {/* Link */}
            <span className="flex justify-center items-center pt-2 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                className="ml-1 text-[var(--color-primary)] hover:underline"
                to="/signup"
              >
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
