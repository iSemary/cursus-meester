import React, { useEffect, useState } from "react";
import UsersSearch from "./UsersSearch";
import axiosConfig from "../axiosConfig/axiosConfig";

export default function UsersList({
    activeConversation,
    setActiveConversation,
}) {
    const [conversations, setConversations] = useState([]);
    const [list, setList] = useState([]);

    // Set Active Conversation To the current user id
    // After that the chat history will appears in the right side
    const openChat = (userId) => {
        setActiveConversation(userId);
    };

    useEffect(() => {
        // User List API
        axiosConfig
            .get("chat/conversations")
            .then((response) => {
                setConversations(response.data.data.conversations);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    // Loop over user chat list
    useEffect(() => {
        if (conversations && conversations.length > 0) {
            const userList = conversations.map((conversation, i) => (
                <li
                    key={conversation.id}
                    onClick={(e) => openChat(conversation.id)}
                    className={
                        "d-grid" +
                        (activeConversation === conversation.id ? " active" : "")
                    }
                >
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <img
                                src={conversation.user.base_avatar}
                                alt={conversation.user.full_name}
                                width="32"
                                height="32"
                                className="rounded-circle"
                            />
                            <h6>{conversation.user.full_name}</h6>
                        </div>
                        <div>
                            <small>{conversation?.latest_message?.updated_at_diff}</small>
                        </div>
                    </div>
                    <div className="d-flex mt-2 mx-0">
                        <i className="pi pi-check mx-0"></i>
                        <p className="ms-2">{conversation?.latest_message?.message_text}</p>
                    </div>
                </li>
            ));
            setList(userList);
        }
    }, [conversations, activeConversation]);

    return (
        <div className="chat-user-list">
            <UsersSearch />
            <ul>{list}</ul>
        </div>
    );
}
