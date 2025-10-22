import React, { useRef, useState } from 'react'
import { addSubTask, saveTaskInfo, sendEmail } from '../addTaskHelper';
import { useSelector } from 'react-redux';

function Addtask({ priority, stopShow, show }) {
    const user=useSelector(state=>state.user);
    const [member,addMember]=useState("");
    const [subtaskFlag,setSubtaskFlag]=useState(false);
    const[memberFlag,setMemberFlag]=useState(false);
    const [taskFlag,setTaskFlag]=useState(false);
    const descriptionRef=useRef("");
    const subRef=useRef("");
    if (!show) return null;
    const handleSubmit = async(e) => {
      e.preventDefault();  
      const done=await saveTaskInfo(priority,descriptionRef.current.value,user.email);
        if(done){
          stopShow;
          setTaskFlag(true); 
        }
  }
    if(subtaskFlag){
        setTimeout(()=>{
            setSubtaskFlag(false);
        },1800);
    }
    if(memberFlag){
        setTimeout(()=>{
            setMemberFlag(false);
        },1800);
    }
    if(taskFlag){
         setTimeout(()=>{
            setTaskFlag(false);
        },1800);
    }
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
    {
      subtaskFlag && <h2 className="fixed top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          Subtask added!
      </h2>
    }
    {
      memberFlag && <h2 className="fixed top-10 left-1/2 -translate-x-1/2 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          Email data saved! Request will be sent once task is added!
      </h2>
    }
    {
      taskFlag && <h2 className="fixed top-10 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          Task added successfully!
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
            ref={descriptionRef}
            required
          />

          <div className="flex gap-4 mb-4">
            <input
              placeholder="Add sub-tasks"
              className="flex-1 p-4 rounded-lg border border-gray-300 outline-none text-lg"
              ref={subRef}    
            />
            <button className="bg-blue-500 text-white rounded-lg px-6 py-3 hover:bg-blue-600 transition-colors text-lg"
                onClick={()=>{
                    const done=addSubTask(subRef.current.value);
                    subRef.current.value="";
                    if(done)setSubtaskFlag(true);
                }}
                type='button'
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
                type='button'
              >
                Send Request!
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-green-500 text-white rounded-lg px-6 py-4 hover:bg-green-600 transition-colors text-lg">
            Create Task!
          </button>
        </form>
      </div>
    </div>
  )
}

export default Addtask
