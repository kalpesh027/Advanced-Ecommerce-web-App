// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import registerlogo from '../assets/register.png';
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axiosInstance from "../../../axiosConfig";
// import { Link } from "react-router-dom";
// import close from "./close.png"
// import "./register.css"

// import logoo from "./logo.png"
// import { signInWithGooglePopup } from "../../../firebaseConfig";


// const sharedClasses = {
//   textZinc: "text-zinc-500",
//   hoverTextZinc: "hover:text-zinc-700",
//   darkTextZinc: "dark:text-zinc-500",
//   darkHoverTextZinc: "dark:hover:text-zinc-100",
//   bgZinc: "bg-zinc-300",
//   borderZinc: "border-zinc-300",
//   darkBgInput: "dark:bg-input",
//   darkBorderZinc: "dark:border-zinc-600",
// };

// const Register = ({ showModal, setShowModal }) => {
//   const navigate = useNavigate();
//   const [contactMethod, setContactMethod] = useState("email");
//   const [contactValue, setContactValue] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [password, setPassword] = useState("");

//   const closeModal = () => {
//     setShowModal(false);
//   };

//   const handleContactChange = (e) => {
//     setContactValue(e.target.value);
//   };

//   const handleOtpChange = (e) => {
//     e.preventDefault();
//     setOtp(e.target.value);
//   };

//   const handleUserNameChange = (e) => {
//     e.preventDefault();
//     setUserName(e.target.value);
//   };

//   const handlePasswordChange = (e) => {
//     e.preventDefault();
//     setPassword(e.target.value);
//   };

//   const handleSendOTP = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await axiosInstance.post(`/auth/register`, { [contactMethod]: contactValue });
//       if (response.data.status) {
//         setOtpSent(true);
//         toast.success("OTP sent successfully! Please check your " + (contactMethod === "phone" ? "phone" : "email") + ".");
//       } else if (response.data.message == "User already exists") {
//         toast.success("User already Exists, Please Login!");

//       }
//       else {
//         toast.error("Failed to send OTP");
//       }
//     } catch (error) {
//       console.error("Error sending OTP:", error);
//       toast.error("An error occurred while sending OTP. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const payload = {
//         [contactMethod]: contactValue,
//         otp,
//         userName,
//         password,
//       };
//       console.log("Sending payload:", payload); // Log the payload for debugging

//       const response = await axiosInstance.post('/auth/verify-otp', payload);
//       if (response.data.status) {
//         toast.success("OTP verified successfully. User created.");
//         navigate('/login'); // Redirect to login page upon successful user creation
//       } else {
//         toast.error("Failed to verify OTP");
//       }
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//       toast.error("An error occurred while verifying OTP. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const GoogleSignINUP = () => {
//     const logGoogleUser = async () => {
//       const response = await signInWithGooglePopup();
//       console.log(response);
//       const user = response.user;
//       const email = user.email;
//       const userName = user.displayName;
//       const uniqueUserID = user.uid;
//       console.log('Email:', user.email);
//       console.log('Username:', user.displayName);
//       console.log('Unique User ID:', user.uid);
//       // window.location.href = '/'
//       await handleRegisterWithGoogle(email, userName, uniqueUserID);
//     }
//     return (
//       <div class="flex mt-4 items-center w-full justify-center">
//         <div class="px-4 py-2 w-full border flex justify-center gap-2  rounded-lg text-slate-700  hover:bg-gray-100 hover:text-slate-900 hover:shadow transition duration-150">
//           <button onClick={logGoogleUser}>
//             <img class="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const handleRegisterWithGoogle = async (email, userName, uniqueUserID) => {
//     setLoading(true);
//     try {
//       const payload = {
//         email,
//         userName,
//         password: uniqueUserID,
//       };
//       console.log("Sending payload:", payload);
//       const response = await axiosInstance.post('/auth/registerWithGoogle', payload);
//       if (response.data.status) {
//         toast.success("Google registration successful. User created.");
//         toast.success("A Moment Logging you in!");
//         handleLoginwithGoogle(email, uniqueUserID);

