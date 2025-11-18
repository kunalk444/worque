import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { initializeSocket, getSocket, disconnectSocket, loadChats, getMembers } from "./socketHelper.js";
import { createPortal } from "react-dom";
import { voiceRecorder } from "../voiceHelper.js";

let socket;

function Chat(props) {
  const task = useSelector(state => state.insideTask.taskData);
  const user = useSelector(state => state.user);

  const [online, setOnline] = useState(0);
  const [messages, setMessages] = useState([]);
  const [taskMembers, setTaskMembers] = useState([]);
  const [isTyping, setIsTyping] = useState();
  const inpRef = useRef();

  useEffect(() => {
    if (props.show) {
      if (!getSocket()) socket = initializeSocket();
      socket.emit("join-room", { roomId: task._id });

      socket.on("send-message-to-client", (message) => {
        setMessages(prev => [...prev, message]);
      });

      socket.on("online-members", (online) => {
        setOnline(online);
      });

      socket.on("is-typing", ({ name, email }) => {
        if (user.email !== email) {
          setIsTyping(`${name} is typing...`);
        }
      });

      socket.on("done-typing", () => {
        setIsTyping("");
      });

      async function chats() {
        const res = await loadChats(task._id);
        if (res?.success) setMessages(res.chats);
      }
      chats();

      return () => {
        socket.off();
        disconnectSocket();
      };
    }
  }, [props.show]);

  if (!props.show) return null;
  let recorder;
  let chunks=[];
  async function handleVoiceMessage(){
    if(!recorder)recorder=await voiceRecorder((chunk)=>chunks.push(chunk));
    recorder.start();
  }
  const handleVoiceMessageStop=async()=>{
    recorder && recorder.stop();
    const blob=new Blob(chunks,{"type":"audio/webm"});
    console.log(blob.type);
    const buffer=await blob.arrayBuffer(); 
    console.log(buffer);
    socket.emit("voice-message",(
      {
        roomId:task._id,
        name:user.uname,
        audio:buffer,
      }
    ));
    // const url=URL.createObjectURL(blob);
    // const audio = new Audio(url);
    // audio.play();

    chunks=[];
  }
  function handleClientMessage() {
    const message = inpRef.current.value;
    socket && socket.emit("message", { roomId: task._id, user: user.uname, message });
    inpRef.current.value = "";
  }

  async function handleTargetingUserAndShowisTyping() {
    const val = inpRef.current.value;
    if (val === '') setTaskMembers([]);
    if (val === '@') {
      const res = await getMembers(task._id);
      if (res.success) setTaskMembers(res.userArray);
    }
    if (val.length == 0) {
      socket && socket.emit("done-typing", { roomId: task._id });
    }
    if (val.length > 0) {
      socket && socket.emit("is-typing", { name: user.uname, email: user.email, roomId: task._id });
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-[#1e293b]/50 backdrop-blur-sm flex justify-center items-center z-[200000]">
      <div className="relative bg-[#f1f5f9]/95 rounded-2xl p-10 max-w-4xl w-full shadow-2xl h-[90vh] overflow-y-auto border-l-6 border-[#2dd4bf]">

        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M0 0h20v20H0z%22 fill=%22none%22/%3E%3Ccircle cx=%221%22 cy=%221%22 r=%221%22 fill=%22rgba(45,212,191,0.05)%22/%3E%3Ccircle cx=%229%22 cy=%229%22 r=%221%22 fill=%22rgba(45,212,191,0.05)%22/%3E%3Ccircle cx=%2219%22 cy=%2219%22 r=%221%22 fill=%22rgba(45,212,191,0.05)%22/%3E%3C/svg%3E')] opacity-40 z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(45,212,191,0.09),transparent_70%)] animate-pulse-slow z-0"></div>

        <div className="relative z-10">

          <button
            onClick={() => {
              setTaskMembers([]);
              props.stopShow();
            }}
            className="absolute top-5 right-5 text-2xl font-bold text-[#1e293b] hover:text-[#f87171] transition-all duration-300 bg-[#f1f5f9]/80 rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#2dd4bf]/20 hover:shadow-md"
          >
            X
          </button>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#1e293b] mb-1">
              Online Members:{" "}
              <span className="text-[#2dd4bf] font-bold">{online}</span>
            </h3>

            {isTyping && isTyping.length > 0 && (
              <h2 className="text-sm italic text-[#1e293b]/80 bg-white/70 px-3 py-1 rounded-lg shadow-sm w-fit">
                {isTyping}
              </h2>
            )}
          </div>

          <h2 className="text-3xl font-extrabold text-[#1e293b] mb-6 tracking-tight">Chat Room</h2>

          <div className="flex flex-col gap-4 mb-8 h-[60vh] overflow-y-auto pr-2">
            {messages.map((element, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl max-w-[70%] shadow-sm ${
                  element.user === user.uname
                    ? "bg-[#2dd4bf] text-[#1e293b] ml-auto"
                    : "bg-[#e2e8f0] text-[#1e293b]"
                }`}
              >
                <p className="text-sm font-semibold">{element.user}</p>
                <p className="text-base">{element.message}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={()=>{handleVoiceMessage()}}>Start Audio</button>
            <button onClick={()=>{handleVoiceMessageStop()}}>Stop Audio</button>
            <input
              type="text"
              placeholder="Enter message"
              ref={inpRef}
              onChange={handleTargetingUserAndShowisTyping}
              className="flex-1 border border-[#2dd4bf]/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2dd4bf] bg-[#f1f5f9] text-[#1e293b]"
            />
            <button
              onClick={handleClientMessage}
              className="bg-[#2dd4bf] hover:bg-[#f87171] text-[#1e293b] hover:text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Send
            </button>
          </div>

          {taskMembers.length > 0 && (
            <div className="absolute bottom-24 left-10 right-10 bg-white rounded-lg shadow-lg border border-[#2dd4bf]/30 max-h-40 overflow-y-auto z-20">
              <ul className="p-2">
                {taskMembers.map((member) => (
                  <li
                    key={member}
                    onClick={() => {
                      inpRef.current.value = `@${member} `;
                      setTaskMembers([]);
                    }}
                    className="px-4 py-2 hover:bg-[#2dd4bf]/10 cursor-pointer text-[#1e293b] font-medium rounded-lg"
                  >
                    {member}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
}

export default Chat;
