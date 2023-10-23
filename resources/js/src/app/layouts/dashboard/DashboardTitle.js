import React from "react";
import { BreadCrumb } from "primereact/breadcrumb";

export default function DashboardTitle({ title, path }) {
    const items = path.map((element, i) => {
        return { label: element.label, url: element.url };
    });
    const home = { icon: "pi pi-home", url: "/" };
    return (
        <div>
            <BreadCrumb model={items} home={home} />
            <h1>{title}</h1>
        </div>
    );
}
