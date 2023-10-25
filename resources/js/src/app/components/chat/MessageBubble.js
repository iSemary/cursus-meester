import React from "react";

export default function MessageBubble({ message }) {
    return (
        <div className={"message-bubble " + message.type}>
            <p>{message.text}</p>
            <small>{message.timestamp}</small>
        </div>
    );
}
