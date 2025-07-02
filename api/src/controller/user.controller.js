import { uploadImageOnCloudinary } from '../cloud/cloudinary.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

import bcrypt from 'bcryptjs';


// Create a new customer
export const createCustomer = async (req, res) => {
    const { firstName, lastName, userName, email, password, phone } = req.body;

    if (!firstName || !lastName || !userName || !email || !password || !phone) {
        return res.status(400).json({ message: 'All fields are required', status: false });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists', status: false });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password: hashedPassword,
            phone,
            role: 'CUSTOMER' // assuming you have a role field
        });

        return res.status(201).json({ message: 'Customer created successfully', status: true, data: newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', status: false });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    const { Id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(Id)) {
        return res.status(400).json({ message: 'Invalid user ID format', status: false });
    }

    try {
        const user = await User.findById(Id).populate('reviews');

        if (!user) {
            return res.status(404).json({ message: 'User not found', status: false });
        }

        return res.status(200).json({ message: 'User fetched successfully', status: true, data: user });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: 'Internal server error', status: false });
    }
};

// Update user by ID
export const updateUserById = async (req, res) => {
    const { Id } = req.params;
    const updateData = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(Id)) {
        return res.status(400).json({ message: 'Invalid user ID format', status: false });
    }

    try {
        // If there's a file in the request, upload it to Cloudinary
        if (req.file) {
            const uploadResponse = await uploadImageOnCloudinary(req.file.path);
            updateData.profileImage = uploadResponse.secure_url; // Assign the uploaded image URL
        }

        const user = await User.findByIdAndUpdate(Id, updateData, { new: true }).populate('reviews');

        if (!user) {
            return res.status(404).json({ message: 'User not found', status: false });
        }

        return res.status(200).json({ message: 'User updated successfully', status: true, data: user });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: 'Internal server error', status: false });
    }
};

// Delete user by ID
export const deleteUserById = async (req, res) => {
    const { Id } = req.params;
    const requesterId = req.user.id; // Requester's ID from the token
    const requesterRole = req.user.role; // Requester's role from the token

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(Id)) {
        return res.status(400).json({ message: 'Invalid user ID format', status: false });
    }

    try {
        const userToDelete = await User.findById(Id);

        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found', status: false });
        }

        // Check if the requester is the user or an admin
        if (requesterId === Id || requesterRole === 'ADMIN') {
            await User.findByIdAndDelete(Id);
            return res.status(200).json({ message: 'User deleted successfully', status: true });
        } else {
            return res.status(403).json({ message: 'Access denied. You can only delete your own account.', status: false });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Internal server error', status: false });
    }
};

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .populate("address", "city") // Assuming 'address' is a subdocument
            .populate('reviews'); // Adjust according to your schema

        return res.status(200).json({ message: 'Users fetched successfully', status: true, data: users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: 'Internal server error', status: false });
    }
};
