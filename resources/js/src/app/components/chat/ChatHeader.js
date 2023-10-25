import React from "react";

export default function ChatHeader({ userDetails }) {
    return (
        <div className="chat-header">
            <div className="d-flex align-items-center">
                <img
                    src={userDetails.avatar}
                    alt={userDetails.name}
                    width="30"
                    height="30"
                    className="rounded-circle"
                />
                <h4 className="ms-2 my-0">{userDetails.name}</h4>
            </div>
        </div>
    );
}
