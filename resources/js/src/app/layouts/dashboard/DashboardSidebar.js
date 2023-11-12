"use client";
import React, { useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { useVisibility } from "../../components/utilities/dashboard/SidebarVisibility";

const DashboardSidebar = () => {
    const { isVisible, setIsVisible } = useVisibility();
    // Sample menu items
    const items = [
        {
            label: "Dashboard",
            icon: "pi pi-home",
            url: "/dashboard/",
        },
        {
            label: "Courses",
            icon: "pi pi-shopping-cart",
            items: [
                {
                    label: "All Courses",
                    icon: "pi pi-list",
                    url: "/dashboard/courses",
                },
                {
                    label: "Create Course",
                    icon: "pi pi-user",
                    url: "/dashboard/courses/create",
                },
            ],
        },
        {
            label: "Lectures",
            icon: "pi pi-shopping-cart",
            items: [
                {
                    label: "All Lectures",
                    icon: "pi pi-list",
                    url: "/dashboard/lectures",
                },
            ],
        },
        {
            label: "Exams",
            icon: "pi pi-shopping-cart",
            items: [
                {
                    label: "All Exams",
                    icon: "pi pi-list",
                    url: "/dashboard/courses/all",
                },
                {
                    label: "Exam Results",
                    icon: "pi pi-list",
                    url: "/dashboard/courses/all",
                },
            ],
        },
        {
            label: "Payroll",
            icon: "pi pi-shopping-cart",
            items: [
                {
                    label: "Payroll",
                    icon: "pi pi-list",
                    url: "/dashboard/courses/all",
                },
                {
                    label: "Payment History",
                    icon: "pi pi-list",
                    url: "/dashboard/courses/all",
                },
            ],
        },
        {
            label: "Profile",
            icon: "pi pi-shopping-cart",
            items: [
                {
                    label: "Settings",
                    icon: "pi pi-list",
                    url: "/dashboard/settings",
                },
            ],
        },
    ];
    return (
        <div>
            <Sidebar
                visible={isVisible}
                onHide={() => setIsVisible(false)}
                className="dashboard-sidebar"
            >
                <Menu model={items} />
            </Sidebar>
        </div>
    );
};

export default DashboardSidebar;
