import React from 'react'
import Columns from './Columns'
import { useSelector } from 'react-redux'
import PreLogin from '../components/PreLogin';
import { loadSavedTasks } from '../boardHelper';

function Board() {
  const user=useSelector(state=>state.user);
  if(!user)return <div><PreLogin /></div>
  const obj=loadSavedTasks(user.email);
  return (
    <div className='board'>
        <Columns type="today" />
        <Columns type="this week" />
        <Columns type="later" />
    </div>
  )
}

export default Board