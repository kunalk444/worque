import React, { useEffect } from 'react';
import Columns from './Columns';
import { useDispatch, useSelector } from 'react-redux';
import PreLogin from '../components/PreLogin';
import { loadSavedTasks } from '../boardHelper';
import { saveTasksInRedux } from '../slices/taskSlice';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrop } from 'react-dnd';
import { handleDraggedTask } from './DraggedTaskHandler';

function DroppableColumn(props) {
  const type = props.type;
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [, dropRef] = useDrop(() => ({
    accept: 'Task-Item',
    drop: async (droppedTask) => {
      const res = await handleDraggedTask(droppedTask.id, type, user.email);
      if (res.success) {
        const data = await loadSavedTasks(user.email);
        dispatch(saveTasksInRedux(data));
      }
    },
  }));

  return (
    <div ref={dropRef} className="flex-1 min-w-[300px] max-w-[340px] mx-3">
      <Columns type={type} />
    </div>
  );
}

function Board() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const priority = ["today", "this_week", "later"];

  useEffect(() => {
    (async () => {
      let obj = await loadSavedTasks(user.email);
      dispatch(saveTasksInRedux(obj));
    })();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-[#1e293b] flex flex-col items-center py-16 px-6 relative overflow-hidden">

        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M0 0h20v20H0z%22 fill=%22none%22/%3E%3Ccircle cx=%221%22 cy=%221%22 r=%221%22 fill=%22rgba(20,184,166,0.1)%22/%3E%3Ccircle cx=%229%22 cy=%229%22 r=%221%22 fill=%22rgba(20,184,166,0.1)%22/%3E%3Ccircle cx=%2219%22 cy=%2219%22 r=%221%22 fill=%22rgba(20,184,166,0.1)%22/%3E%3C/svg%3E')] opacity-50" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(20,184,166,0.18),transparent_70%)] animate-pulse-slow" />

        <div className="max-w-6xl w-full text-center mb-12 z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#ffffff] mb-4 tracking-tight drop-shadow-lg animate-fade-in">
            Your Worque Workspace
          </h1>
          <p className="text-lg md:text-xl text-[#14b8a6] font-semibold animate-fade-in-delayed">
            Organize tasks, collaborate seamlessly, succeed together.
          </p>
          <div className="mt-6 h-1 w-32 mx-auto bg-gradient-to-r from-[#14b8a6] to-[#ef4444] rounded-full animate-pulse" />
        </div>

        <div className="flex flex-col md:flex-row gap-8 w-full max-w-[1080px] justify-center z-10">
          {priority.map((element, index) => (
            <DroppableColumn key={index} type={element} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

export default Board;