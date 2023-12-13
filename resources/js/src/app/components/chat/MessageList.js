import React, { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList({ messages }) {
    const [bubbles, setBubbles] = useState([]);
    const messagesRef = useRef(null);
    useEffect(() => {
        const bubblesContent = messages
            .reverse()
            .map((message, i) => <MessageBubble message={message} />);
        setBubbles(bubblesContent);
    }, [messages]);

    useEffect(() => {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, [bubbles]);

    return (
        <div className="message-list-container" ref={messagesRef}>
            {bubbles}
        </div>
    );
}
