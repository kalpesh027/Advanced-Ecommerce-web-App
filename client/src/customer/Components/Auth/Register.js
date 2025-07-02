import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import registerlogo from "../assets/register.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../../axiosConfig";
import { Link } from "react-router-dom";
import close from "./close.png";
import "./register.css";

import logoo from "./logo.png";
import { signInWithGooglePopup } from "../../../firebaseConfig";

const sharedClasses = {
  textZinc: "text-zinc-500",
  hoverTextZinc: "hover:text-zinc-700",
  darkTextZinc: "dark:text-zinc-500",
  darkHoverTextZinc: "dark:hover:text-zinc-100",
  bgZinc: "bg-zinc-300",
  borderZinc: "border-zinc-300",
  darkBgInput: "dark:bg-input",
  darkBorderZinc: "dark:border-zinc-600",
};

const Register = ({ showModal, setShowModal }) => {
  const navigate = useNavigate();
  const [contactMethod, setContactMethod] = useState("email");
  const [contactValue, setContactValue] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  const closeModal = () => {
    setShowModal(false);
  };

  const handleContactChange = (e) => {
    setContactValue(e.target.value);
  };

  const handleOtpChange = (e) => {
    e.preventDefault();
    setOtp(e.target.value);
  };

  const handleFirstNameChange = (e) => {
    e.preventDefault();
    setFirstName(e.target.value);
  };
  const handleLastNameChange = (e) => {
    e.preventDefault();
    setLastName(e.target.value);
  };
  const handleUserNameChange = (e) => {
    e.preventDefault();
    setUserName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };
  const handlePhoneChange = (e) => {
    e.preventDefault();
    setPhone(e.target.value);
  };
  const handleDobChange = (e) => {
    e.preventDefault();
    setDob(e.target.value);
  };
  const handleGenderChange = (e) => {
    e.preventDefault();
    setGender(e.target.value);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/auth/register`, {
        [contactMethod]: contactValue,
      });
      if (response.data.status) {
        setOtpSent(true);
        toast.success(
          "OTP sent successfully! Please check your " +
          (contactMethod === "phone" ? "phone" : "email") +
          "."
        );
      } else if (response.data.message == "User already exists") {
        toast.success("User already Exists, Please Login!");
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("An error occurred while sending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        [contactMethod]: contactValue,
        otp,
        userName,
        password,
        firstName,
        lastName,
        phone,
        dob,
        gender,
      };
      console.log("Sending payload:", payload); // Log the payload for debugging

      const response = await axiosInstance.post("/auth/verify-otp", payload);
      if (response.data.status) {
        toast.success("OTP verified successfully. User created.");
        navigate("/login"); // Redirect to login page upon successful user creation
      } else {
        toast.error("Failed to verify OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("An error occurred while verifying OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const GoogleSignINUP = () => {
    const logGoogleUser = async () => {
      const response = await signInWithGooglePopup();
      console.log(response);
      const user = response.user;
      const email = user.email;
      const userName = user.displayName;
      const uniqueUserID = user.uid;
      console.log("Email:", user.email);
      console.log("Username:", user.displayName);
      console.log("Unique User ID:", user.uid);
      // window.location.href = '/'
      await handleRegisterWithGoogle(email, userName, uniqueUserID);
    };
    return (
      <div class="flex mt-4 items-center w-full justify-center">
        <div class="px-4 py-2 w-full border flex justify-center gap-2  rounded-lg text-slate-700  hover:bg-gray-100 hover:text-slate-900 hover:shadow transition duration-150">
          <button onClick={logGoogleUser}>
            <img
              class="w-6 h-6"
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              loading="lazy"
              alt="google logo"
            />
          </button>
        </div>
      </div>
    );
  };

  const handleRegisterWithGoogle = async (email, userName, uniqueUserID) => {
    setLoading(true);
    try {
      const payload = {
        email,
        userName,
        password: uniqueUserID,
      };
      console.log("Sending payload:", payload);
      const response = await axiosInstance.post(
        "/auth/registerWithGoogle",
        payload
      );
      if (response.data.status) {
        toast.success("Google registration successful. User created.");
        toast.success("A Moment Logging you in!");
        handleLoginwithGoogle(email, uniqueUserID);
      } else if (response.data.message === "User already exists") {
        // User already exists, log them in
        // await handleLoginWithGoogle(email, uniqueUserID);
        handleLoginwithGoogle(email, uniqueUserID);
        toast.success("User already exist");
      }
    } catch (error) {
      console.error("Error registering with Google:", error);
      toast.error(
        "An error occurred while registering with Google. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoginwithGoogle = async (email, password) => {
    try {
      console.log("inside handleLoginwithGoogle: ", email, password);
      const response = await axiosInstance.post(
        `/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      if (response.data.status) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("role", response.data.data.role);
        toast.success("Login successful");
        navigate("/");

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

  function WelcomeCard() {
    return (
      <section className="flex relative flex-col max-w-full rounded-lg bg-slate-400 shadow-[0px_0px_4px_rgba(0,0,0,0.25)] w-[462px]">
        <div className="flex flex-col px-6 pt-16 pb-6 w-full rounded-lg border-gray-400 border-solid border-[3px] max-md:px-5 max-md:max-w-full">
          <header className="flex gap-2 text-6xl font-bold tracking-widest leading-[96px] max-md:text-4xl max-md:leading-[66px]">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/62d78fa3be3f2101c74f9051e30d75727fa4cfa97fa148fe239f5c97685a0dd5?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&"
              alt=""
              className="object-contain shrink-0 self-start w-px aspect-[0.01]"
            />
            <h1 className="flex-auto w-[382px] max-md:text-4xl max-md:leading-[66px]">
              Welcome to <br /> Apla Bajar
            </h1>
          </header>
          <p className="mt-5 text-sm tracking-wide leading-7 w-[305px] max-md:ml-2">
            Let's get you all set up so you can verify your personal account and
            begin setting up your profile
          </p>
        </div>
      </section>
    );
  }

  function WelcomeSection() {
    return (
      // <div className="flex justify-center items-center w-6/12 bg-orange-600 ">
      <div className="hidden lg:flex items-center justify-center bg-orange-500 text-white p-8 rounded-l-lg w-1/2">
        <div className="flex m-20 flex-col max-w-full rounded-lg bg-sky-500/[.06] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col px-6 pt-16 pb-6 w-full rounded-lg border-gray-400 ">
            <h1 className="text-5xl font-bold mb-6">Welcome to Apla Bajar</h1>
            <p className="text-lg">
              Let’s get you all set up so you can verify your personal account
              and begin setting up your profile.
            </p>
          </div>
        </div>
      </div>
      // </div>
    );
  }

  function SignInForm() {
    return <></>;
  }

  function SocialLoginOptions() {
    const socialIcons = [];

    return (
      <>
        <div className="flex gap-5 items-center justify-center mt-10 text-xs tracking-wide text-center text-gray-400">
          {/* <img loading="lazy" className="w-fit" src="https://cdn.builder.io/api/v1/image/assets/TEMP/78ffab41280e8adde9839949e29c5a0c34f1aa126e483fb4e85fe93ce0a73e59?placeholderIfAbsent=true&apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b" alt="" className="object-contain shrink-0 self-stretch my-auto max-w-full aspect-[200] w-[183px]" /> */}
          <div className="self-stretch">Or Continue with</div>
          {/* <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/bd52dddc8bea4289cd4f23eab23b9febc522a970207173375c79f48aa64069ac?placeholderIfAbsent=true&apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b" alt="" className="object-contain shrink-0 self-stretch my-auto max-w-full aspect-[200] w-[182px]" /> */}
        </div>
        <div className="flex justify-center w-full items-center self-center">
          <GoogleSignINUP />
        </div>
      </>
    );
  }

  return (
    showModal && (
      <div className="fixed p-4 lg:p-40 inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-50">
        <div className="flex h-auto my-20  ">
          <WelcomeSection />
          <div className="flex justify-center items-center w-full lg:w-1/2 bg-white rounded-r-lg overflow-y-auto">
            <div className="px-4 py-0 lg:px-0 lg:pt-0 lg:py-0 w-full max-w-lg ">
              <div className="flex  flex-col max-w-full rounded-lg bg-white  ">
                <button
                  onClick={closeModal}
                  className={`${sharedClasses.textZinc} ${sharedClasses.hoverTextZinc} ${sharedClasses.darkTextZinc} ${sharedClasses.darkHoverTextZinc} top-0 right-0`}
                ></button>
                <div className="flex flex-col p-4 md:p-8 lg:p-12  lg:my-0">
                  <div className="absolute top-7 right-40 cursor-pointer">
                    <Link to="/">
                      <img
                        src={close}
                        onClick={closeModal}
                        alt="close"
                        className="hidden lg:flex h-7"
                      />
                    </Link>
                  </div>
                  <h2 className="text-2xl lg:text-4xl my-2 lg:my-4  font-medium tracking-wider text-slate-900 text-center ">
                    {otpSent ? "Verify OTP" : "Sign Up"}
                  </h2>
                  <h4 className=" text-sm sm:text-xl text-black mb-2 sm:mb-6 text-center w-full">
                    Create an account so you can explore all the existing jobs
                  </h4>
                  {!otpSent && (
                    <button
                      onClick={() =>
                        setContactMethod(
                          contactMethod === "phone" ? "email" : "phone"
                        )
                      }
                      className="mt-4 flex text-blue-500 hover:text-blue-600 mb-2"
                    >
                      <div className="my-4">
                        {" "}
                        {contactMethod === "phone"
                          ? "Register with Email"
                          : "Register with Phone"}{" "}
                      </div>
                    </button>
                  )}
                  <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP}>
                    <div className="mb-1 ">
                      <label
                        htmlFor={contactMethod}
                        className={`block text-sm sm:text-lg text-zinc-700 ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc} sm:mb-2`}
                      >
                        Enter your{" "}
                        {contactMethod === "phone"
                          ? "10 digit mobile number"
                          : "Email"}
                      </label>
                      <input
                        type="text"
                        id={contactMethod}
                        value={contactValue}
                        onChange={handleContactChange}
                        className={`w-full p-0.5 lg:p-2 ${sharedClasses.borderZinc} rounded border-gray-600 border-[1px] text-zinc-500 ${sharedClasses.darkBorderZinc}`}
                        placeholder={
                          contactMethod === "phone"
                            ? "+91"
                            : "example@example.com"
                        }
                        required
                      />
                    </div>
                    {otpSent && (
                      <>
                        <div className="mb-1">
                          <label
                            htmlFor="otp"
                            className={`block text-zinc-700 text-sm sm:text-lg sm:mb-2 ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc}`}
                          >
                            Enter OTP
                          </label>
                          <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={handleOtpChange}
                            className={`w-full text-black p-0.5 lg:p-2 ${sharedClasses.borderZinc} rounded border-gray-600 border-[1px] ${sharedClasses.darkBgInput} ${sharedClasses.darkBorderZinc}`}
                            required
                          />
                        </div>

                        <div className="flex justify-between flex-wrap w-full">
                          <div className="mb-1 w-full sm:w-auto">
                            <label
                              htmlFor="firstName"
                              className={`block text-zinc-700 text-sm sm:text-lg ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc} sm:mb-2`}
                            >
                              First Name
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              value={firstName}
                              onChange={handleFirstNameChange}
                              className={`w-full p-0.5 lg:p-2 text-black ${sharedClasses.borderZinc} rounded border-gray-600 border-[1px] ${sharedClasses.darkBgInput} ${sharedClasses.darkBorderZinc}`}
                              required
                            />
                          </div>

                          <div className="mb-1 w-full sm:w-auto">
                            <label
                              htmlFor="lastName"
                              className={`block text-zinc-700 text-sm sm:text-lg ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc} sm:mb-2`}
                            >
                              last Name
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              value={lastName}
                              onChange={handleLastNameChange}
                              className={`w-full p-0.5 lg:p-2 text-black ${sharedClasses.borderZinc} rounded border-gray-600 border-[1px] ${sharedClasses.darkBgInput} ${sharedClasses.darkBorderZinc}`}
                              required
                            />
                          </div>
                        </div>

                        <div className="flex justify-between flex-wrap">
                          <div className="mb-1 w-full sm:w-auto">
                            <label
                              htmlFor="username"
                              className={`block text-zinc-700 text-sm sm:text-lg ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc} sm:mb-2`}
                            >
                              Username
                            </label>
                            <input
                              type="text"
                              id="userName"
                              value={userName}
                              onChange={handleUserNameChange}
                              className={`w-full p-0.5 lg:p-2 text-black  ${sharedClasses.borderZinc} rounded border-gray-600 border-[1px] ${sharedClasses.darkBgInput} ${sharedClasses.darkBorderZinc}`}
                              required
                            />
                          </div>

                          <div className="mb-1 w-full sm:w-auto">
                            <label
                              htmlFor="phone"
                              className={`block text-zinc-700 text-sm sm:text-lg sm:mb-2 ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc} `}
                            >
                              Phone
                            </label>
                            <input
                              type="number"
                              id="phone"
                              value={phone}
                              onChange={handlePhoneChange}
                              className={`w-full p-0.5 lg:p-2 text-black ${sharedClasses.borderZinc} rounded border-gray-300 border-[1px] ${sharedClasses.darkBgInput} ${sharedClasses.darkBorderZinc}`}
                              required
                            />
                          </div>

                        </div>

                        <div className="flex justify-between flex-wrap">
                          <div className="mb-1 w-full sm:w-auto">
                            <label
                              htmlFor="dob"
                              className={`block text-zinc-700 text-sm sm:text-lg sm:mb-2 ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc}`}
                            >
                              Date Of Birth
                            </label>
                            <input
                              type="date"
                              id="dob"
                              value={dob}
                              onChange={handleDobChange}
                              className={`w-full p-0.5 lg:p-2 text-black ${sharedClasses.borderZinc} rounded border-gray-300 border-[1px] ${sharedClasses.darkBgInput} ${sharedClasses.darkBorderZinc}`}
                              required
                            />
                          </div>

                          <div className="mb-1 w-full sm:w-auto">
                            <label
                              htmlFor="gender"
                              className={`block text-zinc-700 text-sm sm:text-lg sm:mb-2 ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc} `}
                            >
                              Gender
                            </label>
                            <select
                              name="gender"
                              id="gender"
                              value={gender}
                              onChange={handleGenderChange}
                              className={`w-full p-0.5 lg:p-2 text-black ${sharedClasses.borderZinc} rounded border-gray-300 border-[1px] ${sharedClasses.darkBgInput} ${sharedClasses.darkBorderZinc}`}
                              required
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div className="mb-1 w-full sm:w-auto">
                          <label
                            htmlFor="password"
                            className={`block text-zinc-700 text-sm sm:text-lg sm:mb-2 ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc} `}
                          >
                            Password
                          </label>
                          <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className={`w-full p-0.5 lg:p-2 text-black ${sharedClasses.borderZinc} rounded border-gray-300 border-[1px] ${sharedClasses.darkBgInput} ${sharedClasses.darkBorderZinc}`}
                            required
                          />
                        </div>
                      </>
                    )}
                    <p
                      className={`text-sm sm:text-lg text-zinc-600 mb-4 ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc} `}
                    >
                      By continuing, you agree to our{" "}
                      <a
                        href="terms"
                        className="text-green-600 dark:text-green-400n hover:underline"
                      >
                        Terms & Conditions
                      </a>
                      ,{" "}
                      <a
                        href="privacy"
                        className="text-green-600 dark:text-green-400 hover:underline"
                      >
                        Refunds Policy
                      </a>{" "}
                      and{" "}
                      <a
                        href="privacy"
                        className="text-green-600 dark:text-green-400 hover:underline"
                      >
                        Privacy Policy
                      </a>
                    </p>
                    <button
                      type="submit"
                      className="px-16 pt-2 sm:pt-5 pb-2  sm:pb-3.5 mt-1 sm:mt-4 text-sm sm:text-lg font-medium tracking-wide text-center text-white bg-orange-600 rounded max-md:px-5 max-md:max-w-full w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="text-white">SENDING...</span>
                      ) : otpSent ? (
                        <span className="text-white">VERIFY OTP</span>
                      ) : (
                        <span className="text-white">Sign Up</span>
                      )}
                    </button>
                    {/* <GoogleSignINUP /> */}
                  </form>

                  {/* <div className="flex items-center justify-center my-4">
      <div className="border-t border-gray-300 w-1/5"></div>
      <span className="mx-3 text-gray-500">Or continue with</span>
      <div className="border-t border-gray-300 w-1/5"></div>
    </div> */}
                  {/* <SocialLoginOptions /> */}

                  {!otpSent && (
                    <div className="mt-4">
                      <p className="self-center mt-12 text-sm lg:text-base font-medium tracking-wide text-slate-900 max-md:mt-10">
                        Already have an account?{" "}
                        <button
                          onClick={() => navigate("/login")}
                          className="font-semibold text-blue-800 text-orange-500 hover:underline"
                        >
                          Sign In
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
        {/* </div> */}
        {/* </div> */}

        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    )
  );
};

export default Register;
