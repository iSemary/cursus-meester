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
            url: "/dashboard/courses",
        },
    ];
    return (
        <div>
            <div
                style={{ display: isVisible ? "block" : "none" }}
                onHide={() => setIsVisible(false)}
            >
                <ul>
                    <li>Hello 1</li>
                    <li>Hello 1</li>
                    <li>Hello 1</li>
                    <li>Hello 1</li>
                    <li>Hello 1</li>
                    <li>Hello 1</li>
                </ul>
            </div>
            {/*             
            <Sidebar visible={isVisible} onHide={() => setIsVisible(false)}>
                <Menu model={items} />
            </Sidebar> */}
        </div>
    );
};

export default DashboardSidebar;
