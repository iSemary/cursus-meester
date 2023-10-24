import React from "react";
import DashboardTemplate from "../Templates/DashboardTemplate";
import { Card, Col, Row } from "react-bootstrap";
import NPSChart from "./helpers/charts/NPSChart";
import TopCoursesChart from "./helpers/charts/TopCoursesChart";
import CounterCard from "./helpers/cards/CounterCard";

export default function Dashboard() {
    return (
        <DashboardTemplate>
            {/* Top 4 Counter Cards */}
            <Card className="mb-5">
                <Row>
                    <Col md={3}>
                        <CounterCard
                            title={"Courses"}
                            icon={"pi pi-user"}
                            count={"504515847"}
                            path={"/dashboard/courses"}
                        />
                    </Col>
                    <Col md={3}>
                        <CounterCard
                            title={"Courses"}
                            icon={"pi pi-user"}
                            count={"504515847"}
                            path={"/dashboard/courses"}
                        />
                    </Col>
                    <Col md={3}>
                        <CounterCard
                            title={"Courses"}
                            icon={"pi pi-user"}
                            count={"504515847"}
                            path={"/dashboard/courses"}
                        />
                    </Col>
                    <Col md={3}>
                        <CounterCard
                            title={"Courses"}
                            icon={"pi pi-user"}
                            count={"504515847"}
                            path={"/dashboard/courses"}
                        />
                    </Col>
                </Row>
            </Card>
            {/* Top 2 Charts */}
            <Card>
                <Row>
                    <Col md={6}>
                        <NPSChart />
                    </Col>
                    <Col md={6}>
                        <TopCoursesChart />
                    </Col>
                </Row>
            </Card>
        </DashboardTemplate>
    );
}
