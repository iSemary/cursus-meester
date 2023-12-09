import React from "react";

export default function MessageBubble({ message }) {
    return (
        <div className={"message-bubble " + message.type}>
            <div className="message-content">
                <p>{message.message_text}</p>
                <small>{message.timestamp}</small>
            </div>
        </div>
    );
}
