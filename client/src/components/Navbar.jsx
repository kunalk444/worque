import React from "react";
import { useState } from "react";
import Signup from './Signup';
import Login from './Login';
import { useDispatch } from "react-redux";
import { logout } from "../slices/userSlice";
import { Link } from "react-router";

const Navbar = ({ isLoggedIn, userName }) => {
    const dispatch = useDispatch();
    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    
    const handleLogout = async () => {
        const res = await fetch("http://localhost:5000/user/logout", {
            method: "POST",
            credentials: "include"
        })
        const msg = await res.json();
        if (msg.success) console.log("logged out!");

        dispatch(logout());
    }

    return (
        <nav className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-[#0d9488] to-[#7c3aed] text-white shadow-lg">
            <div className="text-2xl font-extrabold tracking-tight">
                Worque
            </div>
            
            {(!isLoggedIn) ? (
                <div className="flex gap-4">
                    <button 
                        onClick={() => setShowSignup(true)}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium bg-white text-[#0d9488] hover:bg-gray-100 hover:scale-105 transition-all duration-300 ease-in-out shadow-md hover:shadow-xl"
                    >
                        Signup
                    </button>
                    <Signup show={showSignup} onClose={() => { setShowSignup(false) }} />
                    
                    <button 
                        onClick={() => setShowLogin(true)}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium bg-[#6d28d9] text-white hover:bg-[#5b21b6] hover:scale-105 transition-all duration-300 ease-in-out shadow-md hover:shadow-xl"
                    >
                        Login
                    </button>
                    <Login show={showLogin} onClose={() => { setShowLogin(false) }} />
                </div>
            ) : (
                <div className="flex items-center gap-8">
                    <Link to='/notifications'>
                        Notifications
                    </Link>
                    <Link 
                        to="/pendingrequests"
                        className="text-white text-sm font-medium hover:text-teal-100 transition-all duration-200 relative group"
                    >
                        Pending
                        <span className="absolute left-0 bottom-0 w-full h-0.5 bg-teal-100 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                    </Link>
                    <h2 className="text-white text-base font-medium flex items-center gap-2">
                        Hello {userName} <span className="text-xl">😎</span>
                    </h2>
                    <button 
                        onClick={() => { handleLogout() }}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium bg-transparent border border-white/50 text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 ease-in-out shadow-md hover:shadow-xl"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;