//       } else if (response.data.message === "User already exists") {
//         // User already exists, log them in
//         // await handleLoginWithGoogle(email, uniqueUserID);
//         handleLoginwithGoogle(email, uniqueUserID);
//         toast.success("User already exist");
//       }
//     } catch (error) {
//       console.error("Error registering with Google:", error);
//       toast.error("An error occurred while registering with Google. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLoginwithGoogle = async (email, password) => {
//     try {
//       console.log("inside handleLoginwithGoogle: ", email, password);
//       const response = await axiosInstance.post(`/auth/login`, { email, password }, { withCredentials: true });
//       if (response.data.status) {
//         localStorage.setItem('authToken', response.data.token);
//         localStorage.setItem('role', response.data.data.role);
//         toast.success("Login successful");
//         navigate('/');


//         if (response.data.data.role === 'ADMIN') {
//           navigate('/admin');
//         } else {
//           navigate('/');
//         }
//       } else {
//         toast.error("Invalid email or password");
//       }
//     } catch (error) {
//       console.error("Error logging in:", error);
//       toast.error("An error occurred during login. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   function WelcomeCard() {
//     return (
//       <section className="flex relative flex-col max-w-full rounded-lg bg-slate-400 shadow-[0px_0px_4px_rgba(0,0,0,0.25)] w-[462px]">
//         <div className="flex flex-col px-6 pt-16 pb-6 w-full rounded-lg border-gray-400 border-solid border-[3px] max-md:px-5 max-md:max-w-full">
//           <header className="flex gap-2 text-6xl font-bold tracking-widest leading-[96px] max-md:text-4xl max-md:leading-[66px]">
//             <img
//               loading="lazy"
//               src="https://cdn.builder.io/api/v1/image/assets/TEMP/62d78fa3be3f2101c74f9051e30d75727fa4cfa97fa148fe239f5c97685a0dd5?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&"
//               alt=""
//               className="object-contain shrink-0 self-start w-px aspect-[0.01]"
//             />
//             <h1 className="flex-auto w-[382px] max-md:text-4xl max-md:leading-[66px]">
//               Welcome to <br /> Apla Bajar
//             </h1>
//           </header>
//           <p className="mt-5 text-sm tracking-wide leading-7 w-[305px] max-md:ml-2">
//             Let's get you all set up so you can verify your personal account and begin setting up your profile
//           </p>
//         </div>
//       </section>
//     );
//   }

//   function WelcomeSection() {
//     return (
//       // <div className="flex justify-center items-center w-6/12 bg-orange-600 ">
//       <div className="hidden lg:flex items-center justify-center bg-orange-500 text-white p-8 rounded-l-lg w-1/2">
//         <div className="flex m-20 flex-col max-w-full rounded-lg bg-sky-500/[.06] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]">
//           <div className="flex flex-col px-6 pt-16 pb-6 w-full rounded-lg border-gray-400 ">
//             <h1 className="text-5xl font-bold mb-6">Welcome to Apla Bajar</h1>
//             <p className="text-lg">Let’s get you all set up so you can verify your personal account and begin setting up your profile.</p>
//           </div>
//         </div>
//       </div>
//       // </div>
//     );
//   }

//   function SignInForm() {
//     return (

//       <></>
//     );
//   }

//   function SocialLoginOptions() {
//     const socialIcons = [
//     ];

//     return (
//       <>
//         <div className="flex gap-5 items-center justify-center mt-10 text-xs tracking-wide text-center text-gray-400">
//           {/* <img loading="lazy" className="w-fit" src="https://cdn.builder.io/api/v1/image/assets/TEMP/78ffab41280e8adde9839949e29c5a0c34f1aa126e483fb4e85fe93ce0a73e59?placeholderIfAbsent=true&apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b" alt="" className="object-contain shrink-0 self-stretch my-auto max-w-full aspect-[200] w-[183px]" /> */}
//           <div className="self-stretch">Or Continue with</div>
//           {/* <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/bd52dddc8bea4289cd4f23eab23b9febc522a970207173375c79f48aa64069ac?placeholderIfAbsent=true&apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b" alt="" className="object-contain shrink-0 self-stretch my-auto max-w-full aspect-[200] w-[182px]" /> */}
//         </div>
//         <div className="flex justify-center w-full items-center self-center">
//           <GoogleSignINUP />
//         </div>
//       </>
//     );
//   }

//   return (
//     showModal && (
//       <div className="fixed p-4 lg:p-40 inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-50">

