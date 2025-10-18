import React from 'react'
import Columns from './Columns'
import { useDispatch, useSelector } from 'react-redux'
import PreLogin from '../components/PreLogin';
import { loadSavedTasks } from '../boardHelper';
import { saveTasksInRedux } from '../slices/taskSlice';

function Board() {
  const dispatch=useDispatch();
  const user=useSelector(state=>state.user);
  if(!user)return <div><PreLogin /></div>
  let obj={};
  (async()=>{
    obj=await loadSavedTasks(user.email);
    dispatch(saveTasksInRedux(obj));
  })();
  
  return (
    <div className='board'>
        <Columns type="today"/>
        <Columns type="this_week"/>
        <Columns type="later"/>
    </div>
  )
}

export default Board