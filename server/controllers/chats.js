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
            console.log(socket.rooms);    
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
            if(msgSaved)console.log("chat saved in db!");
        });


    });

}
module.exports={
    handleChats,
}