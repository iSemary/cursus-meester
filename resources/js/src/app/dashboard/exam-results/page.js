"use client";
import DashboardTemplate from "../../Templates/DashboardTemplate";
import DashboardTitle from "../../layouts/dashboard/DashboardTitle";
import { Grid } from "gridjs-react";
import { _ } from "gridjs-react";
import { Token } from "../../components/utilities/Authentication/Token";
import axiosConfig from "../../components/axiosConfig/axiosConfig";
import { Button } from "primereact/button";
export default function examResults() {
    /** Get full results of student exam */
    const handleGetResults = (id) => {
        axiosConfig
            .get("/exam/results/" + id)
            .then((response) => {})
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Exam Results"
                path={[{ label: "Exam Results", url: "" }]}
            />
            <Grid
                server={{
                    url: `${process.env.NEXT_PUBLIC_API_URL}/exam/results/`,
                    headers: {
                        Authorization: "Bearer " + Token.get(),
                    },
                    then: (data) =>
                        data.data.results.data.map((result) => [
                            result.exam_title,
                            result.student_name,
                            result.steps,
                            result.updated_diff,
                            result.id,
                        ]),
                    total: (data) => data.data.results.total,
                }}
                pagination={{
                    limit: 5,
                    server: {
                        url: (prev, page, limit) => `${prev}?page=${page}`,
                    },
                }}
                columns={[
                    "Exam Title",
                    "Student Name",
                    "Steps",
                    "Last Updated",
                    {
                        name: "Actions",
                        formatter: (cell, row) => {
                            return _(
                                <Button
                                    label="View Results"
                                    onClick={() =>
                                        handleGetResults(row.cells[4].data)
                                    }
                                />
                            );
                        },
                    },
                ]}
            />
        </DashboardTemplate>
    );
}
