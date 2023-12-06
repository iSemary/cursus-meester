"use client";
import { useState } from "react";
import DashboardTemplate from "../../Templates/DashboardTemplate";
import DashboardTitle from "../../layouts/dashboard/DashboardTitle";
import { Grid } from "gridjs-react";
import { _ } from "gridjs-react";
import { Token } from "../../components/utilities/Authentication/Token";
import axiosConfig from "../../components/axiosConfig/axiosConfig";
import { Button } from "primereact/button";
import ExamResultPreview from "./ExamResultPreview";

export default function examResults() {
    const [showExamModal, setShowExamModal] = useState(false);
    const [exam, setExam] = useState({});

    /** Get full results of student exam */
    const handleGetResults = (id) => {
        axiosConfig
            .get("/exam/results/" + id)
            .then((response) => {
                setShowExamModal(true);
                setExam(response.data.data.results);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Exam Results"
                path={[{ label: "Exam Results", url: "" }]}
            />

            <ExamResultPreview
                exam={exam}
                isShow={showExamModal}
                setShowExamModal={setShowExamModal}
            />

            <Grid
                server={{
                    url: `${process.env.NEXT_PUBLIC_API_URL}/exam/results/`,
                    headers: {
                        Authorization: "Bearer " + Token.get(),
                    },
                    then: (data) =>
                        data.data.results.data.map((result) => [
                            result.title,
                            result.full_name,
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
                    "Last Updated",
                    {
                        name: "Actions",
                        formatter: (cell, row) => {
                            return _(
                                <Button
                                    label="View Results"
                                    onClick={() =>
                                        handleGetResults(row.cells[3].data)
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
