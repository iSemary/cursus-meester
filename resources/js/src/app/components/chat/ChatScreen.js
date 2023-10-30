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
            {
                id: 100,
                text: "Hello From",
                timestamp: "10:15am",
                type: "in",
            },
            {
                id: 101,
                text: "Hello To Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
                timestamp: "10:15am",
                type: "out",
            },
            {
                id: 100,
                text: "Hello Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                timestamp: "10:15am",
                type: "in",
            },
            {
                id: 101,
                text: "m is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industr",
                timestamp: "10:15am",
                type: "out",
            },
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
