import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveData } from '../slices/userSlice';
import '../App.css'

function Login({ show, onClose }) {
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [flag, setFlag] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/user/login", {
      method: "POST",
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ uemail: email, upass: pass }),
      credentials: "include",
    });
    const data = await res.json();
    if (!data.success) {
      setFlag(true);
      setTimeout(() => {
        setFlag(false);
      }, 1700);
      setEmail("");
      setPass("");
    }
    if (data.success) {
      console.log(data.id);
      dispatch(saveData({ uname: data.user.uname,email: data.user.email,isLoggedIn: true,id:data.user.id}));
      onClose();
      console.log(data.user.uname);
    }
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      {flag && (
        <div className="absolute top-20 border border-white text-white bg-[#7c3aed]/80 px-6 py-2 rounded-lg shadow-lg font-medium animate-pulse">
          Wrong Email or Password!
        </div>
      )}

      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative transition-transform transform scale-100 hover:scale-[1.01] duration-300">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-medium transition-colors duration-200"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold text-center text-[#0d9488] mb-6 tracking-tight">
            Login to your Worque account
          </h2>

          <div className="flex flex-col gap-4">
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
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;