"use client";
import Link from "next/link";
import { Button } from "primereact/button";
import React, { Suspense } from "react";
import { useVisibility } from "../../components/utilities/dashboard/SidebarVisibility";
import { Dropdown } from "react-bootstrap";

export default function DashboardHeader() {
    const { isVisible, setIsVisible } = useVisibility();

    return (
        <Suspense fallback={<h2>"Loading header..."</h2>}>
            <header className="p-3 mb-3 border-bottom">
                <div className="container mt-0 ">
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                        <a
                            href="/"
                            className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none"
                        >
                            <i className="pi pi-user"></i>
                        </a>
                        <div className="col-12 col-lg-auto me-lg-auto mb-2 ">
                            <Button
                                icon="pi pi-bars"
                                onClick={() => setIsVisible(true)}
                                className="btn btn-sm"
                                unstyled={true}
                            />
                        </div>
                        <div className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
                            <Link
                                href="/dashboard/courses/create"
                                className="btn btn-sm btn-primary"
                            >
                                Create new course
                            </Link>
                        </div>

                        <Dropdown>
                            <Dropdown.Toggle variant="" id="dropdown-basic">
                                <img
                                    src="https://github.com/mdo.png"
                                    alt="mdo"
                                    width="32"
                                    height="32"
                                    className="rounded-circle"
                                />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="#">Profile</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#">Sign out</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </header>
        </Suspense>
    );
}
