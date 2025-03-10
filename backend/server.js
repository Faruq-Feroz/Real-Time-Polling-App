const express=require("express");
require("dotenv").config();
const http=require("http");
const {Server}=require("socket.io");
const cors=require("cors");
const mongoose=require("mongoose");
const pollRoutes=require("./routes/polling");
const Polling=require("./models/Polling");

const app=express();
const server=http.createServer(app);
//setup socket io
const io=new Server(server,{
    cors:{
        origin:"*"
    }
});
//middleware
app.use(cors());
app.use(express.json());
app.use("/api/polls",pollRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB database connected"))
.catch(err=>console.error("MongoDB error",err));

app.set("io",io);

io.on("connection",(socket)=>{
    console.log(`User connected:${socket.id}`);
//set the socket on to allow user to vote
    socket.on("vote",async({pollId,option})=>{
        const poll=await Polling.findById(pollId);
        if(poll && poll.active){
            poll.votes.set(option,(poll.votes.get(option)||0)+1);
            await poll.save();
            io.emit("pollData",poll);//broadcasts the updated poll
        }
    });
    socket.on("disconnect",()=>{
        console.log(`The user is disconnected:${socket.id}`);
    });
});
const PORT=process.env.PORT || 4000;
server.listen(PORT,()=>console.log(`Server running on http://localhost:${PORT}`));