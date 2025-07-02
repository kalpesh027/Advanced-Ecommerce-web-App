import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser, updateUser } from '../../../Redux/User/userSlice';
import { toast } from 'react-toastify';
import ViewUserModal from './viewcustomer';
import UpdateUserModal from './updatecustomer';
import AddUserModal from './AddCustomer';

const inputClass = "w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
const buttonClass = "px-3 py-1 border rounded-md";
const iconButtonClass = "text-blue-500 hover:text-blue-700";

const Customer = () => {
  const [editUser, setEditUser] = useState();
  const [viewUser, setViewUser] = useState();
  const [showAddUserModal, setShowAddUserModal] = useState(false); // State to manage add user modal

  const dispatch = useDispatch();
  const { users, status } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmDelete) {
      dispatch(deleteUser(id))
        .then(() => {
          toast.success('Account deleted successfully!');
        })
        .catch(() => {
          toast.error('Failed to delete account!');
        });
    }
  };

  const handleUpdate = (updatedUser) => {
    console.log(updateUser)
    dispatch(updateUser({ id: updatedUser._id, userData: updatedUser }))
      .then(() => {
        toast.success('User updated successfully!');
        setEditUser(null);
      })
      .catch(() => {
        toast.error('Failed to update user!');
      });
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when users change
  }, [users]);

  const handleAddUser = (newUser) => {
    // Assuming that the newUser contains the necessary user data
    dispatch(fetchUsers()); // Optionally refetch users or add the new user directly to the state if you have local state management.
    toast.success('User added successfully!');
  };



  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error loading users.</div>;
  }

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const sortedOrders = [...currentUsers].sort((a, b) => new Date(b.updatedAt) - new Date(a.orderDate));

  console.log("sortedOrders",sortedOrders)

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-zinc-100 p-4 sm:p-6">
      <div className="container mx-auto bg-white rounded-lg shadow-md p-4  sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Customer List</h1>
          <button  onClick={() => setShowAddUserModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">+ Add new</button>
        </div>
        <div className="relative mb-4">
          <input type="text" placeholder="Search here..." className={inputClass} />
          <span className="absolute right-3 top-3 text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.243 4.243-1.414 1.414-4.243-4.243zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">User</th>
                <th className="py-2 px-4 border-b hidden sm:table-cell">Phone</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b hidden md:table-cell">Address</th>
                <th className="py-2 px-4 border-b hidden lg:table-cell">Role</th>
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.reverse().map((user) => (
                <tr key={user._id} className="hover:bg-zinc-50 transition duration-200">
                  <td className="py-2 px-4 border-b flex items-center space-x-3">
                    <img src={user.profileImage || "https://placehold.co/40x40"} alt="User" className="rounded-full w-10 h-10" />
                    <div>
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-zinc-500 text-sm">{user.userName}</p>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b hidden sm:table-cell">{user.phone}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b hidden md:table-cell">{user.address?.[0]?.city || 'User has not updated address'}</td>
                  <td className="py-2 px-4 border-b hidden lg:table-cell">{user.role}</td>
                  <td className="py-2 px-4 border-b flex space-x-2">
                    <button className={iconButtonClass}>
                      <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setViewUser(user)} className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15 12a3 3 0 100-6 3 3 0 000 6zM2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2 0v10h12V5H4z" />
                      </svg>
                    </button>
                    <button className={iconButtonClass}>
                      <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setEditUser(user)} className="h-5 w-5" viewBox="0 0 20 20" fill="green">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM5 12V7H3v10a1 1 0 001 1h10v-2H6a1 1 0 01-1-1z" />
                      </svg>
                    </button>
                    <button className={iconButtonClass} onClick={() => handleDelete(user._id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="red">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H3a1 1 0 000 2h1v10a2 2 0 002 2h8a2 2 0 002-2V6h1a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm2 3V3h4v2H8zm1 6a1 1 0 112 0v4a1 1 0 11-2 0v-4z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8">
          <p className="text-zinc-600 text-xs mb-4 sm:mb-0">Showing {currentUsers.length} of {users.length} entries</p>
          <div className="flex space-x-1">
            {[...Array(Math.ceil(users.length / usersPerPage)).keys()].map((pageNumber) => (
              <button
                key={pageNumber + 1}
                className={`${buttonClass} ${currentPage === pageNumber + 1 ? 'bg-blue-500 text-white' : 'text-zinc-600 hover:bg-zinc-200'} transition duration-300`}
                onClick={() => paginate(pageNumber + 1)}
              >
                {pageNumber + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* View User Modal */}
      {viewUser && (
        <ViewUserModal
          user={viewUser}

          onClose={() => setViewUser(null)}
        />
      )}
      {/* Add User Modal */}
      {showAddUserModal && (
        <AddUserModal onClose={() => setShowAddUserModal(false)} onAdd={handleAddUser} />
      )}

      {/* Update User Modal */}
      {editUser && (
        <UpdateUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};


export default Customer;
