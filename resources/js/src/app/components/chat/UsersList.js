import React, { useEffect, useState } from "react";
import UsersSearch from "./UsersSearch";

export default function UsersList({
    users,
    activeConversation,
    setActiveConversation,
}) {
    const [list, setList] = useState([]);

    // Set Active Conversation To the current user id
    // After that the chat history will appears in the right side
    const openChat = (userId) => {
        setActiveConversation(userId);
    };
    // Loop over user chat list
    useEffect(() => {
        if (users && users.length > 0) {
            const userList = users.map((user, i) => (
                <li
                    key={user.id}
                    onClick={(e) => openChat(user.id)}
                    className={
                        "d-grid" +
                        (activeConversation === user.id ? " active" : "")
                    }
                >
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <img
                                src={user.avatar}
                                alt={user.name}
                                width="32"
                                height="32"
                                className="rounded-circle"
                            />
                            <h6>{user.name}</h6>
                        </div>
                        <div>
                            <small>{user.timestamp}</small>
                        </div>
                    </div>
                    <div className="d-flex mt-2 mx-0">
                        <i className="pi pi-check mx-0"></i>
                        <p className="ms-2">{user.message}</p>
                    </div>
                </li>
            ));
            setList(userList);
        }
    }, [users, activeConversation]);

    return (
        <div className="chat-user-list">
            <UsersSearch />
            <ul>{list}</ul>
        </div>
    );
}
