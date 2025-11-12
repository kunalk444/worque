const express=require("express");
const app=express();
const {authRouter}=require("./routes/auth.js");
const cors=require('cors');
const {userRouter}=require("./routes/user.js")
const {connectDb}=require("./connection.js");
const cookieParser=require("cookie-parser");
const {taskRouter}=require("./routes/tasks.js");
const http=require("http");
const {handleChats}=require("./controllers/chats.js");
const mongoose=require("mongoose");

app.use(express.json());
app.use(express.text());
app.use(cookieParser());
app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true,
    }
));
app.use("/auth",authRouter);
app.use("/user",userRouter);
app.use("/tasks",taskRouter);

connectDb("mongodb://127.0.0.1:27017/worque").
then(()=>{
    console.log("connected to db!")
}).
catch((err)=>{
    console.log("error:",err);
});

mongoose.connection.on("connected",()=>console.log("connected!"));

mongoose.connection.on("disconnected",()=>console.log("disconnected!"));

mongoose.connection.on("error",(err)=>console.log(err));


const server=http.createServer(app);

handleChats(server);

server.listen(5000,()=>{
    console.log("server running at 5000!");
});


const {handleCronJobs}=require("./controllers/cronJobs.js");
handleCronJobs();