import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../axiosConfig";
import { signInWithGooglePopup } from "../../../firebaseConfig.js";
import "./loginpg.css";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import close from "./close.png";

const Login = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );
      if (response.data.status) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("role", response.data.data.role);
        toast.success("Login successful");

        if (response.data.data.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const GoogleSignINUP = () => {
    const logGoogleUser = async () => {
      try {
        const response = await signInWithGooglePopup();
        const user = response.user;
        const email = user.email;
        const userName = user.displayName;
        const uniqueUserID = user.uid;
        await handleRegisterWithGoogle(email, userName, uniqueUserID);
      } catch (error) {
        if (error.code === "auth/popup-closed-by-user") {
          toast.info(
            "The Google sign-in popup was closed before completing the process."
          );
        } else {
          console.error("Google Sign-In failed:", error);
          toast.error(
            "An error occurred during Google Sign-In. Please try again."
          );
        }
      }
    };
    return (
      <div className="flex mt-4 items-center w-full justify-center">
        <div className="px-4 py-2 w-full border flex justify-center gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:bg-gray-100 hover:text-slate-900 hover:shadow transition duration-150">
          <img
            className="w-6 h-6"
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            loading="lazy"
            alt="google logo"
          />
          <button onClick={logGoogleUser}>Continue With Google</button>
        </div>
      </div>
    );
  };

  const handleRegisterWithGoogle = async (email, userName, uniqueUserID) => {
    try {
      const payload = {
        email,
        userName,
        password: uniqueUserID,
      };
      const response = await axiosInstance.post(
        "/auth/registerWithGoogle",
        payload
      );
      if (response.data.status) {
        toast.success("Google registration successful. User created.");
        toast.success("Logging you in...");
        handleLoginwithGoogle(email, uniqueUserID);
      } else if (response.data.message === "User already exists") {
        handleLoginwithGoogle(email, uniqueUserID);
        toast.success("User already exists. Logging in...");
      }
    } catch (error) {
      console.error("Error registering with Google:", error);
      toast.error(
        "An error occurred while registering with Google. Please try again."
      );
    }
  };

  const handleLoginwithGoogle = async (email, password) => {
    try {
      const response = await axiosInstance.post(
        `/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      if (response.data.status) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("role", response.data.data.role);
        toast.success("Login successful");

        if (response.data.data.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="fixed h-70 flex items-center justify-center bg-gray-100 inset-0 z-50 ">
      <div className="container  lg:px-40 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2  ">
          <div className="hidden lg:flex items-center justify-center bg-orange-500 text-white p-8 rounded-l-lg">
            <div className="flex m-20 flex-col max-w-full rounded-lg bg-sky-500/[.06] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]">
              <div className="flex flex-col px-6 pt-16 pb-6 w-full rounded-lg border-gray-400 ">
                <h1 className="text-5xl font-bold mb-6">
                  Welcome to Apla Bajar
                </h1>
                <p className="text-lg">
                  Let’s get you all set up so you can verify your personal
                  account and begin setting up your profile.
                </p>
              </div>
            </div>
          </div>

          <div className="px-10 pt-10 pb-10 bg-white rounded-r-lg rounded">
            {/* <div className="flex justify-between items-center mb-5">
                  <Link to="/" className="link-style text-xs">
                    Back to Home
                  </Link>
                  <Link to="/signup" className="link-style text-xs">
                    Sign Up
                  </Link>
                </div> */}
            <div className="absolute top-16 right-40 cursor-pointer m-2">
              <Link to="/">
                <img src={close} alt="close" className="hidden lg:flex h-7" />
              </Link>
            </div>
            <h2 className="text-3xl text-black font-bold mb-4 text-center">
              Login
            </h2>
            <h5 className="text-xl text-black  mb-4 text-center">
              Welcome Back you've been missed!
            </h5>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-zinc-500 dark:text-zinc-500 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  // placeholder="Email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full p-2 border-zinc-300 rounded  border-[1px] text-black dark:bg-input dark:border-zinc-600 transition duration-150 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-zinc-500 dark:text-zinc-500 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  // placeholder="Password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border-zinc-300 text-black rounded  border-[1px] dark:bg-input dark:border-zinc-600 transition duration-150 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <div className="flex  mt-6">
                  <Link to="/forgotPassword" className="link-style text-xs ">
                    <p className="text-right"> Forgot Password?</p>
                  </Link>
                </div>
              </div>
              <button
                type="submit"
                className={`w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <ToastContainer />
            </form>
            <div className="flex items-center justify-center my-6">
              <div className="border-t border-gray-300 w-1/5"></div>
              <span className="mx-3 text-gray-500">OR</span>
              <div className="border-t border-gray-300 w-1/5"></div>
            </div>
            <div className="mt-4">
              <GoogleSignINUP />
            </div>
            <p className="mt-6 text-center text-black-950">
              Don't have an account?{" "}
              <button type="button" className="text-orange-500 hover:underline">
                {" "}
                <a href="/"> Sign Up</a>{" "}
              </button>
            </p>
          </div>
          {/* </div> */}
        </div> 
      </div>
    </div>
  );
};

export default Login;
