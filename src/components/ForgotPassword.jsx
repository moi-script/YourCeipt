import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL } from "@/api/getKeys.js";
// const BASE_API_URL  = import.meta.env.VITE_URL_BACKEND || "http://localhost:5173"


const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  // --- HANDLERS ---

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.post(BASE_API_URL + "/user/send-otp", { email });
      alert("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      alert("Error sending OTP");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.post(BASE_API_URL + "/user/verify-otp", { email, otp });
      setStep(3);
    } catch (err) {
      console.error("Unable to verify otp ::", err);
      alert("Invalid OTP");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(BASE_API_URL + "/user/reset-password", { email, otp, newPassword });
      alert("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      alert("Failed to reset password");
    }
  };

  // --- STYLES ---
  const inputStyle = {
    display: "block",
    width: "100%",
    marginBottom: "10px",
    padding: "8px",
    
    // Explicit colors to prevent "invisible ink"
    color: "#000000",
    backgroundColor: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: "4px"
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      
      {/* STEP 1: ENTER EMAIL */}
      {step === 1 && (
        <form onSubmit={handleSendOTP}>
          <h3>Forgot Password</h3>
          <input
            key="step1-email"
            type="email"
            name="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit">Send OTP</button>
        </form>
      )}

      {/* STEP 2: ENTER OTP */}
      {step === 2 && (
        <form onSubmit={handleVerifyOTP}>
          <h3>Enter OTP</h3>
          <p>Sent to {email}</p>
          <input
            key="step2-otp"
            type="text"
            name="otp"
            autoComplete="off"
            placeholder="6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit">Verify OTP</button>
        </form>
      )}

      {/* STEP 3: NEW PASSWORD */}
      {step === 3 && (
        <form onSubmit={handleResetPassword}>
          <h3>Set New Password</h3>
          <input
            key="step3-pass"
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit">Update Password</button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;