import React from 'react'
import { Link } from 'react-router'
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import Board from '../Kanban/Board';
import PreLogin from './PreLogin';
function HomePage() {
    const user=useSelector(state=>state.user);
    return (
    <div>
        <Navbar isLoggedIn={user.isLoggedIn} userName={user.uname}/>
        {!user.isLoggedIn && <PreLogin/>}
        {user.isLoggedIn && <Board />}
    </div>
  )
}

export default HomePage