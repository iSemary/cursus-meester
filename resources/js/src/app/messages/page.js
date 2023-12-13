"use client";
import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useState } from "react";
import DashboardTemplate from "../Templates/DashboardTemplate";
import StudentTemplate from "../Templates/StudentTemplate";
import UsersList from "../components/chat/UsersList";
import ChatScreen from "../components/chat/ChatScreen";

export default function Messages() {
    // Current Active Conversation
    const [ActiveConversation, setActiveConversation] = useState(null);

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
