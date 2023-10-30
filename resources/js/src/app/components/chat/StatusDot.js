import React from "react";

export default function StatusDot({ status }) {
    return (
        <div className={"status-dot " + status.id} title={status.title}>
            <i className="pi-circle-fill"></i>
        </div>
    );
}
