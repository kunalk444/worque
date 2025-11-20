import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addData } from '../slices/insideTask';

function AddSubTask({ show, stopShow }) {
  const descRef = useRef(null);
  const taskId = useSelector(state => state.insideTask.taskData._id);
  const dispatch = useDispatch();
  const [msg, setMsg] = useState('');

  async function handleAddSubtask(desc) {
    const data = await fetch("http://localhost:5000/tasks/addsubtasks", {
      method: "POST",
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ taskId, desc }),
      credentials: 'include'
    });
    const res = await data.json();

    if (res.success) {
      res.newDoc.isVisible = true;
      dispatch(addData(res.newDoc));
      setMsg("Sub-Task Added!");
    } else {
      setMsg("Sub-Task Not Added");
    }
  }

  msg && setTimeout(() => setMsg(""), 1700);

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#1e293b]/85 backdrop-blur-xl z-[500000]" onClick={stopShow} />

      <div className="fixed inset-0 flex items-center justify-center z-[500001] pointer-events-none">
        <div className="bg-[#ffffff] rounded-2xl p-10 w-full max-w-lg shadow-2xl pointer-events-auto
                        border-4 border-[#14b8a6]/50 relative overflow-hidden
                        bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M0 0h20v20H0z%22 fill=%22none%22/%3E%3Ccircle cx=%221%22 cy=%221%22 r=%221%22 fill=%22rgba(20,184,166,0.12)%22/%3E%3Ccircle cx=%229%22 cy=%229%22 r=%221%22 fill=%22rgba(20,184,166,0.12)%22/%3E%3Ccircle cx=%2219%22 cy=%2219%22 r=%221%22 fill=%22rgba(20,184,166,0.12)%22/%3E%3C/svg%3E')] 
                        bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.22),transparent_70%)]
                        shadow-2xl ring-8 ring-[#14b8a6]/15">

          {msg && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-[#14b8a6] text-white px-10 py-4 
                            rounded-full font-bold text-xl shadow-2xl animate-bounce z-50">
              {msg}
            </div>
          )}

          <button
            onClick={stopShow}
            className="absolute top-6 right-6 w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm 
                       flex items-center justify-center text-[#0f172a] hover:text-[#ef4444] 
                       text-4xl font-bold shadow-2xl hover:scale-110 transition-all z-50"
          >
            X
          </button>

          <h2 className="text-4xl font-extrabold text-[#0f172a] text-center mb-10 tracking-tight">
            Add Sub-Task
          </h2>

          <div className="flex gap-5 items-center">
            <input
              type="text"
              placeholder="Enter Sub-Task Description"
              ref={descRef}
              className="flex-1 px-7 py-5 rounded-2xl border-4 border-[#0f172a]/20 
                         focus:outline-none focus:ring-4 focus:ring-[#14b8a6]/50 
                         bg-white/90 text-[#0f172a] font-semibold text-lg shadow-inner placeholder-[#0f172a]/50"
            />
            <button
              onClick={() => {
                const value = descRef.current.value.trim();
                if (value) {
                  handleAddSubtask(value);
                  descRef.current.value = "";
                }
              }}
              className="px-10 py-5 bg-[#14b8a6] text-white font-extrabold text-xl rounded-2xl 
                         hover:bg-[#ef4444] hover:shadow-2xl hover:scale-105 
                         transition-all duration-300 shadow-xl"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddSubTask;