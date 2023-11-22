import React from "react";
import { BreadCrumb } from "primereact/breadcrumb";

export default function DashboardTitle({ icon, title, path, buttons }) {
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
            <div className="row">
                <div className="col-6">
                    <h1 className="d-flex align-items-center">
                        {icon}
                        &nbsp;
                        {title}
                    </h1>
                </div>
                <div className="col-6 text-right">
                    {buttons &&
                        buttons.length > 0 &&
                        buttons.map((button, index) => {
                            return button;
                        })}
                </div>
            </div>
        </div>
    );
}
