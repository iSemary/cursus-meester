import React from "react";
import { BreadCrumb } from "primereact/breadcrumb";
import Link from "next/link";

export default function DashboardTitle({ icon, title, path }) {
    const items = path.map((element, i) => {
        return { label: element.label, url: element.url };
    });
    const home = {
        icon: "pi pi-home",
        url: "/dashboard/",
    };
    return (
        <div>
            <BreadCrumb className="border-0" model={items} home={home} />
            <h1 className="d-flex align-items-center">
                {icon}
                &nbsp;
                {title}
            </h1>
        </div>
    );
}
