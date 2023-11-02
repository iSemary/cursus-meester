import React from "react";
import { Alert } from "react-bootstrap";
import { ImSpinner10 } from "react-icons/im";

export default function BootstrapAlert({ text, type, loading = false }) {
    return (
        <Alert variant={type}>
            <div className="d-flex">
                {loading && (
                    <>
                        <span className="d-flex align-items-center">
                            <ImSpinner10 className="icon-spin-1" /> &nbsp;
                        </span>
                    </>
                )}
                <span>{text}</span>
            </div>
        </Alert>
    );
}
