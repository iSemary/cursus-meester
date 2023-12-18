require("dotenv").config();

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const cors = require("cors");
const app = express();
const server = http.createServer(app);

app.use(
    cors({
        origin: "http://127.0.0.1:3000", // Allow requests from this origin
        methods: ["GET", "POST"], // Specify the allowed HTTP methods
        credentials: false, // Allow credentials, if needed
    })
);

const io = socketIO(server, {
    cors: {
        origin: "http://127.0.0.1:3000", // Allow requests from this origin
        methods: ["GET", "POST"], // Specify the allowed HTTP methods
        credentials: false, // Allow credentials, if needed
    },
});

// Connection event
io.on("connection", (socket) => {
    console.log("New client connected");
    // Disconnect event
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });

    // Join conversation
    socket.on("joinConversation", (conversationId) => {
        socket.join(conversationId);
        console.log(`User joined conversation: ${conversationId}`);
    });

    // Sending message event
    socket.on("sendMessage", ({ conversationId, message }) => {
        console.log(`New Message in conversation : ${message.message_text}`);
        io.to(conversationId).emit("privateMessage", message);
    });
});

const NODE_PORT = process.env.NODE_PORT;
server.listen(NODE_PORT, () => {
    console.log(`Socket.io server running on port ${NODE_PORT}`);
});
