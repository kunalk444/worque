import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveData } from '../slices/userSlice';
import '../App.css';
import { GoogleLogin } from '@react-oauth/google';

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
      dispatch(saveData({ uname: data.user.uname, email: data.user.email, isLoggedIn: true, id: data.user.id }));
      onClose();
      console.log(data.user.uname);
    }
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
      dispatch(saveData({ uname: res.uname, email: res.email, isLoggedIn: true, id: res.id }));
      onClose();
    }
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-[#0f172a]/70 backdrop-blur-sm flex items-center justify-center z-[100]">
      {flag && (
        <div className="absolute top-16 border border-red-500 text-white bg-red-600 px-6 py-2 rounded-lg shadow-lg font-medium z-[120]">
          Wrong Email or Password
        </div>
      )}

      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl z-[110]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-700 hover:text-red-600 text-lg font-medium transition-colors duration-200 z-[120]"
          >
            X
          </button>

          <h2 className="text-xl font-bold text-center text-gray-900 mb-5 tracking-tight">
            Login to Worque
          </h2>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 placeholder-gray-500"
              placeholder="Email"
            />

            <input
              type="password"
              value={pass}
              required
              onChange={(e) => setPass(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 placeholder-gray-500"
              placeholder="Password"
            />

            <button
              type="submit"
              className="w-full bg-emerald-700 text-white py-2 rounded-lg hover:bg-emerald-800 transition-all duration-300 font-medium shadow-md"
            >
              Login
            </button>

            <div className="flex justify-center mt-3">
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

export default Login;
