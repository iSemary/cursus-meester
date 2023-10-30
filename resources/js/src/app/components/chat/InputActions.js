import React, { useRef } from "react";
import { SpeedDial } from "primereact/speeddial";
import { Button } from "primereact/button";

export default function InputActions() {
    const toast = useRef(null);

    const items = [
        {
            label: "Add",
            icon: "pi pi-pencil",
            command: () => {
                toast.current.show({
                    severity: "info",
                    summary: "Add",
                    detail: "Data Added",
                });
            },
        },
        {
            label: "Update",
            icon: "pi pi-refresh",
            command: () => {
                toast.current.show({
                    severity: "success",
                    summary: "Update",
                    detail: "Data Updated",
                });
            },
        },
        {
            label: "Delete",
            icon: "pi pi-trash",
            command: () => {
                toast.current.show({
                    severity: "error",
                    summary: "Delete",
                    detail: "Data Deleted",
                });
            },
        },
        {
            label: "React Website",
            icon: "pi pi-external-link",
            command: () => {
                window.location.href = "https://facebook.github.io/react/";
            },
        },
    ];

    return (
        <>
            <div className="input-actions-container">
                <div className="speed-actions-container">
                    <SpeedDial
                        model={items}
                        className="speed-actions"
                        size="small"
                        showIcon
                        hideOnClickOutside
                        direction="up"
                        style={{ left: "calc(50% - 2rem)", bottom: 0 }}
                    />
                </div>
                <Button icon="pi pi-send" size="small" />
            </div>
        </>
    );
}
