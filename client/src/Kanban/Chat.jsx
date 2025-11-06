import { useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socketHelper";

function Chat(props) {
 
  const task=useSelector(state=>state.insideTask.taskData);
  const user=useSelector(state=>state.user);
  useEffect(()=>{    
    socket.on("connect",()=>{
      socket.emit("message",`connected!`);
    })

    socket.on("receiveMessage",(msg)=>{
      console.log(msg);
    });

    socket.emit("join-room",{roomId:task._id});

    socket.emit("message",{roomId:task._id,user:user.uname,message:"yo wassup!"});
    
    return ()=>{
      socket.off();
    }

  },[]);
  if(!props.show)return;
  return (
    <div>
      <button onClick={props.stopShow}>
            X
      </button>
      Chatting!
    </div>
  )
}
export default Chat