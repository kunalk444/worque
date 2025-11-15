import React from 'react'
import { Link } from 'react-router'
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import Board from '../Kanban/Board';
import PreLogin from './PreLogin';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
function HomePage() {
    const user=useSelector(state=>state.user);
    return (
    <div>
        <DndProvider backend={HTML5Backend}>
          <Navbar isLoggedIn={user.isLoggedIn} userName={user.uname}/>
          {!user.isLoggedIn && <PreLogin/>}
          {user.isLoggedIn && <Board />}
        </DndProvider>
    </div>
  )
}

export default HomePage