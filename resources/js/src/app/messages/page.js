"use client";
import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useState } from "react";
import DashboardTemplate from "../Templates/DashboardTemplate";
import StudentTemplate from "../Templates/StudentTemplate";
import UsersList from "../components/chat/UsersList";
import ChatScreen from "../components/chat/ChatScreen";
import { useSearchParams } from "next/navigation";
import axiosConfig from "../components/axiosConfig/axiosConfig";

export default function Messages() {
    // Current Active Conversation
    const [ActiveConversation, setActiveConversation] = useState(null);
    const searchParams = useSearchParams();
    const toUsername = searchParams.get("to");

    useEffect(() => {
        if (toUsername && toUsername !== "") {
            // initiate or get conversation id
            axiosConfig
                .post("chat/initiate", { receiver_username: toUsername })
                .then((response) => {
                    setActiveConversation(response.data.data.conversation.id);
                })
                .catch((error) => console.error(error));
        }
    }, [toUsername]);

    return (
        <StudentTemplate>
            <Row className="chat-page-container">
                <Col md={4}>
                    <UsersList
                        activeConversation={ActiveConversation}
                        setActiveConversation={setActiveConversation}
                    />
                </Col>
                <Col md={8}>
                    <ChatScreen activeConversation={ActiveConversation} />
                </Col>
            </Row>
        </StudentTemplate>
    );
}
