import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveData } from '../slices/userSlice';
import '../App.css'

function Signup({ show, onClose }) {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const handleSignup = async () => {
    const res = await fetch("http://localhost:5000/user/signup", {
      method: "POST",
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ uname: name, upass: pass, uemail: email }),
      credentials:"include",
    });
    const data = await res.json();
    if (data.success) {
      dispatch(saveData({ uname: name, email:email }));
      onClose();
      console.log(name);
      alert(`welcome to worque:${name}`);
    }
  }

  if (!show) return null;

return (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 ">
    <div className="bg-white rounded-3xl p-10 w-full max-w-lg shadow-2xl relative transition-transform transform scale-100 hover:scale-[1.02]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignup();
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-2xl"
        >
          ✕
        </button>

        <h2 className="text-3xl font-semibold text-center text-purple-700 mb-8 tracking-wide">
          Create your Worque account
        </h2>

        <div className="flex flex-col gap-5">
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-700 transition bg-purple-50 text-purple-900 text-lg"
            placeholder="Full Name"
          />
          <input
            type="text"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-700 transition bg-purple-50 text-purple-900 text-lg"
            placeholder="Email"
          />
          <input
            type="password"
            value={pass}
            required
            onChange={(e) => setPass(e.target.value)}
            className="w-full border border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-700 transition bg-purple-50 text-purple-900 text-lg"
            placeholder="Password"
          />
          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-3 rounded-xl hover:bg-purple-800 transition font-semibold text-lg shadow-md"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  </div>
);

}

export default Signup;
