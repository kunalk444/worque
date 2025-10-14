import React, { useState } from 'react'
import { addSubTask, saveTaskInfo, sendEmail } from '../addTaskHelper';

function Addtask({ priority, stopShow, show }) {
    const [subTask,setSubTask]=useState("");
    const [member,addMember]=useState("");
    const [subtaskFlag,setSubtaskFlag]=useState(false);
    const[memberFlag,setMemberFlag]=useState(false);
    const [taskFlag,setTaskFlag]=useState(false);
    if (!show) return null;
    const handleSubmit = (e) => {
        e.preventDefault();
    }
    if(subtaskFlag){
        setTimeout(()=>{
            setSubtaskFlag(false);
        },1600);
    }
    if(memberFlag){
        setTimeout(()=>{
            setMemberFlag(false);
        },1600);
    }
    if(taskFlag){
         setTimeout(()=>{
            setTaskFlag(false);
        },1600);
    }
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      {
        subtaskFlag && <h2>
            subtask added!
        </h2>
      }
      {
        memberFlag && <h2>
            email data saved!request will be sent once task is added!
        </h2>
      }
      {
        taskFlag && <h2>
            task added successfully!
        </h2>
      }
      <div className="bg-white rounded-xl p-10 w-10/12 max-w-3xl shadow-lg relative">
        <button
          className="absolute top-5 right-5 text-2xl font-bold bg-transparent border-none cursor-pointer"
          onClick={stopShow}
        >
          X
        </button>

        <h2 className="text-2xl font-semibold mb-6">Add a task to: {priority}</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Enter task description"
            className="w-full p-4 mb-4 rounded-lg border border-gray-300 outline-none text-lg"
          />

          <div className="flex gap-4 mb-4">
            <input
              placeholder="Add sub-tasks"
              className="flex-1 p-4 rounded-lg border border-gray-300 outline-none text-lg"
              onChange={(e)=>{
                setSubTask(e.target.value);
              }}    
            />
            <button className="bg-blue-500 text-white rounded-lg px-6 py-3 hover:bg-blue-600 transition-colors text-lg"
                onClick={()=>{
                    const done=addSubTask(subTask);
                    if(done)setSubtaskFlag(true);
                }}
            >
              Add
            </button>
          </div>

          <div className="mb-4">
            <h4 className="mb-3 font-medium text-lg">Add members:</h4>
            <div className="flex gap-4">
              <input
                type='email'
                placeholder="Enter email id!"
                className="flex-1 p-4 rounded-lg border border-gray-300 outline-none text-lg"
                onChange={(e)=>{
                    addMember(e.target.value);
                }}
              />
              <button className="bg-blue-500 text-white rounded-lg px-6 py-3 hover:bg-blue-600 transition-colors text-lg"
                onClick={()=>{
                    const done=sendEmail(member);
                    if(done)setMemberFlag(done);
                }}
              >
                Send Request!
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-green-500 text-white rounded-lg px-6 py-4 hover:bg-green-600 transition-colors text-lg"
            onClick={async()=>{
                const done=await saveTaskInfo();
                if(done){
                    stopShow;
                    setTaskFlag(true); 
                }

            }}
          >
            Create Task!
          </button>
        </form>
      </div>
    </div>
  )
}

export default Addtask
