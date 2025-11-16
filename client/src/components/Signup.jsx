import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveData } from '../slices/userSlice';
import '../App.css';
import { GoogleLogin } from '@react-oauth/google';

function Signup({ show, onClose, openLogin }) {
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [email, setEmail] = useState('');
  const [existingUserFlag, setExistingUserFlag] = useState(false);
  const dispatch = useDispatch();

  existingUserFlag && setTimeout(() => setExistingUserFlag(false), 1700);

  const handleSignup = async () => {
    const res = await fetch('http://localhost:5000/user/signup', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ uname: name, upass: pass, uemail: email }),
      credentials: 'include',
    });
    const data = await res.json();
    if (data.success) {
      dispatch(saveData({ uname: name, email: email, id: data.id }));
      onClose();
    }
    if (!data.success) setExistingUserFlag(true);
  };

  const verifyGoogleLogin = async (tokenId) => {
    const data = await fetch('http://localhost:5000/user/googleUser', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ token: tokenId }),
    });
    const res = await data.json();
    if (res.success) {
      dispatch(
        saveData({
          uname: res.uname,
          email: res.email,
          isLoggedIn: true,
          id: res.id,
        })
      );
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-[#0f172a]/70 backdrop-blur-sm flex items-center justify-center z-[100]">
      {existingUserFlag && (
        <div className="absolute top-16 border border-red-500 text-white bg-red-600 px-6 py-2 rounded-lg shadow-lg font-medium z-[120]">
          User Already Exists! Try Logging in
        </div>
      )}

      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl z-[110]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <button
            onClick={() => {
              setName('');
              setPass('');
              setEmail('');
              onClose();
            }}
            className="absolute top-3 right-3 text-gray-700 hover:text-red-600 text-lg font-medium transition-colors duration-200 z-[120]"
            type="button"
          >
            X
          </button>

          <h2 className="text-xl font-bold text-center text-gray-900 mb-5 tracking-tight">
            Create your Worque account
          </h2>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 placeholder-gray-500"
              placeholder="Full Name"
            />

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
              Sign Up
            </button>

            <div className="flex justify-center mt-3">
              <GoogleLogin
                onSuccess={(res) => {
                  verifyGoogleLogin(res.credential);
                }}
                onError={() => {
                  console.log('login failed!');
                }}
              />
            </div>

            <div className="flex items-center justify-center gap-2 mt-3">
              <h3 className="text-sm font-medium text-gray-800">
                Already a user?
              </h3>
              <button
                onClick={openLogin}
                type="button"
                className="text-emerald-700 hover:text-emerald-900 text-sm font-semibold transition-colors duration-200"
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
