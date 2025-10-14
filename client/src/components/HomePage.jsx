import React from 'react'
import { Link } from 'react-router'
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import Board from '../Kanban/Board';

function HomePage() {
    const user=useSelector(state=>state.user);
  return (
    <div>
        <Navbar isLoggedIn={user.isLoggedIn} userName={user.uname}/>
        <h1>{user.isLoggedIn}</h1>
        <h1>{user.uname}</h1>
        <Board />
    </div>
  )
}

export default HomePage