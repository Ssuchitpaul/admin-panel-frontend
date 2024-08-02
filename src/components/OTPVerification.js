import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OTPVerification({ onSuccess }) {
  //use states
  const [enteredDigits, setEnteredDigits] = useState(Array(4).fill(""));
  const inputs = useRef([]);

  const [email, setEmail] = useState("");
  const [otpData, setOTPData] = useState({ otp: "", expiryTime: 0 });
  const [message, setMessage] = useState("");

  //The component which is able to retain OTP till 10 minutes
  useEffect(() => {
    const storedOTPData = JSON.parse(localStorage.getItem("otpData"));
    if (storedOTPData && Date.now() < storedOTPData.expiryTime) {
      setOTPData(storedOTPData);
    } else {
      localStorage.removeItem("otpData");
      setOTPData({ otp: "", expiryTime: 0 });
    }
  }, []);

  //OTP IS GENERATED & SENT TO THE EMAIL 4 DIGITS
  const sendOTP = () => {
    const generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
    setOTPData({ otp: generatedOTP, expiryTime: Date.now() + 10 * 60 * 1000 });
    localStorage.setItem(
      "otpData",
      JSON.stringify({
        otp: generatedOTP,
        expiryTime: Date.now() + 10 * 60 * 1000,
      })
    ); // Store OTP data in local storage
    axios
      .post("https://admin-panel-backend-indol.vercel.app", {
        email,
        otp: generatedOTP,
      })
      .then((response) => {
        setMessage(response.data.message);
        toast.success("OTP sent successfully");
      })
      .catch((error) => {
        setMessage("Failed to send OTP. Please try again later.");
        toast.error("Failed to send OTP. Please try again later.");
      });
  };

  //OTP Verification button

  const handleVerify = () => {
    const userotp = enteredDigits.join("");
    const numericOTP = parseInt(otpData.otp, 10);
    const numericUserOTP = parseInt(userotp, 10);

    if (userotp.length !== 4) {
      toast.error("Please enter the complete OTP");
    } else if (numericUserOTP === numericOTP && numericUserOTP) {
      toast.success("OTP verified successfully");
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } else {
      toast.error("Invalid OTP");
    }
  };

  const handleKeyDown = (e) => {
    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    if (e.key === "Delete" || e.key === "Backspace") {
      const index = inputs.current.indexOf(e.target);
      if (index > 0) {
        inputs.current[index].value = "";
        inputs.current[index - 1].focus();
      } else if (index === 0 && (e.key === "Delete" || e.key === "Backspace")) {
        e.target.value = "";
      }
    }
  };

  const handleInput = (e) => {
    const { target } = e;
    const index = inputs.current.indexOf(target);
    if (target.value) {
      if (index < inputs.current.length - 1) {
        inputs.current[index + 1].focus();
      }
      const newDigits = [...enteredDigits];
      newDigits[index] = target.value;
      setEnteredDigits(newDigits);
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!new RegExp(`^[0-9]{${inputs.current.length}}$`).test(text)) {
      return;
    }
    const digits = text.split("");
    const newDigits = digits.concat(Array(4 - digits.length).fill(""));
    inputs.current.forEach((input, index) => (input.value = newDigits[index]));
    setEnteredDigits(newDigits);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Admin Verification </h1>
          <p className="text-[15px] text-slate-500">
            Enter the 4-digit verification code that was sent to your Email.
          </p>
        </header>
        <form id="otp-form">
          <div className="flex items-center justify-center gap-3">
            {[...Array(4)].map((_, index) => (
              <input
                key={index}
                ref={(el) => (inputs.current[index] = el)}
                type="text"
                className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                maxLength="1"
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                onFocus={handleFocus}
                onPaste={handlePaste}
              />
            ))}
          </div>
          <div className="max-w-[260px] mx-auto mt-4">
            <button
              type="button"
              className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
              onClick={handleVerify}
            >
              Verify Account
            </button>
          </div>
        </form>
        <div className="text-sm text-slate-500 mt-4">
          <button
            onClick={() => {
              sendOTP();
            }}
            className="font-medium text-indigo-500 hover:text-indigo-600"
          >
            Send OTP
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
export default OTPVerification;
