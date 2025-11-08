import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import  { initializeSocket,getSocket, disconnectSocket, loadChats } from "./socketHelper.js";
import { useState } from "react";
let socket;
function Chat(props) {
 
  const task=useSelector(state=>state.insideTask.taskData);
  const user=useSelector(state=>state.user);
  const [roomFlag,setRoomFlag]=useState(false);
  const [messages,setMessages]=useState([]);
  const inpRef=useRef();
  useEffect(()=>{
    if(props.show){    
      
      if(!getSocket())socket=initializeSocket();

      socket.on("receiveMessage",(msg)=>{
        console.log(msg);
      });

      !roomFlag && handleRoomJoin();
      
      socket.on("send-message-to-client",(message)=>{  
        console.log(message);
        setMessages(messages=>{
          messages.push(message);
          return messages;
        });
      })

      async function chats(){
        const obj=await loadChats(task._id);
        obj && obj.success && setMessages(obj.chats);
        if(!obj.success)console.log("unable to retrieve chats!");
      }
      chats();
      return ()=>{
        disconnectSocket();
      }
    }

  },[props.show]);

  if(!props.show)return null;

  function handleClientMessage(){
    const message=inpRef.current.value;
    socket && socket.emit("message",{roomId:task._id,user:user.uname,message});   
  }

  function handleRoomJoin(){
      !roomFlag && socket && socket.emit("join-room",{roomId:task._id});
      setRoomFlag(true);
  }


  return (
    <div>
      <button onClick={props.stopShow}>
            X
      </button>
      
      {
        messages && messages.forEach((element)=>{
          element && Object.keys(element).forEach((key)=>{
                console.log(key,":",element[key])
            })
        })
      }
      
      <input type="text" placeholder="enter message" ref={inpRef}/>
      <button onClick={handleClientMessage}>
        Send
      </button>
    </div>
  )
}
export default Chat