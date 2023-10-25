"use client";
import React, { useEffect } from "react";
import DashboardTemplate from "../../Templates/DashboardTemplate";
import { Col, Row } from "react-bootstrap";
import UsersList from "../../components/chat/UsersList";
import ChatScreen from "../../components/chat/ChatScreen";
import { useState } from "react";

export default function Messages() {
    // Previous Users List
    const [Users, setUsers] = useState([]);

    // Current Active Conversation
    const [ActiveConversation, setActiveConversation] = useState(5); // TODO Set null

    useEffect(() => {
        // TODO CALL GET User List API
        setUsers([
            {
                id: 5,
                name: "Ahmed ali",
                timestamp: "15:10am",
                avatar: "https://github.com/mdo.png",
                message: "Hello from list new list",
            },
            {
                id: 6,
                name: "Ahmed ali",
                timestamp: "15:10am",
                avatar: "https://github.com/mdo.png",
                message: "Hello from list new list",
            },
            {
                id: 7,
                name: "Ahmed ali",
                timestamp: "15:10am",
                avatar: "https://github.com/mdo.png",
                message: "Hello from list new list",
            },
        ]);
    }, []);

    return (
        <DashboardTemplate>
            <Row>
                <Col md={4}>
                    <UsersList
                        users={Users}
                        activeConversation={ActiveConversation}
                        setActiveConversation={setActiveConversation}
                    />
                </Col>
                <Col md={8}>
                    <ChatScreen activeConversation={ActiveConversation} />
                </Col>
            </Row>
        </DashboardTemplate>
    );
}
