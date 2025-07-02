import React from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';

const AdminNavbar = () => {
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center w-full lg:w-auto">
        <FaSearch className="text-gray-600 mr-2 lg:mr-5 mt-1 lg:mt-3" />
        <input
          type="text"
          placeholder="Search..."
          className="shadow-md border-gray-300 rounded p-2 w-full lg:w-96"
        />
      </div>

      <div className="flex items-center mt-4 lg:mt-0">
        <FaUserCircle className="text-gray-600 mr-2" size={24} />
        <span className="text-gray-600">Admin Name</span>
      </div>
    </nav>
  );
};

export default AdminNavbar;
