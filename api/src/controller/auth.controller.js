import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import OTP from "../models/otp.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
// import { verifyGoogleToken } from './firebaseConfig';

// Load environment variables
dotenv.config();

///  cookies options

const cookiesOptions = {
  secure: true,
  httpOnly: true,
  sameSite: true,
};

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'shivkumarloharkar2002@gmail.com',
      pass: 'jpmm sugq vqdz khpa'
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

// Generate a 6-digit numeric OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a number between 100000 and 999999
};

// Register and send OTP
export const registerUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Email is required", status: false });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(200)
        .json({ message: "User already exists", status: false });
    }

    const otp = generateOTP();
    await OTP.create({ email, otp });
    await sendOTPEmail(email, otp);

    return res
      .status(200)
      .json({ message: "OTP sent successfully", status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, status: false });
  }
};

// Verify OTP and create user
export const verifyOTP = async (req, res) => {
  const {
    email,
    otp,
    password,
    userName,
    firstName,
    lastName,
    phone,
    dob,
    gender,
  } = req.body;

  if (
    !email ||
    !otp ||
    !password ||
    !userName ||
    !firstName ||
    !lastName ||
    !phone ||
    !dob ||
    !gender
  ) {
    return res.status(400).json({
      message:
        "Email, OTP, password, userName, firstname, lastname, phone, dob, and gender are required",
      status: false,
    });
  }

  try {
    // Check if the OTP is valid
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res
        .status(400)
        .json({ message: "Invalid or expired OTP", status: false });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      email,
      password: hashedPassword,
      userName,
      firstName,
      lastName,
      phone,
      dob,
      gender,
    });

    // Clean up OTPs for this email
    await OTP.deleteMany({ email });

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not set.");
      return res
        .status(500)
        .json({ message: "Internal server error", status: false });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // set to true in production
    });

    return res.status(201).json({
      message: "User created successfully",
      status: true,
      token,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: false });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required", status: false });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email", status: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "user exists but Invalid password", status: false });
    }

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not set.");
      return res
        .status(500)
        .json({ message: "Internal server error", status: false });
    }

    const token = user.generateUserToken();
    console.log("NODE_ENV:", process.env.NODE_ENV);

    res.cookie("access_token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production', // set to true in production
    });

    return res.status(200).json({
      message: "Login successful Password match",
      status: true,
      token,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res;
    status(500).json({ message: "Internal server error", status: false });
  }
};

// Session check endpoint
export const checkSession = async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      return res
        .status(401)
        .json({ status: false, message: "Access token is missing or invalid" });
    }

    // Verify the token
    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);

    // Fetch user details based on the decoded token
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    return res.status(200).json({ status: true, user });
  } catch (error) {
    console.error("Error checking session:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

// Sign out user
export const signout = (req, res) => {
  res.clearCookie("access_token");
  res.status(200).json({ message: "Sign out successful", status: true });
};

// Forgot Password - Send OTP
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Email is required", status: false });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(201)
        .json({ message: "User does not exist", status: false });
    }

    // Generate OTP
    const otp = generateOTP();
    await OTP.create({ email, otp });

    // Send OTP to user's email
    await sendOTPEmail(email, otp);

    return res
      .status(200)
      .json({ message: "OTP sent successfully", status: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: false });
  }
};

// Verify OTP for password reset
export const verifyResetOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ message: "Email and OTP are required", status: false });
  }

  try {
    // Check if the OTP is valid
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res
        .status(400)
        .json({ message: "Invalid or expired OTP", status: false });
    }

    // OTP is valid, allow user to proceed to reset password
    return res
      .status(200)
      .json({ message: "OTP verified successfully", status: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: false });
  }
};

// Reset Password - After verifying OTP
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email and new password are required", status: false });
  }

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    await User.updateOne({ email }, { password: hashedPassword });

    // Clean up OTPs for this email
    await OTP.deleteMany({ email });

    return res
      .status(200)
      .json({ message: "Password reset successfully", status: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: false });
  }
};

// update password through postman for admin not for frontend
export const upatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.updateOne({ email: email }, { password: hashedPassword });

  return res
    .status(200)
    .json({ message: "Admin password updated successfully", status: true });
};

// export const signout = (req, res) => {
//     res.clearCookie('token');
//     req.session.destroy(err => {
//         if (err) {
//             return res.status(500).send({ message: 'Unable to log out' });
//         }
//         res.status(200).send({ message: 'Successfully logged out' });
//     });
// };

// thi will Register user via Google
export const registerWithGoogle = async (req, res) => {
  const { email, password, userName } = req.body;

  if (!email || !userName || !password) {
    return res.status(400).json({
      message: "Email, password, and userName are required",
      status: false,
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(201)
        .json({ message: "User already exists", status: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      userName,
    });

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not set.");
      return res
        .status(500)
        .json({ message: "Internal server error", status: false });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(201).json({
      message: "User created successfully",
      status: true,
      token,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: false });
  }
};
