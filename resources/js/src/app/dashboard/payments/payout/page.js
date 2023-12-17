"use client";
import { useEffect, useState } from "react";
import DashboardTemplate from "../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../layouts/dashboard/DashboardTitle";
import axiosConfig from "../../../components/axiosConfig/axiosConfig";
import toastAlert from "../../../components/utilities/Alert";
import { Card } from "primereact/card";
import TaskLoader from "../../../components/loaders/TaskLoader";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import Image from "next/image";

export default function payout() {
    const [paymentDetails, setPaymentDetails] = useState({});
    const [loading, setLoading] = useState(false);
    const [payLoading, setPayLoading] = useState(false);
    const [transferEmail, setTransferEmail] = useState("");

    const handlePayOut = () => {
        setPayLoading(true);
        axiosConfig
            .post("payments/payout", { email: transferEmail })
            .then((response) => {
                toastAlert(response.data.message, "success");
                getPaymentDetails();
                setPayLoading(false);
            })
            .catch((error) => {
                setPayLoading(false);
                const errorMessage =
                    error.response?.data?.message || "An error occurred";
                toastAlert(errorMessage, "error");
                console.error(error);
            });
    };

    useEffect(() => {
        getPaymentDetails();
    }, []);

    const getPaymentDetails = () => {
        setLoading(true);
        axiosConfig
            .get("payments/payout/details")
            .then((response) => {
                setPaymentDetails(response.data.data.data);
                setTransferEmail(response.data.data.data.email);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Payout"
                path={[
                    { label: "Payments", url: "" },
                    { label: "Payout", url: "" },
                ]}
            />
            <Card>
                {loading ? (
                    <TaskLoader />
                ) : (
                    <div>
                        <table class="table w-100 text-center">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Total Transactions</th>
                                    <th>Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Total</td>
                                    <td>
                                        {
                                            paymentDetails?.totals
                                                ?.total_transactions
                                        }
                                    </td>
                                    <td className="font-weight-bold">
                                        {paymentDetails?.totals
                                            ?.total_transactions_price +
                                            paymentDetails.currency}
                                    </td>
                                </tr>
                                <tr className="text-success">
                                    <td>Available</td>
                                    <td>
                                        {
                                            paymentDetails?.available
                                                ?.total_transactions
                                        }
                                    </td>
                                    <td className="font-weight-bold">
                                        {paymentDetails?.available
                                            ?.total_transactions_price +
                                            paymentDetails.currency}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <hr />
                        <div className="row mt-3">
                            <div className="col-6">
                                <div className="paypal-section">
                                    <Image
                                        src="/assets/images/icons/paypal.png"
                                        width="50"
                                        height="50"
                                        alt="paypal logo"
                                    />
                                    <span className="mx-3 paypal-title">
                                        Get paid through paypal with only rate{" "}
                                        {paymentDetails.rate}%
                                    </span>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="text-right">
                                    <span className="p-input-icon-left">
                                        <i className="pi pi-envelope" />
                                        <InputText
                                            className="no-border-right-radius"
                                            value={transferEmail}
                                            onChange={(e) =>
                                                setTransferEmail(e.target.value)
                                            }
                                            placeholder="Transfer Email Address"
                                            disabled={
                                                paymentDetails.can_get_paid
                                                    ? ""
                                                    : "disabled"
                                            }
                                        />
                                    </span>
                                    <Button
                                        loading={payLoading}
                                        className="no-border-left-radius"
                                        onClick={handlePayOut}
                                        disabled={
                                            paymentDetails.can_get_paid
                                                ? ""
                                                : "disabled"
                                        }
                                        icon="pi pi-credit-card"
                                        label="Get Paid"
                                    />
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="text-center">
                            Total Transferred Amount:{" "}
                            <strong>
                                {paymentDetails.final_amount +
                                    paymentDetails.currency}
                            </strong>
                        </div>
                    </div>
                )}
            </Card>
        </DashboardTemplate>
    );
}
