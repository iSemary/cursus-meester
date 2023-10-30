import Link from "next/link";
import React from "react";
import { Card, CardBody, CardTitle } from "react-bootstrap";

function CounterCard({ title, count, icon, path }) {
    return (
        <Card className="counter-card">
            <Link href={path}>
                <CardTitle>
                    <i className={icon}></i>
                    {title}
                </CardTitle>
                <CardBody>{Number(count).toLocaleString()}</CardBody>
            </Link>
        </Card>
    );
}

export default CounterCard;
