import React, { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode
import { fetchUserById, signoutUser, updateUser } from '../../Redux/User/userSlice';
import { useNavigate } from 'react-router-dom';
import { LuLogOut } from "react-icons/lu";
import logoImage from '../../Profile/components/Orders/paymentlogo.png';
import { placeOrder } from '../../Redux/Order/orderSlice';

const darkModeToggle = () => {
  document.documentElement.classList.toggle('dark');
};

const Navbar = ({ toggleSidebar }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);


  const handleLogoClick = () => {
    navigate('/admin');
  };

  // Decode userId from authToken and fetch user details
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        const userRole = decodedToken.role;

        if (userRole !== 'ADMIN') {
          navigate('/forbidden'); // Redirect to Forbidden page if the user is not an ADMIN
        } else {
          dispatch(fetchUserById(userId)); // Fetch user data if the role is ADMIN
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('authToken'); // Optionally, clear the invalid token
        navigate('/login'); // Redirect to login page if token is invalid
      }
    } else {
      navigate('/login'); // Redirect to login page if no token is found
    }
  }, [dispatch, navigate]);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  const handleImageClick = () => setIsEditing(true);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profileImage', file);

      try {
        if (currentUser) {
          await dispatch(updateUser({ id: currentUser._id, userData: formData }));
        }
      } catch (error) {
        console.error('Failed to update user:', error);
      }
    }
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await dispatch(signoutUser()).unwrap(); // Dispatch the signoutUser thunk
      navigate("/"); // Navigate to the homepage after successful logout
    } catch (error) {
      console.error('Logout failed:', error); // Handle any potential errors
    }
  };

  return (
    <div className="sticky top-0 z-50 ">
      <div className="flex items-center justify-between space-x-3 w-full p-4 bg-gradient-to-r bg-white text-gray-600 shadow-lg rounded-sm">
        <button
          className="p-2 transition-transform transform hover:scale-110 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full"
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>
        
        <div
      className="flex items-center cursor-pointer"
      onClick={handleLogoClick}
    >
      <img
        src={logoImage}
        alt="Logo"
        className="h-10 w-10" // Adjust the size as needed
        crossOrigin="anonymous"
      />
      <p className="font-bold text-orange-600 lg:text-2xl text-lg ml-2">
        ADMIN<span className="text-gray-600">PANNEL</span>
      </p>
    </div>

        {/* <div className="flex items-center bg-white rounded-md border border-gray-500 hover:border-green-500 shadow-sm max-w-xs w-full">
          <input
            type="text"
            placeholder="Search here..."
            className="flex-grow py-1 px-3 bg-transparent focus:outline-none"
          />
          <button className="p-2">
            <img
              aria-hidden="true"
              alt="search-icon"
              src="https://openui.fly.dev/openui/24x24.svg?text=🔍"
            />
          </button>
        </div> */}

        <div className="flex items-center space-x-2">
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleImageClick}
          >
            <img
              src={currentUser?.profileImage || "https://m.media-amazon.com/images/I/41jLBhDISxL._AC_UF1000,1000_QL80_.jpg"}
              alt="User Avatar"
              className="rounded-full w-10 h-10 cursor-pointer"
            />
            {isHovering && (
              <button
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm rounded-full"
                onClick={handleImageClick}
              >
                Edit
              </button>
            )}
          </div>
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          )}
          <div className="text-sm lg:pr-5">
            <p className="font-semibold">{currentUser ? `${currentUser.userName} ` : 'User'}</p>
            <p className="text-muted-foreground">Admin</p>
          </div>
          <button onClick={handleLogout} className=" md:block p-2 transition-transform hover:bg-red-600  transform bg-gradient-to-r bg-red-400 rounded-full">
          <LuLogOut className='font-bold text-black hover:text-white text-2xl'/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
