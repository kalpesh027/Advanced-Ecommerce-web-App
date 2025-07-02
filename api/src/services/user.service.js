import User from "../models/user.model.js";
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; // Import for token verification

// Create a new user
const createUser = async (userData) => {
  try {
    let { firstName, lastName, email, password } = userData;

    // Check if the user already exists by email
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      throw new Error(`User already exists with email: ${email}`);
    }

    // Hash the password before saving
    password = await bcrypt.hash(password, 8);

    // Create a new user
    const user = await User.create({ firstName, lastName, email, password });

    console.log("Created user", user);

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(error.message);
  }
};

// Find a user by ID
const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId); // Use findById instead of findOne
    if (!user) {
      throw new Error(`User not found with id: ${userId}`);
    }
    return user;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw new Error(error.message);
  }
};

// Find a user by email
const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email }); // Use findOne with email
    if (!user) {
      throw new Error(`User not found with email: ${email}`);
    }
    return user;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw new Error(error.message);
  }
};

// Get user profile by token
const getUserProfileByToken = async (token) => {
  try {
    // Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Fetch the user by ID
    const user = await findUserById(userId);
    
    return user;
  } catch (error) {
    console.error("Error getting user profile by token:", error);
    throw new Error("Invalid token or user not found");
  }
};

export {
  createUser,
  findUserByEmail,
  findUserById,
  getUserProfileByToken,
};
