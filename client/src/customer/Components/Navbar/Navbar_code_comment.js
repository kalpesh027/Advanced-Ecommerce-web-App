// import React, { useEffect, useState } from "react";
// import Register from "../Auth/Register";
// import {
//   FaUser,
//   FaHeart,
//   FaBox,
//   FaSignOutAlt,
// } from "react-icons/fa";
// import { clearUser } from "../../../Redux/User/userSlice";
// import MobNavbar from "./MobileNavbar.js";
// import logo from "../../../logo.png";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCart } from '../../../Redux/Cart/cartSlice';
// import { fetchCategories } from "../../../Redux/Category/categoriesSlice.js"; // Adjust the path as necessary

// const Navbar = (props) => {
//   // State variables for controlling modal, hover states, dropdown position, etc.
//   const [showModal, setShowModal] = useState(false);
//   const [hoverDropdown, setHoverDropdown] = useState(false);
//   const [hoverProfile, setHoverProfile] = useState(false); // Track profile hover state
//   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { currentUser } = useSelector((state) => state.user);
//   const [search, setSearch] = useState("");
//   const { items, status, fetchCartError } = useSelector((state) => state.cart);

//   // Fetch categories and cart on component mount
//   useEffect(() => {
//     dispatch(fetchCategories());
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(fetchCart());
//   }, [dispatch]);

//   const authToken = localStorage.getItem("authToken");
//   const isAuthenticated = !!authToken;

//   const categories = useSelector((state) => state.categories.categories);

//   // Navigation to category page
//   const handleSide = (path) => {
//     navigate(path);
//   };

//   // Render top-level categories (level 1)
//   const renderCategories = () => {
//     return categories
//       .filter((category) => category.level === 1)
//       .map((category, i) => {
//         if (i < 8) {
//           return (
//             <button
//               onClick={() => handleSide(`/category/${category._id}`)}
//               className="border-none focus:border-none ml-3"
//             >
//               {category.name.toUpperCase()}
//             </button>
//           );
//         }
//         return null;
//       });
//   };

//   // Handle search functionality
//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (search.trim() === "") return; // Prevent empty searches
//     navigate(`/search/${search}`);
//   };

//   // Navigate to cart page
//   const showCart = () => {
//     navigate("/cart");
//   };

//   // Navigate to profile page based on user role
//   const handleProfileClick = () => {
//     if (localStorage.getItem("role") === "ADMIN") {
//       navigate("/admin");
//     } else {
//       navigate("/myprofile/profile-information");
//     }
//   };

//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     dispatch(clearUser());
//     navigate("/");
//   };

//   // Manage dropdown position and visibility on hover
//   const handleMouseEnter = (event) => {
//     if (isAuthenticated) {
//       const { top, left, height } = event.currentTarget.getBoundingClientRect();
//       setDropdownPosition({ top: top + height, left });
//       setHoverProfile(true);
//       setHoverDropdown(true);
//     }
//   };

//   const handleMouseLeave = () => {
//     if (isAuthenticated) {
//       setTimeout(() => {
//         if (!hoverProfile && !hoverDropdown) {
//           setHoverDropdown(false);
//         }
//       }, 100);
//     }
//   };

//   // Detect if viewport is mobile
//   const [viewport, setViewport] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 620);

//   useEffect(() => {
//     const handleResize = () => {
//       setViewport(window.innerWidth < 620);
//       setIsMobile(window.innerWidth < 620);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   // Component for rendering category buttons
//   function CategoryButton({ category, isActive, icon }) {
//     return (
//       <div onClick={() => handleSide(`/category/${category._id}`)} className={`flex flex-col justify-center px-3.5 py-1 hover:bg-orange-200 ${isActive ? 'text-white bg-orange-600' : 'bg-slate-100'} rounded-2xl`}>
//         <div className="flex flex-col w-full">
//           <div className="flex gap-1.5 items-center justify-center">
//             <div className="text-sm">{category.name}</div>
//             <img loading="lazy" src={icon} alt="" className="object-contain shrink-0 aspect-square w-[18px]" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Alternative category button component for the new design
//   function newCategoryButton({ category, isActive, icon }) {
//     return (
//       <div onClick={() => handleSide(`/category/${category._id}`)} className={`flex flex-col justify-center px-3.5 py-1 hover:bg-orange-200 ${isActive ? 'text-white bg-orange-600' : 'bg-slate-100'} rounded-2xl`}>
//         <div className="flex flex-col w-full">
//           <div className="flex gap-1.5 items-center justify-center">
//             <div className="text-sm">{category.name.toUpperCase()}</div>
//             <img loading="lazy" src={icon} alt="" className="object-contain shrink-0 aspect-square w-[18px]" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Sample categories data for testing the UI
//   const categoriesnew = [
//     { name: 'Groceries', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/228e6f8b412651ce85aa2a7c9e4a5702afd7a5e57f38741d4522f6d9c78f254e?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&', isActive: true },
//     { name: 'Premium Fruits', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/575dc8eff964a20c01b160c32196fd09287c3a968090178589e005619c83bcdb?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&', isActive: false },
//     { name: 'Home & Kitchen', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/575dc8eff964a20c01b160c32196fd09287c3a968090178589e005619c83bcdb?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&', isActive: false },
//     { name: 'Fashion', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/575dc8eff964a20c01b160c32196fd09287c3a968090178589e005619c83bcdb?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&', isActive: false },
//     { name: 'Electronics', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/575dc8eff964a20c01b160c32196fd09287c3a968090178589e005619c83bcdb?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&', isActive: false },
//     { name: 'Beauty', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/575dc8eff964a20c01b160c32196fd09287c3a968090178589e005619c83bcdb?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&', isActive: false },
//     { name: 'Sports, Toys & Luggage', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/575dc8eff964a20c01b160c32196fd09287c3a968090178589e005619c83bcdb?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&', isActive: false },
//     { name: 'Home Improvement', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/575dc8eff964a20c01b160c32196fd09287c3a968090178589e005619c83bcdb?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&', isActive: false },
//   ];

