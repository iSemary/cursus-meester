import React, { useState } from "react";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import "bootstrap/dist/css/bootstrap-utilities.min.css";
import "public/assets/css/panel.css";
import "gridjs/dist/theme/mermaid.css";
import DashboardSidebar from "../layouts/dashboard/DashboardSidebar";
import DashboardHeader from "../layouts/dashboard/DashboardHeader";
import DashboardFooter from "../layouts/dashboard/DashboardFooter";
import { SidebarVisibility } from "../components/utilities/dashboard/SidebarVisibility";
import DashboardLoader from "../layouts/dashboard/DashboardLoader";
export default function DashboardTemplate({ children }) {
    const [loading, setLoading] = useState(true);
    setTimeout(() => {
        setLoading(false);
    }, 2000);

    return (
        <div className="dashboard-container">
            <SidebarVisibility>
                <DashboardHeader />
                <DashboardSidebar />
            </SidebarVisibility>
            <div className="container mt-0">
                {loading ? <DashboardLoader /> : children}
            </div>
            <DashboardFooter />
        </div>
    );
}
