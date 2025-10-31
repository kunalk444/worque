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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      {msg && (
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none z-50">
          <div
            className={`
              mt-4 px-5 py-2.5 rounded-lg font-semibold text-sm shadow-lg
            bg-emerald-100 text-emerald-800'
              animate-[fadeInOut_1.7s_ease-out_forwards]
            `}
          >
            {msg}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
        <button
          onClick={stopShow}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-medium"
        >
          X
        </button>

        <h2 className="text-2xl font-bold text-center text-[#0d9488] mb-6">
          Add Sub-Task
        </h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter Sub-Task Description"
            ref={descRef}
            className="flex-1 border border-teal-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0d9488] bg-teal-50/50 text-gray-800 placeholder-gray-500"
          />
          <button
            onClick={() => {
              handleAddSubtask(descRef.current.value.trim());
              descRef.current.value = "";
            }}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddSubTask;