// ViewTask.jsx
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getCurrTask, handleCompletedSubtasks } from '../addTaskHelper';
import Members from './Members';
import { useSelector, useDispatch } from 'react-redux';
import { addData } from '../slices/insideTask';
import AssignTasks from './AssignTasks';
import AddSubTask from './AddSubTask';
import Chat from './Chat';
import CompletedAllTasks from './CompletedAllTasks';

function ViewTask(props) {
  const [current, setCurrent] = useState(false);
  const [invited, setInvited] = useState(false);
  const { show, stopShow, taskId } = props;
  const [assignTaskFlag, setAssignTaskFlag] = useState(false);
  const [subtaskFlag, setSubtaskFlag] = useState(false);
  const [chatFlag, setChatFlag] = useState(false);
  const [completedAllTasks, setCompletedAllTasks] = useState(false);
  const user = useSelector(state => state.user);
  const currTask = useSelector(state => state.insideTask.taskData);
  const completed = (currTask && currTask.completed_subtasks) ? currTask.completed_subtasks.length : 0;
  const total = (currTask && currTask.sub_tasks) ? Object.keys(currTask.sub_tasks).length + completed : 0;
  const dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      (async () => {
        const arr = await getCurrTask(taskId);
        dispatch(addData(arr));
        localStorage.setItem("insideTaskVisible", "true");
      })();
    }
  }, [show]);

  const isVisible = localStorage.getItem("insideTaskVisible");
  if (!isVisible) return null;

  const modal = (
    <div
      className="fixed inset-0 flex justify-center items-center"
      style={{
        zIndex: 99999,
        pointerEvents: 'auto',
        isolation: 'isolate',
      }}
    >
   
      <div
        className="absolute inset-0 bg-[#1e293b]/50 backdrop-blur-sm"
        onClick={() => {
          dispatch(addData({}));
          localStorage.removeItem("insideTaskVisible");
          stopShow();
        }}
        style={{ zIndex: 50000 }}
      />

      
      <div
        className="relative bg-[#f1f5f9]/95 rounded-2xl p-8 max-w-5xl w-full shadow-xl h-[85vh] overflow-y-auto border-l-6 border-[#2dd4bf] "
        style={{ zIndex: 100000 }}
      >
    
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M0 0h20v20H0z%22 fill=%22none%22/%3E%3Ccircle cx=%221%22 cy=%221%22 r=%221%22 fill=%22rgba(45,212,191,0.05)%22/%3E%3Ccircle cx=%229%22 cy=%229%22 r=%221%22 fill=%22rgba(45,212,191,0.05)%22/%3E%3Ccircle cx=%2219%22 cy=%2219%22 r=%221%22 fill=%22rgba(45,212,191,0.05)%22/%3E%3C/svg%3E')] opacity-50 z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(45,212,191,0.1),transparent_70%)] animate-pulse-slow z-0"></div>

        <div className="relative z-[10]">
          <button
            onClick={() => {
              dispatch(addData({}));
              localStorage.removeItem("insideTaskVisible");
              stopShow();
            }}
            className="absolute top-4 right-4 text-2xl font-bold text-[#1e293b] hover:text-[#f87171] transition-all duration-300 bg-[#f1f5f9]/80 rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#2dd4bf]/20 hover:shadow-md z-[50]"
          >
            X
          </button>

          <h2 className="text-3xl font-extrabold text-[#1e293b] mb-6 tracking-tight">
            Task: {currTask ? currTask.task_description : "Loading..."}
          </h2>

          <h3 className="text-xl font-semibold text-[#1e293b] mb-6">
            Admin: {currTask && currTask.admin}
          </h3>

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-[#1e293b]">Subtasks:</h3>
              <div className="flex gap-3">
                <button
                  className="bg-[#2dd4bf] text-[#1e293b] px-6 py-2 rounded-xl hover:bg-[#f87171] hover:text-white transition-all duration-300 text-base font-semibold shadow-md"
                  onClick={() => setAssignTaskFlag(true)}
                >
                  Assign Sub-Tasks
                </button>

                <button
                  className="bg-[#2dd4bf] text-[#1e293b] px-6 py-2 rounded-xl hover:bg-[#f87171] hover:text-white transition-all duration-300 text-base font-semibold shadow-md"
                  onClick={() => setSubtaskFlag(true)}
                >
                  Add Sub-Tasks
                </button>
              </div>
          </div>

          <progress
            max={100}
            value={(total === 0) ? 0 : ((completed / total) * 100)}
            className="w-full h-3 rounded-full appearance-none overflow-hidden bg-[#1e293b]/20 [&::-webkit-progress-bar]:bg-[#1e293b]/20 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:bg-gradient-to-r [&::-webkit-progress-value]:from-[#2dd4bf] [&::-webkit-progress-value]:to-[#f87171] [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500 [&::-moz-progress-bar]:bg-gradient-to-r [&::-moz-progress-bar]:from-[#2dd4bf] [&::-moz-progress-bar]:to-[#f87171] [&::-moz-progress-bar]:rounded-full"
          />

          {currTask && currTask.sub_tasks && Object.keys(currTask.sub_tasks).map((element) => (
            <div
              key={element}
              className="flex items-center gap-4 mb-4 p-4 bg-[#2dd4bf]/10 rounded-xl hover:bg-[#2dd4bf]/20 transition-all duration-300 shadow-sm"
            >
              <input
                type="radio"
                name={`subtask-${taskId}`}
                className="w-6 h-6 accent-[#2dd4bf] cursor-pointer focus:ring-3 focus:ring-[#f87171]/40 transition-all duration-300 border-2 border-[#1e293b]/50 rounded-full"
                disabled={user.email !== currTask.sub_tasks[element]}
                onChange={async () => {
                  const res = await handleCompletedSubtasks(element, currTask._id);
                  dispatch(addData(res.newDoc));
                  if (res.ifAllTasksCompleted) setCompletedAllTasks(true);
                }}
              />
              <span className="text-lg font-medium text-[#1e293b]">{element}</span>
              {currTask.sub_tasks[element].length > 0 && (
                <p className="italic text-sm text-[#1e293b]/80 bg-white/80 px-3 py-1 rounded-full font-medium shadow-sm">
                  Assigned to {currTask.sub_tasks[element]}
                </p>
              )}
            </div>
          ))}

          {currTask && currTask.completed_subtasks &&
            currTask.completed_subtasks.map((ele) => (
              <div
                key={ele}
                className="flex items-center gap-3 mb-3 p-3 bg-[#f87171]/10 rounded-lg border-l-4 border-[#f87171] text-[#1e293b] font-medium shadow-sm"
              >
                <span className="text-xl">Done</span>
                <span className="line-through opacity-80">{ele}</span>
              </div>
            ))}

          <div className="mt-8 flex justify-center gap-4 max-sm:flex-col max-sm:gap-3">
            <button
              onClick={() => setCurrent(true)}
              className="bg-[#2dd4bf] text-[#1e293b] px-6 py-2 rounded-xl hover:bg-[#f87171] hover:text-white transition-all duration-300 text-base font-semibold shadow-md max-sm:w-full"
            >
              View Current Members
            </button>

            <button
              onClick={() => setChatFlag(true)}
              className="bg-[#2dd4bf] text-[#1e293b] px-6 py-2 rounded-xl hover:bg-[#f87171] hover:text-white transition-all duration-300 text-base font-semibold shadow-md max-sm:w-full"
            >
              Chat Room
            </button>

            {currTask && user.email === currTask.admin && (
              <button
                onClick={() => setInvited(true)}
                className="bg-[#2dd4bf] text-[#1e293b] px-6 py-2 rounded-xl hover:bg-[#f87171] hover:text-white transition-all duration-300 text-base font-semibold shadow-md max-sm:w-full"
              >
                View Invited Members
              </button>
            )}
          </div>
        </div>

      </div>

      {currTask && (
        <Members
          show={current}
          stopShow={() => setCurrent(false)}
          type="current"
          members={currTask.current_members}
          admin={currTask.admin}
          zIndexOverride="z-[200]"
        />
      )}

      {currTask && (
        <Members
          show={invited}
          stopShow={() => setInvited(false)}
          type="invited"
          members={currTask.invited_members}
          admin={currTask.admin}
          zIndexOverride="z-[200]"
        />
      )}

      {currTask && assignTaskFlag && (
        <AssignTasks show={assignTaskFlag} stopShow={() => setAssignTaskFlag(false)} zIndexOverride="z-[200]" />
      )}

      {currTask && subtaskFlag && (
        <AddSubTask show={subtaskFlag} stopShow={() => setSubtaskFlag(false)} zIndexOverride="z-[200]" />
      )}

      {<Chat show={chatFlag} stopShow={() => setChatFlag(false)} zIndexOverride="z-[200]" />}

      {completedAllTasks && (
        <CompletedAllTasks
          show={completedAllTasks}
          stopShow={() => setCompletedAllTasks(false)}
          taskId={currTask._id}
          zIndexOverride="z-[200]"
        />
      )}
    </div>
  );

  return createPortal(modal, document.body);
}

export default ViewTask;
