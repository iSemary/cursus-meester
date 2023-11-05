"use client";
import React, { useEffect, useState } from "react";
import toastAlert from "../../components/utilities/Alert";
import StudentTemplate from "../../Templates/StudentTemplate";
import axios from "axios";
import TaskLoader from "../../components/loaders/TaskLoader";
import BootstrapAlert from "../../components/alerts/BootstrapAlert";

export default function VerifyEmail({ searchParams }) {
    const [verifyingStatus, setVerifyingStatus] = useState(null);
    useEffect(() => {
        if (searchParams.token) {
            if (searchParams.token === null) {
                handleTokenNotExists();
            } else {
                setVerifyingStatus(
                    <div className="w-50 m-auto">
                        <TaskLoader />
                        <br />
                        <BootstrapAlert
                            text="Please wait while verifying your email address"
                            type="secondary"
                            loading
                        />
                    </div>
                );
                verifyEmailToken(searchParams.token);
            }
        }
    }, [searchParams.token]);

    function handleTokenNotExists() {
        setVerifyingStatus(
            <div className="w-50 m-auto">
                <BootstrapAlert
                    text={"There's no token exists"}
                    type="danger"
                />
            </div>
        );
    }

    function verifyEmailToken(emailToken) {
        axios
            .get(
                process.env.NEXT_PUBLIC_API_URL +
                    "/auth/verify/email/" +
                    emailToken
            )
            .then((response) => {
                // Check the response status
                if (response.data.status === 200) {
                    setVerifyingStatus(
                        <div className="w-50 m-auto">
                            <BootstrapAlert
                                text={response.data.message}
                                type="success"
                            />
                        </div>
                    );
                } else {
                    setVerifyingStatus(
                        <div className="w-50 m-auto">
                            <BootstrapAlert
                                text={response.data.message}
                                type="danger"
                            />
                        </div>
                    );
                }
            })
            .catch((error) => {
                toastAlert(error, "error");
            });
    }

    return <StudentTemplate>{verifyingStatus}</StudentTemplate>;
}
