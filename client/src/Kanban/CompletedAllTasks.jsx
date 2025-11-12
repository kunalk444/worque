import React, { useState } from 'react';

async function deleteTasks(taskId) {
    try {
        const res = await fetch("http://localhost:5000/tasks/deletetask", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ taskId }),
            credentials: 'include',
        });
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

function CompletedAllTasks(props) {
  const [deleteNotif, setDeleteNotif] = useState(false);

  if (!props.show) return null;

  deleteNotif && setTimeout(() => {
        setDeleteNotif(false);
        props.stopShow();
        localStorage.removeItem("insideTaskVisible");
  }, 1700);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50">
      {deleteNotif && (
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none z-50">
          <div className="mt-4 px-5 py-2.5 rounded-lg font-semibold text-sm shadow-lg bg-emerald-100 text-emerald-800 animate-[fadeInOut_1.7s_ease-out_forwards]">
            Task Deleted Successfully!
          </div>
        </div>
      )}
      <div className="bg-white rounded-2xl p-12 max-w-6xl w-full shadow-xl relative border-l-4 border-[#0d9488]">
        <button
          onClick={props.stopShow}
          className="absolute top-8 right-8 text-4xl font-bold text-gray-700 hover:text-gray-900 transition-colors duration-300 bg-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100"
        >
          X
        </button>
        <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Congratulations! You have completed all the subtasks</h2>
        <div className="flex justify-center">
          <button
            onClick={async () => {
              const res = await deleteTasks(props.taskId);
              if (res.success) setDeleteNotif(true);
            }}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-4 rounded-xl font-medium transition-all shadow-md hover:shadow-lg text-xl"
          >
            Click to Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompletedAllTasks;