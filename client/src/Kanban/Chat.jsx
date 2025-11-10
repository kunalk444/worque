import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { initializeSocket, getSocket, disconnectSocket, loadChats, getMembers } from "./socketHelper.js";
import { useState } from "react";

let socket;

function Chat(props) {
  const task = useSelector(state => state.insideTask.taskData);
  const user = useSelector(state => state.user);
  const [messages, setMessages] = useState([]);
  const [taskMembers, setTaskMembers] = useState([]);
  const inpRef = useRef();

  useEffect(() => {
    if (props.show) {
      if (!getSocket()) socket = initializeSocket();
      
      socket.emit("join-room", { roomId: task._id });
      
      socket.on("send-message-to-client", (message) => {
        console.log(message);
        setMessages(messages => [...messages, message]);
      });

      async function chats() {
        const obj = await loadChats(task._id);
        obj && obj.success && setMessages(obj.chats);
        console.log(obj.chats);
        if (!obj.success) console.log("unable to retrieve chats!");
      }
      chats();

      return () => {
        socket.off();
        disconnectSocket();
      };
    }
  }, [props.show]);

  if (!props.show) return null;

  function handleClientMessage() {
    const message = inpRef.current.value;
    socket && socket.emit("message", { roomId: task._id, user: user.uname, message });
    inpRef.current.value = "";
  }


  async function handleTargetingUser() {
    const val = inpRef.current.value;
    if (val === '') setTaskMembers([]);
    if (val === '@') {
      const arr = await getMembers(task._id);
      if (arr.success) setTaskMembers(arr.userArray);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-12 max-w-6xl w-full shadow-xl relative h-[95vh] overflow-y-auto border-l-4 border-[#0d9488]">
        <button
          onClick={() => {
            setTaskMembers([]);
            props.stopShow();
          }}
          className="absolute top-8 right-8 text-4xl font-bold text-gray-700 hover:text-gray-900 transition-colors duration-300 bg-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100"
        >
          X
        </button>
        <h2 className="text-4xl font-extrabold text-[#0d9488] mb-10 tracking-wide">Task Chat</h2>
        <div className="flex flex-col gap-4 mb-8 h-[70vh] overflow-y-auto">
          {messages &&
            messages.map((element, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg max-w-[70%] ${
                  element.user === user.uname
                    ? 'bg-[#0d9488] text-white ml-auto'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm font-semibold">{element.user}</p>
                <p className="text-base">{element.message}</p>
              </div>
            ))}
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter message"
            ref={inpRef}
            onChange={handleTargetingUser}
            className="flex-1 border border-teal-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0d9488] bg-teal-50/50 text-gray-800 placeholder-gray-500"
          />
          <button
            onClick={handleClientMessage}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
          >
            Send
          </button>
        </div>
        {taskMembers.length > 0 && (
          <div className="absolute bottom-24 left-12 right-12 bg-white rounded-lg shadow-lg border border-teal-200 max-h-40 overflow-y-auto">
            <ul className="p-2">
              {taskMembers.map((member) => (
                <li
                  key={member}
                  onClick={() => {
                    inpRef.current.value = `@${member} `;
                    setTaskMembers([]);
                  }}
                  className="px-4 py-2 hover:bg-teal-50 cursor-pointer text-gray-800 font-medium"
                >
                  {member}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;