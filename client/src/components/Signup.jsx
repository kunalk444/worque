import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveData } from '../slices/userSlice';
import '../App.css'
import { GoogleLogin } from '@react-oauth/google';

function Signup({ show, onClose }) {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [existingUserFlag,setExistingUserFlag]=useState(false);
  const dispatch = useDispatch();
  existingUserFlag && setTimeout(()=>setExistingUserFlag(false),1700);
  const handleSignup = async () => {
    const res = await fetch("http://localhost:5000/user/signup", {
      method: "POST",
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ uname: name, upass: pass, uemail: email }),
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      dispatch(saveData({ uname: name, email: email,id:data.id }));
      onClose();
    }
    if(!data.success)setExistingUserFlag(true);
    
  }

  const verifyGoogleLogin = async (tokenId) => {
    const data = await fetch("http://localhost:5000/user/googleUser", {
      credentials: "include",
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ token: tokenId })
    });
    const res = await data.json();
    if (res.success) {
      dispatch(saveData({ uname:res.uname,email:res.email,isLoggedIn:true,id:res.id}));
      onClose();
    }
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      {existingUserFlag && (
  <div className="absolute inset-0 flex items-start justify-center pointer-events-none z-50">
    <div
      className={`
        mt-4 px-5 py-2.5 bg-amber-100 text-amber-800
        rounded-lg font-semibold text-sm shadow-lg
        animate-pulse-once whitespace-nowrap
      `}
      style={{
        animation: 'fadeInOut 1.7s ease-out forwards',
      }}
    >
      User Already Exists!Try Logging in
    </div>
  </div>
)}
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative transition-transform transform scale-100 hover:scale-[1.01] duration-300">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <button
            onClick={()=>{
              setName("");
              setPass("");
              setEmail("");
              onClose();
            }
          }
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-medium transition-colors duration-200"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold text-center text-[#0d9488] mb-6 tracking-tight">
            Create your Worque account
          </h2>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-teal-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0d9488] transition bg-teal-50/50 text-gray-800 text-base placeholder-gray-500"
              placeholder="Full Name"
            />
            <input
              type="text"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-teal-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0d9488] transition bg-teal-50/50 text-gray-800 text-base placeholder-gray-500"
              placeholder="Email"
            />
            <input
              type="password"
              value={pass}
              required
              onChange={(e) => setPass(e.target.value)}
              className="w-full border border-teal-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0d9488] transition bg-teal-50/50 text-gray-800 text-base placeholder-gray-500"
              placeholder="Password"
            />
            <button
              type="submit"
              className="w-full bg-[#7c3aed] text-white py-3 rounded-lg hover:bg-[#6d28d9] transition-all duration-300 font-medium text-base shadow-md hover:shadow-lg"
            >
              Sign Up
            </button>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(res) => {
                  verifyGoogleLogin(res.credential);
                }}
                onError={() => {
                  console.log("login failed!");
                }}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;