"use client";
import DashboardTemplate from "../../../Templates/DashboardTemplate";
import { Token } from "../../../components/utilities/Authentication/Token";
import DashboardTitle from "../../../layouts/dashboard/DashboardTitle";
import { Grid } from "gridjs-react";

export default function paymentHistory() {
    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Payment History"
                path={[
                    { label: "Payout", url: "/dashboard/payments/payout" },
                    { label: "Payment History", url: "" },
                ]}
            />
            <div>
                <Grid
                    server={{
                        url: `${process.env.NEXT_PUBLIC_API_URL}/payments/payout/history`,
                        headers: {
                            Authorization: "Bearer " + Token.get(),
                        },
                        then: (data) =>
                            data.data.payout_history.data.map((payment) => [
                                payment.reference_number,
                                payment.transaction_number,
                                payment.total_price,
                                payment.status,
                                payment.transferred_email,
                                payment.payment_method,
                                payment.updated_at_diff,
                            ]),
                        total: (data) => data.data.payout_history.total,
                    }}
                    pagination={{
                        limit: 5,
                        server: {
                            url: (prev, page, limit) => `${prev}?page=${page+1}`,
                        },
                    }}
                    columns={[
                        "Reference Number",
                        "Transaction Number",
                        "Final Price",
                        "Status",
                        "Transferred Email",
                        "Payment Method",
                        "Last Updated",
                    ]}
                />
            </div>
        </DashboardTemplate>
    );
}