//         {/* <div className="bg-white dark:bg-card dark:text-white w-full max-w-4xl mx-auto rounded-lg shadow-lg flex flex-col md:flex-row animate-fadeIn"> */}
//         {/* <div className="bg-orange-500 hover:bg-orange-550 p-10 flex-1 hidden lg:flex items-center flex-col justify-between animate-slideInLeft"> */}
//         {/* <div className="text-primary-foreground p-6 rounded-lg max-w-sm">
//               <h2 className="text-3xl font-bold text-gray-700 mb-4">Welcome Back!</h2>
//               <p className="text-muted-foreground text-gray-600">
//                 Log in to continue shopping with us!
//               </p>
//             </div> */}
//         {/* <WelcomeCard /> */}
//         {/* <img
//               src={registerlogo}
//               alt="Illustration of a person logging in"
//             className="max-w-full bg-cover h-[300px] w-[400px] animate-bounce image-hover"
//             /> */}
//         {/* <div className=" bg-white"> */}
//         <div className="flex h-auto">

//           <WelcomeSection />
//           <div className="flex justify-center items-center w-full lg:w-1/2 bg-white rounded-r-lg ">
//             <div className="px-4 py-10 lg:px-0 lg:pt-64 lg:pb-96 w-full max-w-lg">
//               <div className="flex  flex-col max-w-full rounded-lg bg-white  ">
//                 <button
//                   onClick={closeModal}
//                   className={`${sharedClasses.textZinc} ${sharedClasses.hoverTextZinc} ${sharedClasses.darkTextZinc} ${sharedClasses.darkHoverTextZinc} top-0 right-0`}
//                 >
                  
                
//                   {/* <img
//             aria-hidden="true"
//             alt="close-icon"
//             src="https://openui.fly.dev/openui/24x24.svg?text=✖️"
//             className="border-2 border-indigo-600 "
//           /> */}
          
//                 </button>
//                 <div className="flex flex-col mt-16">
                  

//                   {/* <h2 className="self-start text-4xl font-medium tracking-wider text-slate-900">Sign Up</h2> */}
//                   {/* <p className="self-start mt-7 text-xs tracking-wide text-gray-400">
//                Enter your email and password to login to your account.
//              </p>
//              <form>
//                <label htmlFor="email" className="sr-only">Email Address</label>
//                <input
//                 id="email"
//                 type="email"
//                 className="p-4 mt-6 text-sm tracking-wide text-gray-400 bg-white rounded border border-solid border-slate-400 max-md:pr-5 max-md:max-w-full w-full"
//                 placeholder="Email Address"
//               />
//               <label htmlFor="password" className="sr-only">Password</label>
//               <input
//                 id="password"
//                 type="password"
//                 className="p-4 mt-4 text-sm tracking-wide text-gray-400 rounded border border-solid border-slate-400 max-md:pr-5 max-md:max-w-full w-full"
//                 placeholder="8+ strong password"
//               />
//               <button className="px-16 pt-5 pb-3.5 mt-9 text-lg font-medium tracking-wide text-center text-white bg-orange-600 rounded max-md:px-5 max-md:max-w-full w-full">
//                 Sign In
//               </button>
//             </form> */}
//  <div className="absolute top-3 right-44 cursor-pointer">
//           <Link to="/">
//             <img src={close}  alt="close" className="h-7"/>
//           </Link>
//           </div>
//                   <h2 className="text-2xl lg:text-4xl my-6  font-medium tracking-wider text-slate-900 text-center ">
//                     {otpSent ? "Verify OTP" : "Sign Up"}
                    
