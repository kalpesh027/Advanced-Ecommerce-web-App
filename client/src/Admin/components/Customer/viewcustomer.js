import React from 'react';

const ViewUserModal = ({ user, onClose }) => {
  if (!user) return null;
  console.log(user)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 sm:w-1/2">
        <h2 className="text-xl font-bold mb-4">User Details</h2>
        <p><strong>Username:</strong> {user.userName}</p>
        <p><strong>Fullname:</strong>{user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone !== '' ? user.phone : "User has not entered his mobile number"}</p>
        <p><strong>Address:</strong> {user.address?.[0]?.city || 'Address not available'}</p>
        {/* <p><strong>Role:</strong> {user.role}</p> */}
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md" onClick={onClose}>Close</button>
      </div>
    </div> 
  );
};

export default ViewUserModal;