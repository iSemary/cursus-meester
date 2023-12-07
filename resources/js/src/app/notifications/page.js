"use client";
import React, { useEffect, useState } from "react";
import StudentTemplate from "../Templates/StudentTemplate";
import Card from "react-bootstrap/Card";
import axiosConfig from "../components/axiosConfig/axiosConfig";
import toastAlert from "../components/utilities/Alert";
import CourseListLoader from "../components/loaders/CourseListLoader";
import NotificationItem from "../components/template/NotificationItem";
import { IoCodeDownloadOutline } from "react-icons/io5";

export default function notifications() {
    const [notifications, setNotifications] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totals, setTotals] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        appendMoreNotifications(currentPage);
    }, [currentPage]);

    /** Mark notification as seen and update current state to be seen */
    const markAsSeen = (id) => {
        axiosConfig
            .post(`notifications/${id}/seen`)
            .then((response) => {
                const updatedNotifications = [...notifications];
                updatedNotifications.find(
                    (notification) => notification.id === id
                ).read_at = 1;
                setNotifications(updatedNotifications);
            })
            .catch(({ error }) => {
                toastAlert("Something went wrong", "error");
            });
    };

    const appendMoreNotifications = (pageId) => {
        axiosConfig
            .get(`notifications?page=${pageId}`)
            .then((response) => {
                if (notifications) {
                    setNotifications((prevNotifications) => [
                        ...prevNotifications,
                        ...response.data.data.notifications.data,
                    ]);
                } else {
                    setNotifications(response.data.data.notifications.data);
                }
                setCurrentPage(response.data.data.notifications.current_page);
                setTotals(response.data.data.notifications.total);
                setLoading(false);
            })
            .catch((error) => {
                setNotifications([]);
                setLoading(false);
                console.log(error);
            });
    };

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
                            <div className="notifications-list">
                                {notifications.map((notification, index) => (
                                    <NotificationItem
                                        id={notification.id}
                                        subject={notification.subject}
                                        href={notification.href}
                                        body={notification.body}
                                        seen={notification.read_at}
                                        createdDate={notification.created_at}
                                        markAsSeen={markAsSeen}
                                        createdDateDiff={
                                            notification.created_at_diff
                                        }
                                    />
                                ))}

                                {totals !== notifications.length && (
                                    <div className="d-block">
                                        <button
                                            type="button"
                                            className="btn text-primary d-flex align-items-centner text-center m-auto"
                                            onClick={() =>
                                                setCurrentPage(currentPage + 1)
                                            }
                                        >
                                            <IoCodeDownloadOutline className="me-2" size={25} />{" "} Load more
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-center">
                                There's no notifications yet!
                            </p>
                        )
                    ) : (
                        ""
                    )}
                    {loading && <CourseListLoader />}
                </Card.Body>
            </Card>
        </StudentTemplate>
    );
}