//                   </h2>
//                   <h4 className="text-xl text-black mb-6 text-center w-full">Create an account so you can explore all the  existing jobs</h4>
//                   {!otpSent && (
//                     <button
//                       onClick={() => setContactMethod(contactMethod === "phone" ? "email" : "phone")}
//                       className="mt-4 flex text-blue-500 hover:text-blue-600 mb-2"
//                     >
//                       <div className="my-4"> {contactMethod === "phone" ? "Register with Email" : "Register with Phone"} </div>
//                     </button>
//                   )}
//                   <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP}>
//                     <div className="mb-4">
//                       <label
//                         htmlFor={contactMethod}
//                         className={`block text-zinc-700 ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc} mb-2`}
//                       >
//                         Enter your {contactMethod === "phone" ? "10 digit mobile number" : "Email"}
//                       </label>
//                       <input
//                         type="text"
//                         id={contactMethod}
//                         value={contactValue}
//                         onChange={handleContactChange}
//                         className={`w-full p-2 ${sharedClasses.borderZinc} rounded border-gray-600 border-[1px] text-zinc-500 ${sharedClasses.darkBorderZinc}`}
//                         placeholder={contactMethod === "phone" ? "+91" : "example@example.com"}
//                         required
//                       />
//                     </div>
//                     {otpSent && (
//                       <>
//                         <div className="mb-4">
//                           <label
//                             htmlFor="otp"
//                             className={`block text-zinc-700 mb-2 ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc}`}
//                           >
//                             Enter OTP
//                           </label>
//                           <input
//                             type="text"
//                             id="otp"
//                             value={otp}
//                             onChange={handleOtpChange}
//                             className={`w-full text-black p-2 ${sharedClasses.borderZinc} rounded border-gray-600 border-[1px] ${sharedClasses.darkBgInput} ${sharedClasses.darkBorderZinc}`}
//                             required
//                           />
//                         </div>
//                         <div className="mb-4">
//                           <label
//                             htmlFor="username"
//                             className={`block text-zinc-700 ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc} mb-2`}
//                           >
//                             Username
//                           </label>
//                           <input
//                             type="text"
//                             id="userName"
//                             value={userName}
//                             onChange={handleUserNameChange}
//                             className={`w-full p-2 text-black ${sharedClasses.borderZinc} rounded border-gray-600 border-[1px] ${sharedClasses.darkBgInput} ${sharedClasses.darkBorderZinc}`}
//                             required
//                           />
//                         </div>
//                         <div className="mb-4">
//                           <label
//                             htmlFor="password"
//                             className={`block text-zinc-700 mb-2${sharedClasses.textZinc} ${sharedClasses.darkTextZinc} mb-2`}
//                           >
//                             Password
//                           </label>
//                           <input
//                             type="password"
//                             id="password"
//                             value={password}
//                             onChange={handlePasswordChange}
//                             className={`w-full p-2 text-black ${sharedClasses.borderZinc} rounded border-gray-300 border-[1px] ${sharedClasses.darkBgInput} ${sharedClasses.darkBorderZinc}`}
//                             required
//                           />
//                         </div>
//                       </>
//                     )}
//                     <p
//                       className={`text-xs lg:text-sm text-zinc-600 mb-4 ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc} `}
//                     >
//                       By continuing, you agree to our{" "}
//                       <a href="#" className="text-green-600 dark:text-green-400n hover:underline">
//                         Terms & Conditions
//                       </a>
//                       ,{" "}
//                       <a href="#" className="text-green-600 dark:text-green-400 hover:underline">
//                         Refunds Policy
//                       </a>{" "}
//                       and{" "}
//                       <a href="#" className="text-green-600 dark:text-green-400 hover:underline">
//                         Privacy Policy
//                       </a>
//                     </p>
//                     <button
//                       type="submit"
//                       className="px-16 pt-5 pb-3.5 mt-9 text-lg font-medium tracking-wide text-center text-white bg-orange-600 rounded max-md:px-5 max-md:max-w-full w-full"
//                       disabled={loading}
//                     >
//                       {loading ? <span className="text-white">SENDING...</span> : otpSent ? <span className="text-white">VERIFY OTP</span> : <span className="text-white">Sign Up</span>}
//                     </button>
//                     {/* <GoogleSignINUP /> */}

//                   </form>
//                   {/* <div className="flex items-center justify-center my-4">
//       <div className="border-t border-gray-300 w-1/5"></div>
//       <span className="mx-3 text-gray-500">Or continue with</span>
//       <div className="border-t border-gray-300 w-1/5"></div>
//     </div> */}
//                   {/* <SocialLoginOptions /> */}

//                   {!otpSent && (
//                     <div className="mt-4">
//                       <p className="self-center mt-12 text-sm lg:text-base font-medium tracking-wide text-slate-900 max-md:mt-10">
//                         Already have an account?{" "}
//                         <button
//                           onClick={() => navigate('/login')}
//                           className="font-semibold text-blue-800 text-orange-500 hover:underline"
//                         >
//                           Sign In
//                         </button>
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>              </div>
//         {/* </div> */}
//         {/* </div> */}
//         {/* <div className="p-8 flex-1">
//             <div className="flex justify-between items-center mb-4">
              
