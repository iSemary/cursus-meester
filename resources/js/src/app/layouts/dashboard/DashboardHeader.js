"use client";
import Link from "next/link";
import { Button } from "primereact/button";
import React, { Suspense, useRef } from "react";
import { useVisibility } from "../../components/utilities/dashboard/SidebarVisibility";
import { SplitButton } from "primereact/splitbutton";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRouter } from "next/navigation";
import axiosConfig from "../../components/axiosConfig/axiosConfig";
import { useAuth } from "../../components/hooks/AuthProvider";

export default function DashboardHeader() {
    const messagesPanel = useRef(null);
    const notificationsPanel = useRef(null);
    const { isVisible, setIsVisible } = useVisibility();
    const router = useRouter();
    const { user } = useAuth(); // Get auth data
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
                    router.push("/");
                });
            },
        },
    ];
    console.log(user);
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
                            <OverlayPanel ref={notificationsPanel}>
                                <p>There's no notifications yet</p>
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
                                        href={"/dashboard/messages"}
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
                            <SplitButton
                                label={
                                    <Link
                                        href={
                                            "/instructors/" +
                                            user?.data?.data?.user.username
                                        }
                                        target="_blank"
                                    >
                                        <img
                                            src={
                                                user?.data?.data
                                                    ?.instructor_profile.avatar
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
                        </div>
                    </div>
                </div>
            </header>
        </Suspense>
    );
}
