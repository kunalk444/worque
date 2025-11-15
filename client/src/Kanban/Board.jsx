import React, { useEffect,  } from 'react'
import Columns from './Columns'
import { useDispatch, useSelector } from 'react-redux'
import PreLogin from '../components/PreLogin';
import { loadSavedTasks } from '../boardHelper';
import { saveTasksInRedux } from '../slices/taskSlice';
import { DndContext, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrop } from 'react-dnd';
import { handleDraggedTask } from './DraggedTaskHandler';


function DroppableColumn(props){
  const type=props.type;
  const dispatch=useDispatch();
   const user=useSelector(state=>state.user);
  const [,dropRef]=useDrop(()=>({
        accept:'Task-Item',
        drop:async(droppedTask)=>{
            const res=await handleDraggedTask(droppedTask.id,type,user.email);
            if(res.success){
              const data=await loadSavedTasks(user.email);
              dispatch(saveTasksInRedux(data));
            }
        },
    }));
  return(
      <div ref={dropRef}>
          <Columns type={type}/> 
      </div>
  )
}
function Board() {
  const dispatch=useDispatch();
  const user=useSelector(state=>state.user);
  const priority=["today","this_week","later"];
  
  useEffect(()=>{
    (async()=>{
      let obj=await loadSavedTasks(user.email);
      dispatch(saveTasksInRedux(obj));
    })();
    },[]);
  return (
      <div className='board'>
            {
              priority && priority.map((element,index)=>{
                return <div key={index}><DroppableColumn type={element} /></div>
              })
            }
      </div>
  )
}

export default Board