import React, { useEffect } from 'react'
import { Link } from 'react-router'
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { saveData } from '../slices/userSlice';
import { logout } from '../slices/userSlice';

function HomePage() {
    const user=useSelector(state=>state.user);
    const dispatch=useDispatch();
    useEffect(()=>{
      (async()=>{
        const res= await  fetch("http://localhost:5000/auth/verifytoken",{
          method:"POST",
          headers:{
            "Content-type":"application/json"
          },
          credentials:"include",
        });
        const userData=await res.json();
        if(!userData)dispatch(logout());
        dispatch(saveData({uname:userData.uname,email:userData.email,isLoggedIn:true}));
      })();
    },[dispatch,user]);
  return (
    <div>
        <Navbar isLoggedIn={user.isLoggedIn} userName={user.uname}/>
    </div>
  )
}

export default HomePage