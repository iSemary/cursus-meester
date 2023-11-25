"use client";
import React from "react";
import DashboardTemplate from "../../Templates/DashboardTemplate";
import DashboardTitle from "../../layouts/dashboard/DashboardTitle";
import { Grid } from "gridjs-react";
import { _ } from "gridjs-react";
import Swal from "sweetalert2";
import axiosConfig from "../../components/axiosConfig/axiosConfig";
import { Token } from "../../components/utilities/Authentication/Token";
import toastAlert from "../../components/utilities/Alert";
import { Button } from "primereact/button";

export default function coursesApproval() {
    const changeCourseStatus = (id, status) => {
        axiosConfig
            .post("courses/change-status", { id: id, status: status })
            .then((response) => {
                toastAlert(response.data.message, "success");
            });
    };

    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Courses Approval"
                path={[{ label: "Courses Approval", url: "" }]}
            ></DashboardTitle>
            <Grid
                server={{
                    url: `${process.env.NEXT_PUBLIC_API_URL}/courses/all`,
                    headers: {
                        Authorization: "Bearer " + Token.get(),
                    },
                    then: (data) =>
                        data.data.courses.data.map((course) => [
                            course.id,
                            course.title,
                            course.total_lectures,
                            course.status,
                            course.instructor.full_name,
                        ]),
                    total: (data) => data.data.courses.total,
                }}
                pagination={{
                    limit: 5,
                    server: {
                        url: (prev, page, limit) => `${prev}?page=${page}`,
                    },
                }}
                columns={[
                    "#",
                    "Title",
                    "Total Lectures",
                    "Instructor",
                    "Status",
                    {
                        name: "Actions",
                        formatter: (cell, row) => {
                            return _(
                                <div className="d-flex">
                                    <Button
                                        label="Approve"
                                        size="small"
                                        severity="success"
                                        onClick={() =>
                                            changeCourseStatus(
                                                row.cells[0].data,
                                                1
                                            )
                                        }
                                    />
                                    <Button
                                        label="Reject"
                                        size="small"
                                        severity="danger"
                                        onClick={() =>
                                            changeCourseStatus(
                                                row.cells[0].data,
                                                2
                                            )
                                        }
                                    />
                                </div>
                            );
                        },
                    },
                ]}
            />
        </DashboardTemplate>
    );
}
