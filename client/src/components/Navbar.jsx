import React from "react";
import { useState } from "react";
import Signup from './Signup';
import Login from './Login';
import { useDispatch } from "react-redux";
import { logout } from "../slices/userSlice";

const Navbar = ({ isLoggedIn,userName }) => {
    const dispatch=useDispatch();
    const [showSignup,setShowSignup]=useState(false);
    const [showLogin,setShowLogin]=useState(false);
    const handleLogout=async()=>{
        const res=await fetch("http://localhost:5000/user/logout",{
            method:"POST",
            credentials:"include"
        })
        const msg=await res.json();
        if(msg.success)console.log("logged out!");

        dispatch(logout());
    }
  return (
    <nav style={styles.navbar}>
      <div style={styles.name}>Worque</div>
      {(!isLoggedIn)?
            <div style={styles.buttons}>
                <button onClick={()=>setShowSignup(true)}>
                    Signup
                </button>
                <Signup show={showSignup} onClose={()=>{setShowSignup(false)}}/>
                <button onClick={()=>setShowLogin(true)}>
                    Login
                </button>
            <Login show={showLogin} onClose={()=>{setShowLogin(false)}}/>
            </div>
            :<div>
                <h2>Hello {userName}😊</h2>
                <button onClick={()=>{handleLogout()}}>Logout!</button>
            </div>

      }
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#6a4fb4",
    color: "#fff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  },
  name: {
    fontSize: "1.3rem",
    fontWeight: "bold",
  },
  buttons: {
    display: "flex",
    gap: "0.75rem",
  },
  button: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
  },
  create: {
    backgroundColor: "#fff",
    color: "#6a4fb4",
  },
  login: {
    backgroundColor: "#4f2fb4",
    color: "#fff",
  },
};

export default Navbar;
