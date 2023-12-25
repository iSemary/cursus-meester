"use client";
import Link from "next/link";
import { Button } from "primereact/button";
import React, { Suspense, useRef, useState } from "react";
import { useVisibility } from "../../components/utilities/dashboard/SidebarVisibility";
import { SplitButton } from "primereact/splitbutton";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRouter } from "next/navigation";
import axiosConfig from "../../components/axiosConfig/axiosConfig";
import { useAuth } from "../../components/hooks/AuthProvider";
import { useEffect } from "react";
import NotificationItem from "../../components/template/NotificationItem";
import { Token } from "../../components/utilities/Authentication/Token";
import Image from "next/image";
import { ImSpinner10 } from "react-icons/im";

export default function DashboardHeader() {
    const messagesPanel = useRef(null);
    const notificationsPanel = useRef(null);
    const { isVisible, setIsVisible } = useVisibility();
    const router = useRouter();
    const { user, loading } = useAuth(); // Get auth data
    const dropDownItems = [
        {
            label: "Settings",
            icon: "pi pi-cog",
            command: () => {
                router.push("/dashboard/settings");
            },
        },
        {
            label: "Logout",
            icon: "pi pi-times",
            command: () => {
                axiosConfig.post("/auth/logout").then(() => {
                    Token.explode();
                    window.location.href = "/";
                });
            },
        },
    ];

    useEffect(() => {
        console.log(user);
    }, [user]);

    const [tinyNotifications, setTinyNotifications] = useState([]);

    /** Mark notification as seen and update current state to be seen */
    const markAsSeen = (id) => {
        axiosConfig
            .post(`notifications/${id}/seen`)
            .then((response) => {
                const updatedNotifications = [...notifications];
                updatedNotifications.find(
                    (notification) => notification.id === id
                ).read_at = 1;
                setTinyNotifications(updatedNotifications);
            })
            .catch(({ error }) => {
                toastAlert("Something went wrong", "error");
            });
    };

    useEffect(() => {
        axiosConfig.get("notifications").then((response) => {
            setTinyNotifications(response.data.data.notifications.data);
        });
    }, []);

    return (
        <Suspense fallback={<h2>"Loading header..."</h2>}>
            <header className="px-3 mb-3 border-bottom">
                <div className="container mt-0 ">
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                        {/* Left Side */}
                        <Link
                            href="/dashboard/"
                            className="dashboard-logo-link"
                        >
                            {process.env.NEXT_PUBLIC_APP_NAME}
                        </Link>
                        <div className="col-12 col-lg-auto me-lg-auto mb-2 ">
                            <Button
                                icon="pi pi-bars"
                                onClick={() => setIsVisible(true)}
                                link
                            />
                        </div>
                        {/* Right Side */}
                        <div className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
                            <Button
                                icon="pi pi-bell"
                                link
                                size="large"
                                onClick={(e) =>
                                    notificationsPanel.current.toggle(e)
                                }
                            />
                            <OverlayPanel
                                ref={notificationsPanel}
                                className="notifications-header-container"
                            >
                                {tinyNotifications &&
                                tinyNotifications.length > 0 ? (
                                    <div className="tiny-notifications notifications-list dashboard">
                                        {tinyNotifications
                                            .slice(0, 5)
                                            .map((notification, index) => {
                                                return (
                                                    <NotificationItem
                                                        id={notification.id}
                                                        subject={
                                                            notification.subject
                                                        }
                                                        href={notification.href}
                                                        body={notification.body}
                                                        seen={
                                                            notification.read_at
                                                        }
                                                        createdDate={
                                                            notification.created_at
                                                        }
                                                        markAsSeen={markAsSeen}
                                                        createdDateDiff={
                                                            notification.created_at_diff
                                                        }
                                                    />
                                                );
                                            })}
                                    </div>
                                ) : (
                                    <p>There's no notifications yet</p>
                                )}

                                <div className="text-center">
                                    <Link
                                        href={"/dashboard/notifications"}
                                        className="p-button p-component p-button-link "
                                    >
                                        Open Notifications Center
                                    </Link>
                                </div>
                            </OverlayPanel>
                        </div>
                        <div className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
                            <Button
                                icon="pi pi-envelope"
                                onClick={(e) => messagesPanel.current.toggle(e)}
                                link
                                size="large"
                            />
                            <OverlayPanel ref={messagesPanel}>
                                <p>There's no messages yet</p>
                                <div className="text-center">
                                    <Link
                                        href={"/messages"}
                                        className="p-button p-component p-button-link "
                                    >
                                        Open Messenger
                                    </Link>
                                </div>
                            </OverlayPanel>
                        </div>
                        <div className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
                            <Link href="/dashboard/courses/create">
                                <Button
                                    label="Create new course"
                                    size="small"
                                />
                            </Link>
                        </div>
                        <div className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
                            {loading ? (
                                <ImSpinner10 className="icon-spin-1 text-primary" />
                            ) : (
                                <SplitButton
                                    label={
                                        <Link
                                            href={
                                                "/instructors/" +
                                                user?.data?.data?.user.username
                                            }
                                            target="_blank"
                                        >
                                            <Image
                                                src={
                                                    user?.data?.data
                                                        ?.instructor_profile
                                                        ?.avatar
                                                }
                                                alt="profile"
                                                width="32"
                                                height="32"
                                                className="rounded-circle"
                                            />
                                        </Link>
                                    }
                                    raised
                                    text
                                    className="header-split-button"
                                    size="small"
                                    rounded
                                    model={dropDownItems}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </Suspense>
    );
}
