import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import closeIcon from './close.png'
import axiosInstance from '../../../axiosConfig'
import { useNavigate } from "react-router-dom";

const sharedClasses = {
  textZinc: "text-zinc-500",
  hoverTextZinc: "hover:text-zinc-700",
  darkTextZinc: "dark:text-zinc-500",
  darkHoverTextZinc: "dark:hover:text-zinc-100",
  bgZinc: "bg-zinc-300",
  borderZinc: "border-zinc-300",
  darkBgInput: "dark:bg-input",
  darkBorderZinc: "dark:border-zinc-600",
}

export default function ForgotPassword({ onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1)
  const [contactValue, setContactValue] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  
  const handleClose = () => {
    navigate('/login'); 
  };

  const handleContactChange = (e) => {
    setContactValue(e.target.value)
  }

  const handleOtpChange = (e) => {
    setOtp(e.target.value)
  }

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value)
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axiosInstance.post('/auth/forgotPassword', {email : contactValue})
      if (response.data.status) {
        setStep(2)
        toast.success(`OTP sent successfully! Please check your Email.`)
      } else if(response.data.message === 'User does not exist'){
        toast.error("User does not exist");
      }
      else {
        toast.error("Failed to send OTP")
      }
    } catch (error) {
      console.error("Error sending OTP:", error)
      toast.error("An error occurred while sending OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axiosInstance.post('/auth/verifyResetOTP', {email:contactValue, otp : otp })
      if (response.data.status) {
        setStep(3)
        toast.success("OTP verified successfully.")
      } else {
        toast.error("Failed to verify OTP")
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      toast.error("An error occurred while verifying OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      
      const response = await axiosInstance.post('/auth/resetPassword', { email : contactValue, newPassword : newPassword })
      if (response.data.status) {
        toast.success("Password updated successfully.")
        navigate('/login');
        onClose()
      } else {
        toast.error("Failed to update password")
      }
    } catch (error) {
      console.error("Error updating password:", error)
      toast.error("An error occurred while updating password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-50">
      <div className="flex h-auto my-20">
        <div className="hidden lg:flex items-center justify-center bg-orange-500 text-white p-8 rounded-l-lg w-1/2">
          <div className="flex m-20 flex-col max-w-full rounded-lg bg-sky-500/[.06] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]">
            <div className="flex flex-col px-6 pt-16 pb-6 w-full rounded-lg border-gray-400">
              <h1 className="text-5xl font-bold mb-6">Welcome to Apla Bajar</h1>
              <p className="text-lg">Let's help you recover your account so you can regain access.</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center w-full lg:w-1/2 bg-white rounded-r-lg">
          <div className="px-4 py-0 lg:px-0 lg:pt-0 lg:py-0 w-full max-w-lg">
            <div className="flex flex-col max-w-full rounded-lg bg-white">
              <div className="absolute top-7 right-40 cursor-pointer">
                <img src={closeIcon} onClick={handleClose} alt="close" className="hidden lg:flex h-7"/>
              </div>
              <div className="flex flex-col p-4 md:p-8 lg:p-12 lg:my-0">
                <h2 className="text-2xl lg:text-4xl my-6 font-medium tracking-wider text-slate-900 text-center">
                  {step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "Reset Password"}
                </h2>
                <h4 className="text-xl text-black mb-6 text-center w-full">
                  {step === 1 ? "Enter your email to receive a password reset code" :
                   step === 2 ? "Enter the OTP sent to your email" :
                   "Enter your new password"}
                </h4>
                <form onSubmit={step === 1 ? handleSendOTP : step === 2 ? handleVerifyOTP : handleUpdatePassword}>
                  {step === 1 && (
                    <div className="mb-4">
                      <label className={`block text-zinc-700 ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc} mb-2`}>
                        Enter your Email
                      </label>
                      <input
                        type="email"
                        value={contactValue}
                        onChange={handleContactChange}
                        className={`w-full p-2 ${sharedClasses.borderZinc} rounded border-gray-600 border-[1px] text-zinc-500 ${sharedClasses.darkBorderZinc}`}
                        placeholder="example@example.com"
                        required
                      />
                    </div>
                  )}
                  {step === 2 && (
                    <div className="mb-4">
                      <label htmlFor="otp" className={`block text-zinc-700 mb-2 ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc}`}>
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        id="otp"
                        value={otp}
                        onChange={handleOtpChange}
                        className={`w-full text-black p-2 ${sharedClasses.borderZinc} rounded border-gray-600 border-[1px] ${sharedClasses.darkBgInput} ${sharedClasses.darkBorderZinc}`}
                        required
                      />
                    </div>
                  )}
                  {step === 3 && (
                    <div className="mb-4">
                      <label htmlFor="newPassword" className={`block text-zinc-700 mb-2 ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc}`}>
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        className={`w-full text-black p-2 ${sharedClasses.borderZinc} rounded border-gray-600 border-[1px] ${sharedClasses.darkBgInput} ${sharedClasses.darkBorderZinc}`}
                        required
                      />
                    </div>
                  )}
                  <button
                    type="submit"
                    className="px-16 pt-5 pb-3.5 mt-9 text-lg font-medium tracking-wide text-center text-white bg-orange-600 rounded max-md:px-5 max-md:max-w-full w-full"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : 
                     step === 1 ? "Send OTP" : 
                     step === 2 ? "Verify OTP" : 
                     "Reset Password"}
                  </button>
                </form>
                {step === 1 && (
                  <p className="self-center mt-12 text-sm lg:text-base font-medium tracking-wide text-slate-900 max-md:mt-10">
                    Remember your password? {" "}
                    <button onClick={handleClose} className="font-semibold text-blue-800 text-orange-500 hover:underline">
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  )
}
