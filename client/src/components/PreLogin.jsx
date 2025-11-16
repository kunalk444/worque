import React from 'react';
import { useState } from 'react';
import Signup from './Signup';
import Login from './Login';

function PreLogin() {
  const [showSignup,setShowSignup]=useState(false);
  const [showLogin,setShowLogin]=useState(false);

  return (
    <div className="min-h-screen bg-[#1e293b] flex flex-col items-center justify-center p-8 relative overflow-hidden">
     
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M0 0h20v20H0z%22 fill=%22none%22/%3E%3Ccircle cx=%221%22 cy=%221%22 r=%221%22 fill=%22rgba(241,245,249,0.05)%22/%3E%3Ccircle cx=%229%22 cy=%229%22 r=%221%22 fill=%22rgba(241,245,249,0.05)%22/%3E%3Ccircle cx=%2219%22 cy=%2219%22 r=%221%22 fill=%22rgba(241,245,249,0.05)%22/%3E%3C/svg%3E')] opacity-50" />
    
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.2),transparent_70%)] animate-pulse-slow" />

      <div className="max-w-5xl w-full text-center z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#f1f5f9] mb-6 tracking-tight drop-shadow-lg animate-fade-in">
          Welcome to Worque
        </h1>
        <p className="text-xl md:text-2xl text-[#2dd4bf] mb-8 font-medium drop-shadow-md animate-fade-in-delayed">
          Streamline tasks and collaborate effortlessly with your team
        </p>
        <div className="space-y-6 mb-12">
          <p className="text-3xl md:text-4xl font-bold text-[#f87171] drop-shadow-lg animate-slide-up">
            "Plan. Track. Succeed."
          </p>
          <p className="text-lg md:text-xl text-[#f1f5f9]/80 italic font-light animate-slide-up-delayed">
            Your productivity hub for seamless teamwork
          </p>
        </div>
        <button
          className="bg-[#2dd4bf] text-[#1e293b] px-12 py-4 rounded-xl font-semibold text-xl transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(45,212,191,0.5)] hover:bg-[#f87171] hover:text-[#f1f5f9] hover:scale-105 animate-bounce-in"
          onClick={()=>setShowSignup(true)}
        >
          Get Started
        </button>
        <div className="mt-8 h-1 w-20 mx-auto bg-gradient-to-r from-[#2dd4bf] to-[#f87171] rounded-full animate-pulse" />
      </div>
       {showSignup && <Signup 
              show={showSignup} 
              onClose={()=>setShowSignup(false)}
              openLogin={()=>{
                  setShowSignup(false);
                  setShowLogin(true);
              }}
        />}
        {showLogin && <Login show={showLogin} onClose={()=>setShowLogin(false)}/>}
    </div>
  );
}

export default PreLogin;