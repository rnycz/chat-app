const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

const activeUsers = new Set();

io.on("connection", (socket) =>{
    console.log(`User connected: ${socket.id}`)

    socket.on("send_message", (data) =>{
        socket.to(data.room).emit("receive_message", data)
    })

    socket.on("join_room", (data) =>{
        socket.join(data)
        console.log(`User with ID: ${socket.id} joined room: ${data}`)
    })

    socket.on("who_join", (data) =>{
        socket.joinData = data;
        activeUsers.add(data);
        io.emit("who_join", [...activeUsers]);
    })

    socket.on("disconnect", () =>{
        activeUsers.delete(socket.joinData);
        io.emit("user_disconnected", socket.joinData);
        console.log("User disconnected", socket.id)
    })
})

server.listen(3001, () =>{
    console.log("SERVER RUNNING!")
})