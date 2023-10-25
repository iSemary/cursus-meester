import React, { useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList({ messages }) {
    const [Bubbles, setBubbles] = useState([]);
    useEffect(() => {
        const bubblesContent = messages.map((message, i) => (
            <MessageBubble message={message} />
        ));

        setBubbles(bubblesContent);
    }, [messages]);

    return <div className="message-list-container">{Bubbles}</div>;
}
