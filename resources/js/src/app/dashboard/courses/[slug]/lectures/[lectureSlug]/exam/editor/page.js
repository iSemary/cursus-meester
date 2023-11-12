"use client";
import React, { useState } from "react";
import DashboardTemplate from "../../../../../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../../../../../layouts/dashboard/DashboardTitle";
import ExamEditor from "../components/ExamEditor";

export default function examEditor({ params }) {
    const initialExam = {
        title: "Exam Title",
        description: "Exam Description",
        status: true,
    };
    const [exam, setExam] = useState(initialExam);
    const initialQuestion = [
        {
            title: "Open Question Example",
            type: 1,
        },
        {
            title: "Single Choice Question Example",
            type: 2,
            options: [
                {
                    title: "Yes",
                    order_number: 1,
                },
                {
                    title: "No",
                    order_number: 2,
                },
                {
                    title: "Others",
                    order_number: 3,
                },
            ],
        },
        {
            title: "Multiple Choices Question Example",
            type: 3,
            options: [
                {
                    title: "Yes",
                    order_number: 1,
                },
                {
                    title: "No",
                    order_number: 2,
                },
                {
                    title: "Others",
                    order_number: 3,
                },
            ],
        },
    ];
    const [examQuestions, setExamQuestions] = useState(initialQuestion);
    const [formLoading, setFormLoading] = useState(false);

    const handleSubmitForm = (e) => {
        e.preventDefault();
        setFormLoading(true);
    };

    return (
        <DashboardTemplate>
            <DashboardTitle
                title={`"${params.lectureSlug}" lecture exam`}
                path={[
                    { label: "Courses", url: "/dashboard/courses" },
                    { label: params.slug },
                    {
                        label: "Lectures",
                        url: "/dashboard/courses/" + params.slug + "/lectures",
                    },
                    { label: params.lectureSlug },
                    { label: "Exam" },
                ]}
            />
            <ExamEditor
                exam={exam}
                setExam={setExam}
                examQuestions={examQuestions}
                setExamQuestions={setExamQuestions}
                formLoading={formLoading}
                handleSubmitForm={handleSubmitForm}
                btnLabel="Save"
            />
        </DashboardTemplate>
    );
}
