"use client";
import { useState } from "react";
import DashboardTemplate from "../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../layouts/dashboard/DashboardTitle";

export default function payout() {
    const [paymentDetails, setPaymentDetails] = useState({});

    const handlePayOut = () => {};

    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Payout"
                path={[
                    { label: "Payments", url: "" },
                    { label: "Payout", url: "" },
                ]}
            />
        </DashboardTemplate>
    );
}
