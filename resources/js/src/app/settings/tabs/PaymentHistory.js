import React from "react";
import { Col, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { Grid } from "gridjs-react";
import { Token } from "../../components/utilities/Authentication/Token";

export default function PaymentHistory() {
    return (
        <Card>
            <Card.Header>
                <Row>
                    <Col md={6}>
                        <Card.Title className="font-weight-bold">
                            Payment History
                        </Card.Title>
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
                <Grid
                    server={{
                        url: `${process.env.NEXT_PUBLIC_API_URL}/payments/history`,
                        headers: {
                            Authorization: "Bearer " + Token.get(),
                        },
                        then: (data) =>
                            data.data.payment_history.data.map((payment) => [
                                payment.reference_number,
                                payment.transaction_number,
                                payment.total_price,
                                payment.status,
                                payment.payment_method,
                                payment.payment_type,
                                payment.updated_at_diff,
                            ]),
                        total: (data) => data.data.payment_history.total,
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
                        "Payment Method",
                        "Type",
                        "Last Updated",
                    ]}
                />
            </Card.Body>
        </Card>
    );
}
