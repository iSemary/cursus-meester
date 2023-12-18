"use client";
import React, { useEffect, useState } from "react";
import DefaultBackgroundScreen from "./DefaultBackgroundScreen";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import ChatHeader from "./ChatHeader";
import axiosConfig from "../axiosConfig/axiosConfig";

export default function ChatScreen({ activeConversation }) {
    const [chatMessages, setChatMessages] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totals, setTotals] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeConversation) {
            // Call Get Messages API
            axiosConfig
                .get(`chat/conversations/${activeConversation}/messages`)
                .then((response) => {
                    setChatMessages(response.data.data.messages.data);
                    setUserDetails(response.data.data.user);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [activeConversation]);

    return (
        <>
            {activeConversation ? (
                <div className="chat-screen">
                    <ChatHeader userDetails={userDetails} />
                    <MessageList
                        userDetails={userDetails}
                        messages={chatMessages}
                        activeConversation={activeConversation}
                    />
                </div>
            ) : (
                <DefaultBackgroundScreen />
            )}
        </>
    );
}
