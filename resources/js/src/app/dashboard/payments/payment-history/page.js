"use client";
import { useState } from "react";
import DashboardTemplate from "../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../layouts/dashboard/DashboardTitle";

export default function paymentHistory() {
    const [paymentHistory, setPaymentHistory] = useState([]);

    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Payout"
                path={[
                    { label: "Payments", url: "" },
                    { label: "Payment History", url: "" },
                ]}
            />
        </DashboardTemplate>
    );
}
