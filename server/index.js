const express=require("express");
const app=express();
const {authRouter}=require("./routes/auth.js");
const cors=require('cors');
const {userRouter}=require("./routes/user.js")
const {connectDb}=require("./connection.js");
const cookieParser=require("cookie-parser");
const {taskRouter}=require("./routes/tasks.js");

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
})

app.listen(5000,()=>{
    console.log("started");
})