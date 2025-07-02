import React, { useState } from 'react';

const UpdateUserModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    // address: user.address?.[0]?.city || '',
    // role: user.role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create an updated user object
    const updatedUser = {
      _id: user._id, // Include the user ID
      ...formData
    };

    // Ensure user._id is included in updatedUser
    if (updatedUser._id) {
      console.log(updatedUser._id)
      onUpdate(updatedUser);
    } else {
      alert('User ID is missing!');
    }
  };

  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 sm:w-1/2">
        <h2 className="text-xl font-bold mb-4">Update User</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            <span className="text-gray-700">First Name</span>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">Last Name</span>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">Phone</span>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10} // Prevents more than 10 digits
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </label>
         
          {/* <label className="block mb-4">
            <span className="text-gray-700">Role</span>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </label> */}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Update</button>
          <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserModal;