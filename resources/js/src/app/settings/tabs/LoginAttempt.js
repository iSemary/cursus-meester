import { Grid } from "gridjs-react";
import React, { useMemo } from "react";
import Card from "react-bootstrap/Card";

export default function LoginAttempt() {
    const data = [
        ["261 Erdman Ford", "East Daphne", "Kentucky"],
        ["769 Dominic Grove", "Columbus", "Ohio"],
        ["566 Brakus Inlet", "South Linda", "West Virginia"],
        ["722 Emie Stream", "Lincoln", "Nebraska"],
        ["32188 Larkin Turnpike", "Charleston", "South Carolina"],
    ];

    return (
        <Card>
            <Card.Header>
                <Card.Title className="font-weight-bold">
                    Login Attempt
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Grid
                    data={data}
                    columns={["Attempt At", "IP Address", "Device"]}
                    search={true}
                    pagination={{
                        limit: 20,
                    }}
                />
            </Card.Body>
        </Card>
    );
}
