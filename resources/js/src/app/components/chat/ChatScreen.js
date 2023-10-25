"use client";
import React, { useEffect, useState } from "react";
import DefaultBackgroundScreen from "./DefaultBackgroundScreen";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import ChatHeader from "./ChatHeader";

export default function ChatScreen({ activeConversation }) {
    const [ChatMessages, setChatMessages] = useState([]);
    const [UserDetails, setUserDetails] = useState({});

    useEffect(() => {
        // TODO Call Get Messages API
        setChatMessages([
            {
                id: 100,
                text: "Hello From",
                timestamp: "10:15am",
                type: "in",
            },
            {
                id: 101,
                text: "Hello To",
                timestamp: "10:15am",
                type: "out",
            },
        ]);

        setUserDetails({
            id: 5,
            name: "Ahmed",
            avatar: "https://github.com/mdo.png",
        });
    }, [activeConversation]);

    return (
        <>
            {activeConversation ? (
                <div className="chat-screen">
                    <ChatHeader userDetails={UserDetails} />
                    <MessageList messages={ChatMessages} />
                    <MessageInput />
                </div>
            ) : (
                <DefaultBackgroundScreen />
            )}
        </>
    );
}
