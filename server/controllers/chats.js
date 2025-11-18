const {Server}=require("socket.io");
const taskModel=require("../models/tasks.js");
const userModel=require("../models/user.js");
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
            console.log("joined room!");
            socket.join(roomId);
            const online=io.sockets.adapter.rooms.get(roomId).size;
            io.to(roomId).emit("online-members",online);
                
        });

        socket.on("message",async({roomId,message,user})=>{
            const msgSaved = await taskModel.findOneAndUpdate(
                {
                    _id:roomId,
                },
                {
                    $push:{
                        chats:{user,message},
                    }
                }
            );
            console.log("message received from:",socket.id);
            io.to(roomId).emit("send-message-to-client",{user,message});
            
        });

        socket.on("is-typing",({name,email,roomId})=>{
            io.to(roomId).emit("is-typing",{name,email});
        });

        socket.on("done-typing",({roomId})=>{
            io.to(roomId).emit("done-typing",);
        });

        socket.on("voice-message",({roomId,name,audio})=>{
            
        })
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

async function getMembers(taskId){
    const arr=await taskModel.findOne(
        {
            _id:taskId
        },
        {
            current_members:1,
            _id:0,
        }
    );
    if(!arr)return {success:false};
    const ans=[];
    for(let i=0;i<arr.current_members.length;i++){
       
        const user=await userModel.findOne(
            {
                email:arr.current_members[i]
            },
            {
                uname:1,
                _id:0,
            }
        );
        ans.push(user.uname);
    }
    return {success:true,userArray:ans};
    
}

module.exports={
    handleChats,
    loadChats,
    getMembers,
}