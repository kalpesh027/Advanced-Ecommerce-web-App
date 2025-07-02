import React, { useEffect, useState } from "react";
import Register from "../Auth/Register";
import { FaRegUser, FaRegHeart, FaSignOutAlt } from "react-icons/fa";
import { BsBox } from "react-icons/bs";
import { GrLogout } from "react-icons/gr";
import { clearUser, signoutUser } from "../../../Redux/User/userSlice";
import MobNavbar from "./MobileNavbar.js";

import { fetchWishlist } from '../../../Redux/Wishlist/wishlistslice'; // Adjust the path


import "./timelocation.css"
import map from "./map.png"
import clock from "./stop-watch.png"
import greymap from "./greymap.png"
import heart from "./heart.png"

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../../Redux/Cart/cartSlice";
import logo from "./logo.png"
import { fetchCategories } from "../../../Redux/Category/categoriesSlice.js"; // Adjust the path as necessary
import axiosInstance from "../../../axiosConfig.js";

const Navbar = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [hoverDropdown, setHoverDropdown] = useState(false);
  const [hoverProfile, setHoverProfile] = useState(false); // Track profile hover state
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const { items, status, fetchCartError } = useSelector((state) => state.cart);
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);




  

  useEffect(() => {
    const fetchCartData = async () => {
      const action = await dispatch(fetchCart());

      if (fetchCart.rejected.match(action)) {
        if (action.payload === "Forbidden") {
          dispatch(signoutUser()); // Sign out the user
          navigate("/login"); // Redirect to login page
        } else if (action.error?.message === "404") {
          alert("Cart is empty");
        }
      }
    };

    fetchCartData();
  }, [dispatch, navigate]);
  const authToken = localStorage.getItem("authToken");
  const isAuthenticated = !!authToken;

  const categories = useSelector((state) => state.categories.categories);
  const handleSide = (path) => {
    navigate(path);
  };

  const renderCategories = () => {
    return categories
      .filter((category) => category.level === 1)
      .map((category, i) => {
        if (i < 8) {
          return (
            <button
              onClick={() => handleSide(`/category/${category._id}`)}
              className=" border-none focus:border-none ml-3"
            >
              {category.name.toUpperCase()}
            </button>
            // < newCategoryButton key={i} category={category} isActive={false} icon={"https://cdn.builder.io/api/v1/image/assets/TEMP/228e6f8b412651ce85aa2a7c9e4a5702afd7a5e57f38741d4522f6d9c78f254e?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&"} />
          );
        }
        return null;
      });
  };

  const handleNavigate = () => {
    navigate("/category");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() === "") return; // Check if the search field is empty
    navigate(`/search/${search}`);
  };

  const showwishlist = () => {
    navigate("/myprofile/my-wishlist");
  }

  const showCart = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login'); 
      return;
    }
    navigate("/cart");
  };

  const handleProfileClick = () => {
    if (localStorage.getItem("role") === "ADMIN") {
      navigate("/admin");
    } else {
      // navigate("/myprofile/profile-information");
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(signoutUser()).unwrap(); // Dispatch the signoutUser thunk

      navigate("/"); // Navigate to the homepage after successful logout
      localStorage.clear()
      window.location.reload()
    } catch (error) {
      console.error("Logout failed:", error); // Handle any potential errors
    }
  };

  const handleMouseEnter = (event) => {
    if (isAuthenticated) {
      const { top, left, height } = event.currentTarget.getBoundingClientRect();
      setDropdownPosition({ top: top + height, left });
      setHoverProfile(true); // Track profile hover state
      setHoverDropdown(true);
    }
  };

  const handleMouseLeave = () => {
    if (isAuthenticated) {
      setTimeout(() => {
        if (!hoverProfile && !hoverDropdown) {
          setHoverDropdown(false);
        }
      }, 100);
    }
  };

  const [viewport, setViewport] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 620);

  useEffect(() => {
    const handleResize = () => {
      setViewport(window.innerWidth < 620);
      setIsMobile(window.innerWidth < 620);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogoClick = () => {
    navigate("/");
  };

  function CategoryButton({ category, isActive, icon }) {
    return (
      // <button
      //   onClick={() => handleSide(`/category/${category._id}`)}
      //   className=" border-none focus:border-none ml-3"
      // >
      //   {category.name.toUpperCase()}
      // </button>
      <div
        onClick={() => handleSide(`/category/${category._id}`)}
        className={`flex flex-col justify-center px-3.5 py-1 hover:bg-orange-200 ${isActive ? "text-white bg-orange-600" : "bg-slate-100"
          } rounded-2xl`}
      >
        <div className="flex flex-col w-full">
          <div className="flex gap-1.5 items-center justify-center">
            <div className="text-sm">{category.name}</div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/575dc8eff964a20c01b160c32196fd09287c3a968090178589e005619c83bcdb?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&"
              alt=""
              className="object-contain shrink-0 aspect-square w-[18px]"
            />
          </div>
        </div>
      </div>
    );
  }

  function newCategoryButton({ category, isActive, icon }) {
    return (
      // <button
      //   onClick={() => handleSide(`/category/${category._id}`)}
      //   className=" border-none focus:border-none ml-3"
      // >
      //   {category.name.toUpperCase()}
      // </button>

      <div
        onClick={() => handleSide(`/category/${category._id}`)}
        className={`flex flex-col justify-center px-3.5 py-1 hover:bg-orange-200 ${isActive ? "text-white bg-orange-600" : "bg-slate-100"
          } rounded-2xl`}
      >
        <div className="flex flex-col w-full">
          <div className="flex gap-1.5 items-center justify-center">
            <div className="text-sm">{category.name.toUpperCase()}</div>
            <img
              loading="lazy"
              src={icon}
              alt=""
              className="object-contain shrink-0 aspect-square w-[18px]"
            />
          </div>
        </div>
      </div>
    );
  }

  const categoriesnew = [
    {
      name: "Groceries",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/228e6f8b412651ce85aa2a7c9e4a5702afd7a5e57f38741d4522f6d9c78f254e?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&",
      isActive: true,
    },
    {
      name: "Premium Fruits",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/575dc8eff964a20c01b160c32196fd09287c3a968090178589e005619c83bcdb?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&",
      isActive: false,
    },
    {
      name: "Home & Kitchen",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/575dc8eff964a20c01b160c32196fd09287c3a968090178589e005619c83bcdb?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&",
      isActive: false,
    },
    {
      name: "Fashion",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/575dc8eff964a20c01b160c32196fd09287c3a968090178589e005619c83bcdb?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&",
      isActive: false,
    },
    {
      name: "Electronics",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/575dc8eff964a20c01b160c32196fd09287c3a968090178589e005619c83bcdb?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&",
      isActive: false,
    },
    {
      name: "Beauty",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/575dc8eff964a20c01b160c32196fd09287c3a968090178589e005619c83bcdb?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&",
      isActive: false,
    },
    {
      name: "Sports, Toys & Luggage",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/575dc8eff964a20c01b160c32196fd09287c3a968090178589e005619c83bcdb?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&",
      isActive: false,
    },
    {
      name: "Home Improvement",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/575dc8eff964a20c01b160c32196fd09287c3a968090178589e005619c83bcdb?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&",
      isActive: false,
    },
  ];

 const navclasses = viewport
  ? "flex items-center z-10 flex-col pt-2 mt-2 pb-2 mr-0 w-full"
  : "flex items-center z-10 flex-col pt-2 bg-white mt-2 pb-2 mr-0 w-full";

function CategoryNavigation() {
  return (
    <nav className={navclasses}>
      <div className="flex gap-4 self-center items-center justify-start w-full flex-wrap">   
        <div className="border-r-[3px] p-2 pr-5 lg:pr-16 w-fit">
          <button
            onClick={handleNavigate}
            className="flex items-center space-x-1 text-zinc-700"
          >
            <svg
              className={`w-6 h-6 ${viewport ? "text-white" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
            {viewport ? null : <span>All Categories</span>}
          </button>
        </div>
        {viewport ? (
          <div className="flex flex-wrap gap-3.5 w-full">
            <form
              onSubmit={handleSearch}
              className="flex lg:block flex-col justify-center items-start px-3 py-1 text-sm rounded-xl bg-slate-100 text-stone-500 w-full max-w-md"
            >
              <div className="flex items-center w-full">
                <button type="submit">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/99f489e1b79d5739e5672ea85b3334c7c95166c556f16f5b9bc5d5475ab92174?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&"
                    alt=""
                    className="object-contain w-[18px]"
                  />
                </button>
                <input
                  type="text"
                  placeholder="Search essentials, groceries and more..."
                  className="bg-transparent w-full border-none focus:outline-none"
                  onChange={(e) => setSearch(e.target.value)}
                  required
                  value={search}
                />
              </div>
            </form>
            <nav className="flex gap-5 items-center my-auto">
              <div className="flex gap-5 justify-center items-center">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/f6e35fd02649f6c904ed904cbf3b99078bbe679fe3605c1ed989c6af26f540c8?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&"
                  alt="likes-icon"
                  className="w-6 h-6"
                />
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/1996a1c43d30a0c21a9c2200ade3f29391248873a00763da09e06366bcc71a84?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&"
                  alt="cart-icon"
                  className="w-6 h-6"
                  onClick={showCart}
                />
                {isAuthenticated ? (
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/039136c19993f3461bbc06066417366a3b5f3aafdc381925c95b93a52ee67068?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&"
                    alt="profile-icon"
                    className="w-6 h-6"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  />
                ) : (
                  <button
                    onClick={() => setShowModal(true)}
                    className="text-orange-700 font-medium px-2 py-2 bg-white rounded-md"
                  >
                    Register
                  </button>
                )}
                <Register showModal={showModal} setShowModal={setShowModal} />
                {hoverDropdown && (
                  <div
                    className="fixed bg-white shadow-lg space-y-2 w-fit border border-gray-200 rounded-md z-[1000]"
                    style={{ top: dropdownPosition.top }}
                    onMouseEnter={() => setHoverDropdown(true)}
                    onMouseLeave={() => setHoverDropdown(false)}
                  >
                    <button
                      onClick={() => navigate("/myprofile/profile-information")}
                      className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                    >
                      <FaRegUser className="mr-2" />
                      My Profile
                    </button>
                    <button
                      onClick={() => navigate("/myprofile/my-wishlist")}
                      className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                    >
                      <FaRegHeart className="mr-2" />
                      Wishlist
                    </button>
                    <button
                      onClick={() => navigate("/myprofile/my-orders")}
                      className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                    >
                      <BsBox className="mr-2" />
                      Orders
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                    >
                      <GrLogout className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        ) : null}
        {/* <div className="flex flex-wrap justify-start w-full"> */}
          <div className="lg:flex gap-2 hidden">
            {categories
              .filter((category) => category.level === 1)
              .slice(0, 7)
              .map((category, index) => (
                <CategoryButton key={index} category={category} />
              ))}
          </div>
        </div>
      {/* </div> */}
    </nav>
  );
}


  function SearchBar() {
    return (
      <></>
      // <form onSubmit={handleSearch} className="flex lg:block flex-col grow shrink-0 justify-center items-start px-3 py-1 text-sm leading-none text-right rounded-xl basis-0 bg-slate-100 text-stone-500 md:w-[507px] h-auto max-md:pr-5 max-md:max-w-full">
      //   <div className="flex items-center w-full h-fit min-h-[8px]">
      //     <button type="submit">
      //       <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/99f489e1b79d5739e5672ea85b3334c7c95166c556f16f5b9bc5d5475ab92174?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&" alt="" className="object-contain shrink-0 aspect-square w-[18px]" />
      //     </button>
      //     {/* <label htmlFor="searchInput" className="sr-only w-full">Search essentials, groceries and more...</label> */}
      //     <input
      //       type="text"
      //       // id="searchInput"
      //       placeholder="Search essentials, groceries and more..."
      //       className="bg-transparent w-full border-none focus:outline-none"
      //       onChange={(e) => setSearch(e.target.value)}
      //       required
      //       value={search}
      //     />
      //   </div>
      // </form>
    );
  }

  const icons = [
    { src: "", alt: "Icon 1" },
    { src: "", alt: "Icon 2" },
  ];

  const apalbajarlogoclasses = viewport ? "h-full py-2" : "h-full px-8 py-3";


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchinput, setSearchinput] = useState('')
  const [locations, setLocations] = useState([])
  const [filteredData, setFilteredData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(() => {
    // Retrieve the saved location from local storage
    const savedLocation = localStorage.getItem('selectedLocation');
    return savedLocation ? JSON.parse(savedLocation) : null;
  });


  const fetchLocations = async () => {
    try {
      const response = await axiosInstance.get('/timelocation/alldata');
      setLocations(response.data.data);
      setFilteredData(response.data.data); // Show all locations initially
      // console.log("location = ", response.data.data)
    } catch (error) {
      console.log(error);
    }
  };

  const { wishlist } = useSelector(state => state.wishlist);
  // console.log("navbarwish=", wishlist)
  useEffect(() => {
    dispatch(fetchWishlist());
  }, []);

  const handlelocationSearch = (input) => {
    // If the input is empty, show all locations
    if (input.trim() === '') {
      setFilteredData(locations);
      setSelectedLocation(null); // Reset the selected location
      return;
    }

    const searchData = locations.filter((data) => {
      return (
        data.city.toLowerCase().includes(input.toLowerCase()) ||
        String(data.pincode).includes(input) ||
        data.area.toLowerCase().includes(input.toLowerCase())
      );
    });

    setFilteredData(searchData);

    // Automatically select the first result if available
    // if (searchData.length > 0) {
    //   setSelectedLocation(searchData[0]);
    // } else {
    //   setSelectedLocation(null); // Reset if no results found
    // }
  };

  const handleChange = (e) => {
    const input = e.target.value;
    setSearchinput(input);
    handlelocationSearch(input); // Perform search on input change
  };

  const handleSelect = (location) => {
    setSelectedLocation(location); // Save the selected location
    localStorage.setItem('selectedLocation', JSON.stringify(location)); // Save to local storage

    setIsModalOpen(false); // Close modal after selection
  };

  useEffect(() => {
    fetchLocations();

  }, []);

  useEffect(() => {
    if (!selectedLocation) {
      setIsModalOpen(true);
    }
  }, [selectedLocation]);

  // console.log("location", selectedLocation)
  return (
    <>
      <header className="sticky top-0 left-0 right-0 flex shadow-lg flex-wrap justify-between items-center  w-full bg-orange-600 max-md z-50 max-md:max-w-full">
        {/* Render MobNavbar only in mobile view */}
        {viewport ? (
          <MobNavbar />
        ) : (
          <>
            <div
              className={apalbajarlogoclasses}
              onClick={handleLogoClick}
              style={{ cursor: "pointer" }}
            >
              <p className="font-bold text-white lg:text-2xl text-lg">
                <img src={logo} alt="logo" className="h-11 w-28" />
              </p>
            </div>
  
            {/* --  Time location --  */}
            <div className="timelocation">
              <div className="locationdiv" onClick={() => setIsModalOpen(true)}>
                <img src={map} alt="map" className="mapicon" />
                <div>
                  <h4>{selectedLocation ? selectedLocation.pincode : "N/A"}</h4>
                  <h4>{selectedLocation ? selectedLocation.city : "Select Location"}</h4>
                </div>
              </div>
              <div className="timediv">
                <h4>Earliest <span className="greentext">Home Delivery</span> available</h4>
                <div className="timediv-img">
                  <img src={clock} alt="clock" className="clockicon" />
                  <p>{selectedLocation ? selectedLocation.day : ""} {selectedLocation ? selectedLocation.start : "N/A"} - {selectedLocation ? selectedLocation.end : "N/A"}</p>
                </div>
              </div>
            </div>
  
            {/* Search Form and Navigation for Desktop */}
            <div className="flex flex-wrap gap-3.5 px-8 w-fit max-md:max-w-full">
              <form
                onSubmit={handleSearch}
                className="flex lg:block flex-col grow shrink-0 justify-center items-start px-3 py-1 text-sm leading-none text-right rounded-xl basis-0 bg-slate-100 text-stone-500 md:w-[507px] h-auto max-md:pr-5 max-md:max-w-full"
              >
                <div className="flex items-center w-full h-fit min-h-[8px]">
                  <button type="submit">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/99f489e1b79d5739e5672ea85b3334c7c95166c556f16f5b9bc5d5475ab92174?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&"
                      alt=""
                      className="object-contain shrink-0 aspect-square w-[18px]"
                    />
                  </button>
                  <input
                    type="text"
                    placeholder="Search essentials, groceries and more..."
                    className="bg-transparent w-full border-none focus:outline-none"
                    onChange={(e) => setSearch(e.target.value)}
                    required
                    value={search}
                  />
                </div>
              </form>
              <nav className="flex gap-5 items-center my-auto min-h-[20px]">
                <div className="flex gap-5 justify-center items-center self-stretch my-auto">
                  <div className="relative inline-block cursor-pointer">
                    <img
                      loading="lazy"
                      src={heart}
                      alt="likes-icon"
                      className="object-contain shrink-0 self-stretch my-auto w-5 h-5 aspect-square"
                      onClick={showwishlist}
                    />
                    {wishlist && wishlist.length > 0 && (
                      <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-purple-700 text-white text-xs rounded-full px-1.5">
                        {wishlist.length}
                      </span>
                    )}
                  </div>
                  <div className="relative inline-block cursor-pointer">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/1996a1c43d30a0c21a9c2200ade3f29391248873a00763da09e06366bcc71a84?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&"
                      alt="cart-icon"
                      className="object-contain shrink-0 self-stretch my-auto w-6 h-6 aspect-square"
                      onClick={showCart}
                    />
                    {items && items[0] && items[0].length > 0 && (
                      <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-purple-700 text-white text-xs rounded-full px-1.5">
                        {items[0].length}
                      </span>
                    )}
                  </div>
  
                  {isAuthenticated ? (
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/039136c19993f3461bbc06066417366a3b5f3aafdc381925c95b93a52ee67068?apiKey=b18cd05798ae4dd7bd4cecc4acd64b6b&"
                      alt="profile-icon"
                      className="object-contain cursor-pointer shrink-0 self-stretch my-auto w-6 h-6 aspect-square"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    />
                  ) : (
                    <button
                      onClick={() => setShowModal(true)}
                      className="text-orange-700 font-medium px-2 py-2 bg-white rounded-md"
                    >
                      Register
                    </button>
                  )}
                  <Register showModal={showModal} setShowModal={setShowModal} />
                  {hoverDropdown && (
                    <div
                      className="fixed bg-white shadow-lg mt-2 space-y-2 w-fit border-[1px] border-gray-200 rounded-md z-[1000]"
                      style={{ top: dropdownPosition.top }}
                      onMouseEnter={() => setHoverDropdown(true)}
                      onMouseLeave={() => setHoverDropdown(false)}
                    >
                      <button
                        onClick={() => navigate("/myprofile/profile-information")}
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                      >
                        <FaRegUser className="mr-4" />
                        My Profile
                      </button>
                      <button
                        onClick={() => navigate("/myprofile/my-wishlist")}
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                      >
                        <FaRegHeart className="mr-4" />
                        Wishlist
                      </button>
                      <button
                        onClick={() => navigate("/myprofile/my-orders")}
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                      >
                        <BsBox className="mr-4" />
                        Orders
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                      >
                        <GrLogout className="mr-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </nav>
            </div>
  
            <CategoryNavigation />
  
            {/* Modal */}
            {isModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  {/* Search Bar */}
                  <div className="search-bar">
                    <input type="text" placeholder="Enter Pincode or City" onChange={handleChange} />
                    <div>
                      <span className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</span>
                    </div>
                  </div>
                  {/* Search Results */}
                  <div className="search-results">
                    {filteredData.map((result) => (
                      <div key={result._id} className="search-result-item" onClick={() => handleSelect(result)} style={{ cursor: 'pointer' }}>
                        <span className="icon"><img src={greymap} alt="logo" className="h-5 w-5" /></span>
                        <span>{result.pincode} - {result.city}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </header>
    </>
  );
}  

export default Navbar;