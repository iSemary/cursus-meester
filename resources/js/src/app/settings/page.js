"use client";
import React, { useEffect, useState } from "react";
import StudentTemplate from "../Templates/StudentTemplate";
import Tab from "react-bootstrap/Tab";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Profile from "./tabs/Profile";
import Security from "./tabs/Security";
import LoginAttempt from "./tabs/LoginAttempt";
import PaymentHistory from "./tabs/PaymentHistory";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Settings() {
    const [settingTab, setSettingTab] = useState(null);
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get("tab") ?? "profile";
    const router = useRouter();
    useEffect(() => {
        setSettingTab(defaultTab);
    }, [defaultTab]);

    const handleChangeTab = (tabValue) => {
        setSettingTab(tabValue);
        router.push("?tab=" + tabValue);
    };

    return (
        <StudentTemplate>
            <div className="container settings-page">
                <Tab.Container
                    defaultActiveKey={settingTab}
                    activeKey={settingTab}
                >
                    <Row className="tabs-container">
                        <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="profile"
                                        onClick={() =>
                                            handleChangeTab("profile")
                                        }
                                    >
                                        Profile
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="security"
                                        onClick={() =>
                                            handleChangeTab("security")
                                        }
                                    >
                                        Security
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="login-attempt"
                                        onClick={() =>
                                            handleChangeTab("login-attempt")
                                        }
                                    >
                                        Login Attempt
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="payment-history"
                                        onClick={() =>
                                            handleChangeTab("payment-history")
                                        }
                                    >
                                        Payment History
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col sm={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="profile">
                                    {settingTab === "profile" && <Profile />}
                                </Tab.Pane>
                                <Tab.Pane eventKey="security">
                                    {settingTab === "security" && <Security />}
                                </Tab.Pane>
                                <Tab.Pane eventKey="login-attempt">
                                    {settingTab === "login-attempt" && (<LoginAttempt />)}
                                </Tab.Pane>
                                <Tab.Pane eventKey="payment-history">
                                    {settingTab === "payment-history" && (<PaymentHistory />)}
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        </StudentTemplate>
    );
}
