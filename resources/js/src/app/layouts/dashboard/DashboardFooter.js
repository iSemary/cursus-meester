import React from "react";

export default function DashboardFooter() {
    return (
        <footer className="container d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
            <div className="col-md-4 d-flex align-items-center">
                <a
                    href="/"
                    className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1"
                >
                    <i className="pi pi-times"></i>
                </a>
                <span className="mb-3 mb-md-0 text-muted">
                    © 2023 - 2024 Cursus-Meester
                </span>
            </div>
        </footer>
    );
}
