import React, {  useEffect, useState } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import Footer from '../../../customer/Components/footer/Footer';
import axiosInstance from "../../../axiosConfig";
import { Link } from 'react-router-dom';
const notificationsData = [
  {
    id: 1,
    text: "Your order for Stylish T-Shirt has been shipped!",
    imageSrc: "https://rukminim2.flixcart.com/image/312/312/xif0q/t-shirt/z/t/i/l-yrtncbfh-try-this-original-imahf8zzuzggkg7f.jpeg?q=70",
  },
  {
    id: 2,
    text: "Casual Shirt is back in stock!",
    imageSrc: "https://rukminim2.flixcart.com/image/312/312/xif0q/shirt/i/0/v/xl-checkered-shirt-zoitgiest-original-imagtjksvawkjzz5.jpeg?q=70",
  },
  {
    id: 3,
    text: "Get 20% off on your next purchase of Trendy Sneakers!",
    imageSrc: "https://rukminim2.flixcart.com/image/312/312/xif0q/t-shirt/y/u/u/3xl-tbrbl-dgyblhenful-d37-tripr-original-imagn9wgpe7fhz25.jpeg?q=70",
  },
  {
    id: 4,
    text: "Your Men's Jacket has been delivered!",
    imageSrc: "https://rukminim2.flixcart.com/image/312/312/xif0q/shirt/i/0/v/xl-checkered-shirt-zoitgiest-original-imagtjksvawkjzz5.jpeg?q=70",
  }
];

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get('/admin/product/notifications'); 
        setNotifications(response.data.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  console.log("Notifications:",notifications);

  const handleDismiss = (id) => {
    setNotifications(notifications.filter(notification => notification._id !== id));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-4">
        <FaBell className="text-3xl text-gray-800" />
        <span className="ml-3 text-2xl font-bold text-gray-800">
          Notifications ({notifications.length})
        </span>
      </div>
      <div className="flex flex-col space-y-4">
        {notifications.map((notification) => (
          <div 
            key={notification._id} 
            className="bg-white rounded-lg shadow-lg p-4 flex items-center w-4/5 mx-auto transform transition-transform duration-300 ease-in-out hover:scale-105"
            style={{ height: '15%', animation: 'fadeIn 0.5s' }}
          >
            <Link to={`/product/${notification.product._id}`}>
            <img src={notification.product.imageUrl[0]} alt="Product" className="w-16 h-16 object-cover rounded-lg mr-4 shadow-md" />
      </Link>
           
            <div className="flex-grow">
              <p className="text-gray-800 font-medium">{notification.message}</p>
            </div>
            <FaTimes 
              className="text-gray-500 cursor-pointer hover:text-red-500 transition-colors duration-200" 
              onClick={() => handleDismiss(notification._id)} 
            />
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      {/* <Footer /> */}
    </div>
  );
};

export default Notification;
