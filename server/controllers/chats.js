const {Server}=require("socket.io");
const taskModel=require("../models/tasks.js");
function handleChats(server){
    const io=new Server(server,{
        cors:{
            origin:'http://localhost:5173',
            methods:['GET','POST'],
            credentials:true
        }
    })

    io.on("connection",(socket)=>{
        console.log("new connected!");

        socket.on("join-room",({roomId})=>{
            socket.join(roomId);
                
        });

        socket.on("message",async({roomId,message,user})=>{
            const msgSaved = await taskModel.findOneAndUpdate(
                {
                    _id:roomId,
                },
                {
                    $push:{
                        chats:{[user]:message},
                    }
                }
            );
            io.to(roomId).emit("send-message-to-client",{[user]:message});
            if(msgSaved)console.log("chat saved in db!");
        });


    });

}
async function loadChats(taskId) {
    const arr=await taskModel.findOne({
            _id:taskId
        },
        {
            chats:1,
            _id:0,
        }
    );
    if(arr)return {success:true,chats:arr.chats};
    return {success:false};
}
module.exports={
    handleChats,
    loadChats,
}