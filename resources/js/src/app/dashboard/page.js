"use client";
import React, { useEffect, useState } from "react";
import DashboardTemplate from "../Templates/DashboardTemplate";
import { Card, Col, Row } from "react-bootstrap";
import NPSChart from "./helpers/charts/NPSChart";
import TopCoursesChart from "./helpers/charts/TopCoursesChart";
import CounterCard from "./helpers/cards/CounterCard";
import axiosConfig from "../components/axiosConfig/axiosConfig";

export default function Dashboard() {
    const [card, setCard] = useState({});
    const [chart, setChart] = useState({});

    useEffect(() => {
        axiosConfig.get("dashboard/index").then((response) => {
            setCard(response.data.data.response.counter);
            setChart(response.data.data.response.charts);
        });
    }, []);

    return (
        <DashboardTemplate>
            {/* Top 4 Counter Cards */}
            <Card className="mb-5">
                <Row>
                    <Col md={3}>
                        <CounterCard
                            title={"Courses"}
                            icon={"pi pi-user"}
                            count={card?.total_courses}
                            path={"/dashboard/courses"}
                        />
                    </Col>
                    <Col md={3}>
                        <CounterCard
                            title={"Students"}
                            icon={"pi pi-users"}
                            count={card?.total_students}
                            path={"/dashboard/courses"}
                        />
                    </Col>
                    <Col md={3}>
                        <CounterCard
                            title={"Overall Rate"}
                            icon={"pi pi-user"}
                            count={card?.overall_rate}
                            path={"/dashboard/courses"}
                        />
                    </Col>
                    <Col md={3}>
                        <CounterCard
                            title={"Total Revenue"}
                            icon={"pi pi-user"}
                            count={card?.total_revenue}
                            path={"/dashboard/courses"}
                        />
                    </Col>
                </Row>
            </Card>
            <hr/>
            {/* Top 2 Charts */}
            <Card className="mt-2">
                <Row>
                    <Col md={6}>
                        <NPSChart rate={card?.overall_rate} />
                    </Col>
                    <Col md={6}>
                        <TopCoursesChart labels={chart?.top_courses?.labels} values={chart?.top_courses?.values} />
                    </Col>
                </Row>
            </Card>
        </DashboardTemplate>
    );
}
