import React from "react";

export default function ChatHeader({ userDetails }) {
    return (
        <div className="chat-header">
            <div className="d-flex align-items-center">
                <img
                    src={userDetails.avatar}
                    alt={userDetails.name}
                    width="50"
                    height="50"
                    className="rounded-circle"
                />
                <h3 className="ms-2">{userDetails.name}</h3>
            </div>
        </div>
    );
}
