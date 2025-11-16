import React from "react";
import Signup from './Signup';
import Login from './Login';
import { useDispatch } from "react-redux";
import { logout } from "../slices/userSlice";
import { Link } from "react-router";

const Navbar = ({ isLoggedIn, userName }) => {
    const dispatch = useDispatch();    
    const handleLogout = async () => {
        const res = await fetch("http://localhost:5000/user/logout", {
            method: "POST",
            credentials: "include"
        });
        const msg = await res.json();
        if (msg.success) console.log("logged out!");
        dispatch(logout());
    };

    return (
        <nav className="flex justify-between items-center px-10 py-5 bg-[#1e293b] text-[#f1f5f9] shadow-xl z-50">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M0 0h20v20H0z%22 fill=%22none%22/%3E%3Ccircle cx=%221%22 cy=%221%22 r=%221%22 fill=%22rgba(241,245,249,0.05)%22/%3E%3Ccircle cx=%229%22 cy=%229%22 r=%221%22 fill=%22rgba(241,245,249,0.05)%22/%3E%3Ccircle cx=%2219%22 cy=%2219%22 r=%221%22 fill=%22rgba(241,245,249,0.05)%22/%3E%3C/svg%3E')] opacity-50"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(45,212,191,0.15),transparent_70%)] animate-pulse"></div>
            <div className="text-3xl font-extrabold tracking-tight z-10">
                <Link to="/" className="hover:text-[#2dd4bf] transition-colors duration-300">
                    Worque
                </Link>
            </div>
            {(!isLoggedIn) ? (
                <a href="https://github.com/kunalk444/worque" target="_blank" className="z-10">Github</a>
            )
               : (
                <div className="flex items-center gap-10 z-10">
                    <Link 
                        to="/notifications"
                        className="text-[#f1f5f9] text-base font-semibold hover:text-[#2dd4bf] transition-all duration-300 relative group"
                    >
                        Notifications
                        <span className="absolute left-0 bottom-[-2px] w-full h-0.5 bg-[#2dd4bf] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </Link>
                    <Link 
                        to="/pendingrequests"
                        className="text-[#f1f5f9] text-base font-semibold hover:text-[#2dd4bf] transition-all duration-300 relative group"
                    >
                        Pending
                        <span className="absolute left-0 bottom-[-2px] w-full h-0.5 bg-[#2dd4bf] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </Link>
                    <h2 className="text-[#f1f5f9] text-lg font-semibold">
                        Hello, {userName}
                    </h2>
                    <button 
                        onClick={() => { handleLogout() }}
                        className="px-6 py-3 rounded-xl text-base font-semibold bg-transparent border-2 border-[#f1f5f9]/70 text-[#f1f5f9] hover:bg-[#f87171]/20 hover:border-[#2dd4bf] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;