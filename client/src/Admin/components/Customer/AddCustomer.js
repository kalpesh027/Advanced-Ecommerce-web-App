import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../axiosConfig';

const AddUserModal = ({ onClose, onAdd }) => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Here, make a POST request to your API to add the user
            // Example:
            const response = await axiosInstance.post('/user/addcustomer', {
                firstName, lastName, phone, email, password, userName
            });

            

            const newUser =response.data
            onAdd(newUser); // Notify parent component of new user
            toast.success('User added successfully!');
            onClose(); // Close the modal
        } catch (error) {
            toast.error(error);
        }
    };

    return (
        // <div className="modal">
        //     <div className="modal-content">
        //         <h2>Add New User</h2>
        //         <form onSubmit={handleSubmit}>
        //             <input type="text" name="firstName" placeholder="First Name" value={firstName} onChange={(e) => {
        //                 setfirstName(e.target.value)
        //             }} required />
        //             <input type="text" name="lastName" placeholder="Last Name" value={lastName} onChange={(e) => {
        //                 setlastName(e.target.value)
        //             }} required />
        //             <input type="text" name="userName" placeholder="Username" value={userName} onChange={(e) => {
        //                 setuserName(e.target.value)
        //             }} required />
        //             <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => {
        //                 setemail(e.target.value)
        //             }} required />
        //             <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => {
        //                 setpassword(e.target.value)
        //             }} required />
        //             <input type="tel" name="phone" placeholder="Phone" value={phone} onChange={(e) => {
        //                 setphone(e.target.value)
        //             }} required />
        //             <button type="submit">Add User</button>
        //         </form>
        //         <button onClick={onClose}>Close</button>
        //     </div>
        // </div>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/3 z-50">
                <h2 className="text-xl font-bold mb-4">Add New User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 text-gray-700">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-gray-700">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-gray-700">Username</label>
                        <input
                            type="text"
                            name="userName"
                            placeholder="Username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-gray-700">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            Add User
                        </button>
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;