//           <img src={logo} alt="Logo"   className="max-w-20" />
        
              
//             </div>
//             <h2 className="text-xl font-semibold mb-3">
//               {otpSent ? "Verify OTP" : "Register"}
//             </h2>
//             {!otpSent && (
//               <button
//                 onClick={() => setContactMethod(contactMethod === "phone" ? "email" : "phone")}
//                 className="mt-4 text-blue-500 hover:text-blue-600 mb-2"
//               >
//                 {contactMethod === "phone" ? "Register with Email" : "Register with Phone"}
//               </button>
//             )}
//             <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP}>
//               <div className="mb-4">
//                 <label
//                   htmlFor={contactMethod}
//                   className={`block ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc} mb-2`}
//                 >
//                   Enter your {contactMethod === "phone" ? "10 digit mobile number" : "email"}
//                 </label>
//                 <input
//                   type="text"
//                   id={contactMethod}
//                   value={contactValue}
//                   onChange={handleContactChange}
//                   className={`w-full p-2 ${sharedClasses.borderZinc} rounded border-gray-600 border-[1px] ${sharedClasses.darkBgInput} ${sharedClasses.darkBorderZinc}`}
//                   placeholder={contactMethod === "phone" ? "+91" : "example@example.com"}
//                   required
//                 />
//               </div>
//               {otpSent && (
//                 <>
//                   <div className="mb-4">
//                     <label
//                       htmlFor="otp"
//                       className={`block ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc} mb-2`}
//                     >
//                       Enter OTP
//                     </label>
//                     <input
//                       type="text"
//                       id="otp"
//                       value={otp}
//                       onChange={handleOtpChange}
//                       className={`w-full text-black p-2 ${sharedClasses.borderZinc} rounded border-gray-600 border-[1px] ${sharedClasses.darkBgInput} ${sharedClasses.darkBorderZinc}`}
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label
//                       htmlFor="username"
//                       className={`block ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc} mb-2`}
//                     >
//                       Username
//                     </label>
//                     <input
//                       type="text"
//                       id="userName"
//                       value={userName}
//                       onChange={handleUserNameChange}
//                       className={`w-full p-2 text-black ${sharedClasses.borderZinc} rounded border-gray-600 border-[1px] ${sharedClasses.darkBgInput} ${sharedClasses.darkBorderZinc}`}
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label
//                       htmlFor="password"
//                       className={`block ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc} mb-2`}
//                     >
//                       Password
//                     </label>
//                     <input
//                       type="password"
//                       id="password"
//                       value={password}
//                       onChange={handlePasswordChange}
//                       className={`w-full p-2 text-black ${sharedClasses.borderZinc} rounded border-gray-600 border-[1px] ${sharedClasses.darkBgInput} ${sharedClasses.darkBorderZinc}`}
//                       required
//                     />
//                   </div>
//                 </>
//               )}
//               <p
//                 className={`text-sm ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc} mb-4`}
//               >
//                 By continuing, you agree to our{" "}
//                 <a href="#" className="text-green-600 dark:text-green-400">
//                   Terms & Conditions
//                 </a>
//                 ,{" "}
//                 <a href="#" className="text-green-600 dark:text-green-400">
//                   Refunds Policy
//                 </a>{" "}
//                 and{" "}
//                 <a href="#" className="text-green-600 dark:text-green-400">
//                   Privacy Policy
//                 </a>
//               </p>
//               <button
//                 type="submit"
//                 className={`w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600  text-white rounded transition duration-150 transform hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500 hover:scale-105 focus:outline-none active:animate-flash ${sharedClasses.bgZinc} ${sharedClasses.textZinc} rounded ${loading ? "cursor-not-allowed" : ""}`}
//                 disabled={loading}
//               >
//                 { loading ? <span className="text-white">SENDING...</span> : otpSent ? <span className="text-white">VERIFY OTP</span> : <span className="text-white">CONTINUE</span>}
//               </button>
//               <GoogleSignINUP />
//             </form>
//             {!otpSent && (
//               <div className="mt-4">
//                 <p className={`text-sm ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc}`}>
//                   Existing User?{" "}
//                   <button
//                     onClick={() => navigate('/login')}
//                     className="text-blue-500 hover:text-blue-600"
//                   >
//                     Login
//                   </button>
//                 </p>
//               </div>
//             )}
//           </div> */}
//         {/* </div> */}
       
//         <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
//       </div>
//     )
//   );
// };

// export default Register;
