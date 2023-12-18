import React, { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import io from "socket.io-client";

export default function MessageList({
    userDetails,
    messages,
    activeConversation,
}) {
    const [bubbles, setBubbles] = useState([]);
    const [joinedConversation, setJoinedConversation] = useState(false);
    const messagesRef = useRef(null);
    const audio = new Audio("/assets/sounds/message-sound.mp3");

    const port = process.env.NEXT_PUBLIC_SOCKET_PORT;
    const websocketURL = process.env.NEXT_PUBLIC_SOCKET_URL;
    const socket = io(websocketURL + ":" + port);

    useEffect(() => {
        const bubblesContent = messages
            .reverse()
            .map((message, i) => <MessageBubble message={message} />);
        setBubbles(bubblesContent);
    }, [messages]);

    useEffect(() => {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, [bubbles]);

    function playNotification() {
        audio.play();
    }

    const joinSocketConversation = (conversationId) => {
        socket.emit("joinConversation", conversationId);
    };

    // Append message bubble on new sockets event on same channel
    const listenForMessagesInConversation = () => {
        socket.on("privateMessage", (message) => {
            if (userDetails.id === message.sender_id) {
                let receivedMessage = message;
                receivedMessage["type"] = "in";
                appendMessageBubble(receivedMessage);
                playNotification();
            }
        });
    };

    const appendMessageBubble = (messageInstance) => {
        const appendedMessage = <MessageBubble message={messageInstance} />;
        setBubbles((prevBubbles) => [...prevBubbles, appendedMessage]);
    };

    useEffect(() => {
        if (activeConversation && userDetails?.id && !joinedConversation) {
            setJoinedConversation(true);
            joinSocketConversation(activeConversation);
            listenForMessagesInConversation();
        }
    }, [userDetails, activeConversation, joinedConversation]);

    return (
        <>
            <div className="message-list-container" ref={messagesRef}>
                {bubbles}
            </div>
            <MessageInput
                conversationId={activeConversation}
                appendMessageBubble={appendMessageBubble}
            />
        </>
    );
}