//   // Classes for mobile and desktop views
//   const navclasses = viewport ? ("flex items-center z-10 flex-col pt-2  mt-2 pb-2 mr-0  w-full max-md:max-w-full") : ("flex items-center z-10 flex-col pt-2 bg-white mt-2 pb-2 mr-2 w-full max-md:max-w-full");

//   return (
//     <nav className={navclasses}>
//       <div className="w-full">
//         {/* Navigation header for logo and search */}
//         <div className="flex justify-between items-center mx-4">
//           <div className="w-44">
//             <img src={logo} alt="Logo" onClick={() => navigate("/")} />
//           </div>

//           {/* Search bar */}
//           <form className="flex items-center w-full max-w-md relative" onSubmit={handleSearch}>
//             <input
//               className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500 w-full"
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search for products..."
//             />
//             <button
//               type="submit"
//               className="absolute right-0 top-0 bottom-0 bg-blue-600 text-white px-4 py-2 rounded-r-md"
//             >
//               Search
//             </button>
//           </form>

//           {/* Profile and Cart icons */}
//           <div className="flex items-center">
//             {isAuthenticated ? (
//               <>
//                 <div
//                   className="relative"
//                   onMouseEnter={handleMouseEnter}
//                   onMouseLeave={handleMouseLeave}
//                 >
//                   {/* Profile icon */}
//                   <FaUser
//                     className="cursor-pointer text-gray-600"
//                     size={24}
//                     onClick={handleProfileClick}
//                   />

//                   {/* Profile dropdown */}
//                   {hoverDropdown && (
//                     <div
//                       className="absolute bg-white border rounded-md shadow-lg p-4"
//                       style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
//                       onMouseEnter={() => setHoverDropdown(true)}
//                       onMouseLeave={() => setHoverDropdown(false)}
//                     >
//                       <ul>
//                         <li className="cursor-pointer" onClick={handleProfileClick}>
//                           <FaUser className="mr-2" /> My Profile
//                         </li>
//                         <li className="cursor-pointer mt-2" onClick={() => navigate("/wishlist")}>
//                           <FaHeart className="mr-2" /> Wishlist
//                         </li>
//                         <li className="cursor-pointer mt-2" onClick={() => navigate("/orders")}>
//                           <FaBox className="mr-2" /> Orders
//                         </li>
//                         <li className="cursor-pointer mt-2" onClick={handleLogout}>
//                           <FaSignOutAlt className="mr-2" /> Logout
//                         </li>
//                       </ul>
//                     </div>
//                   )}
//                 </div>

//                 {/* Cart icon */}
//                 <div className="ml-4 relative">
//                   <svg
//                     className="cursor-pointer text-gray-600"
//                     onClick={showCart}
//                     width="24"
//                     height="24"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       clipRule="evenodd"
//                       d="M16 16c0 .552-.448 1-1 1H7c-.552 0-1-.448-1-1v-2c0-.552.448-1 1-1h8c.552 0 1 .448 1 1v2zm3-8c0 .552-.448 1-1 1H6c-.552 0-1-.448-1-1v-2c0-.552.448-1 1-1h12c.552 0 1 .448 1 1v2z"
//                     />
//                   </svg>
//                   {items.length > 0 && (
//                     <span className="absolute right-0 top-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
//                       {items.length}
//                     </span>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <button
//                 className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md"
//                 onClick={() => setShowModal(true)}
//               >
//                 Register
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Render mobile navigation if mobile */}
//       {isMobile && <MobNavbar categories={categories} />}
//     </nav>
//   );
// };

// export default Navbar;
