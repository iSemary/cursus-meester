"use client";
import Link from "next/link";
import { Button } from "primereact/button";
import React, { Suspense } from "react";
import { useVisibility } from "../../components/utilities/dashboard/SidebarVisibility";
import { SplitButton } from "primereact/splitbutton";

export default function DashboardHeader() {
    const { isVisible, setIsVisible } = useVisibility();
    const dropDownItems = [
        {
            label: "Settings",
            icon: "pi pi-refresh",
        },
        {
            label: "Logout",
            icon: "pi pi-times",
        },
    ];

    return (
        <Suspense fallback={<h2>"Loading header..."</h2>}>
            <header className="px-3 mb-3 border-bottom">
                <div className="container mt-0 ">
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                        {/* Left Side */}
                        <Link href="/dashboard/">
                            <i className="pi pi-user"></i>
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
                            <Button icon="pi pi-bell" link size="large" />
                        </div>
                        <div className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
                            <Button icon="pi pi-envelope" link size="large" />
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
                                    <Link href="/dashboard/profile">
                                        <img
                                            src="https://github.com/mdo.png"
                                            alt="mdo"
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
