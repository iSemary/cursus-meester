import React from "react";
import { SplitButton } from "primereact/splitbutton";

export default function ActionColumn({id}) {
    const items = [
        {
            label: "Edit",
            icon: "pi pi-refresh",
        },
        {
            label: "Delete",
            icon: "pi pi-times",
        },
    ];

    return (
        <div className="card flex justify-content-center">
            <SplitButton
                pt={{
                    menu: {
                        className: "surface-ground",
                    },
                }}
                label="Save"
                icon="pi pi-plus"
                model={items}
            />
        </div>
    );
}
