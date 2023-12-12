"use client";
import React, { useEffect, useState } from "react";
import StudentTemplate from "../../Templates/StudentTemplate";
import TaskLoader from "../../components/loaders/TaskLoader";
import axiosConfig from "../../components/axiosConfig/axiosConfig";
import "@lottiefiles/lottie-player";
import Cookies from "js-cookie";

export default function PaymentChecker({ params }) {
    const reference = params.reference;
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosConfig
            .get(`payments/${reference}/check`)
            .then((response) => {
                Cookies.set("PAYMENT_STATUS_" + reference, response.data.data.status);
                setLoading(false);
                setStatus(response.data.data.status);
            })
            .catch(({ response }) => {
                Cookies.set("PAYMENT_STATUS_" + reference, false);
                setLoading(false);
                setStatus(false);
            });
    }, [reference]);

    return (
        <StudentTemplate>
            {loading ? (
                <TaskLoader />
            ) : (
                <div className="text-center">
                    <div>
                        <lottie-player
                            autoplay
                            loop
                            mode="normal"
                            style={{
                                width: "350px",
                                height: "350px",
                                margin: "0 auto",
                            }}
                            className="text-center"
                            src={
                                status
                                    ? "/assets/images/gif/success.json"
                                    : "/assets/images/gif/failure.json"
                            }
                            aria-label={
                                status
                                    ? "Success Animation"
                                    : "Failure Animation"
                            }
                        ></lottie-player>
                        <div className="mt-0 text-center">
                            <h6 className="m-0 font-weight-bold">
                                {status ? "Congratulations!" : "Oops!"}
                            </h6>
                            <br />
                            <p>
                                {status
                                    ? "Your payment has been successfully processed. Thank you for your purchase!"
                                    : "It looks like there was an issue processing your payment. Please try again or contact support for assistance."}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </StudentTemplate>
    );
}
