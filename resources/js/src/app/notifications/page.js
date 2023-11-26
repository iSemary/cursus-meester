"use client";
import React, { useEffect, useState } from "react";
import StudentTemplate from "../Templates/StudentTemplate";
import Card from "react-bootstrap/Card";
import axiosConfig from "../components/axiosConfig/axiosConfig";
import toastAlert from "../components/utilities/Alert";
import CourseListLoader from "../components/loaders/CourseListLoader";
import NotificationItem from "../components/template/NotificationItem";

export default function notifications() {
    const [notifications, setNotifications] = useState(null);
    useEffect(() => {
        axiosConfig
            .get("notifications")
            .then((response) => {
                setNotifications(response.data.data.notifications.data);
            })
            .catch(({ error }) => {
                setNotifications([]);
                toastAlert("Something went wrong", "error");
            });
    }, []);
    return (
        <StudentTemplate>
            <Card className="w-75 m-auto">
                <Card.Header>
                    <Card.Title className="font-weight-bold">
                        Notifications Center
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    {notifications ? (
                        notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <NotificationItem
                                    subject={notification.subject}
                                    body={notification.body}
                                    seen={notification.read_at}
                                    createdDate={notification.created_at}
                                    createdDateDiff={
                                        notification.created_at_diff
                                    }
                                />
                            ))
                        ) : (
                            <p className="text-center">
                                There's no notifications yet!
                            </p>
                        )
                    ) : (
                        <CourseListLoader />
                    )}
                </Card.Body>
            </Card>
        </StudentTemplate>
    );
}
