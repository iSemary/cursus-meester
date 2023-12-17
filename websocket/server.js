const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

require('dotenv').config()

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Connection event
io.on("connection", (socket) => {
    console.log("New client connected");
    // Disconnect event
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
    // Sending message event
    socket.on("chat-message", (message) => {
        console.log(message);
        io.emit("chat message", message);
    });
});

const NODE_PORT = process.env.NODE_PORT;
server.listen(NODE_PORT, () => {
    console.log(`Socket.io server running on port ${NODE_PORT}`);
});
