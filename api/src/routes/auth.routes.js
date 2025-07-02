import express from "express";
import {
  checkSession,
  loginUser,
  registerUser,
  signout,
  verifyOTP,
  registerWithGoogle,
  upatePassword,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
} from "../controller/auth.controller.js";
const router = express.Router();



router.route("/register").post(registerUser);

router.post("/verify-otp", verifyOTP);
router.post("/registerWithGoogle", registerWithGoogle);

router.post("/login", loginUser);

router.delete("/signout", signout);
router.get("/session", checkSession);
router.post("/updatePassword", upatePassword);

// forgot password route
router.post("/forgotPassword", forgotPassword); // send otp to email 
router.post('/verifyResetOTP', verifyResetOTP); // verify otp
router.post('/resetPassword', resetPassword); // reset password

export default router;
