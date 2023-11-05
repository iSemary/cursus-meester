import React from "react";
import { Grid } from "gridjs-react";
import Card from "react-bootstrap/Card";
import { Token } from "../../components/utilities/Authentication/Token";

export default function LoginAttempt() {
    return (
        <Card>
            <Card.Header>
                <Card.Title className="font-weight-bold">
                    Login Attempt
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Grid
                    server={{
                        url: `${process.env.NEXT_PUBLIC_API_URL}/auth/attempts`,
                        headers: {
                            Authorization: "Bearer " + Token.get(),
                        },
                        then: (data) =>
                            data.data.data.data.map((attempt) => [
                                attempt.created_at,
                                attempt.ip,
                                attempt.agent,
                            ]),
                        total: (data) => data.data.data.total,
                    }}
                    pagination={{
                        limit: 5,
                        server: {
                            url: (prev, page, limit) => `${prev}?page=${page}`,
                        },
                    }}
                    columns={["Attempt At", "IP Address", "Device"]}
                />
            </Card.Body>
        </Card>
    );
}
