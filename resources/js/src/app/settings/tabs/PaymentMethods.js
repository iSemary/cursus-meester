import React, { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import AddPaymentMethod from "./modals/AddPaymentMethod";
import { Grid } from "gridjs-react";

export default function PaymentMethods() {
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);

    return (
        <Card>
            <Card.Header>
                <Row>
                    <Col md={6}>
                        <Card.Title className="font-weight-bold">
                            Payment Methods
                        </Card.Title>
                    </Col>
                    <Col md={6} className="text-right">
                        <Button variant="primary" onClick={handleShow}>
                            Add new payment method
                        </Button>
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
                <AddPaymentMethod show={show} setShow={setShow} />
                <div>
                    <Grid
                        data={[
                            ["John", "john@example.com"],
                            ["Mike", "mike@gmail.com"],
                        ]}
                        columns={["Name", "Email"]}
                        search={true}
                        pagination={{
                            limit: 20,
                        }}
                    />
                </div>
            </Card.Body>
        </Card>
    );
}
