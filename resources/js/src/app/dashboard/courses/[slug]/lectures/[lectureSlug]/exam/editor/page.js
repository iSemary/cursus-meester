"use client";
import React, { useState } from "react";
import DashboardTemplate from "../../../../../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../../../../../layouts/dashboard/DashboardTitle";
import ExamEditor from "../components/ExamEditor";
import { PiExamDuotone } from "react-icons/pi";

export default function examEditor({ params }) {
    const initialExam = {
        title: "Exam Title",
        description: "Exam Description",
        status: true,
    };
    const [exam, setExam] = useState(initialExam);
    const initialQuestion = [
        {
            id: 1,
            title: "Open Question Example",
            type: 1,
        },
        {
            id: 2,
            title: "Single Choice Question Example",
            type: 2,
            options: [
                {
                    valid_option: 1,
                    title: "Yes",
                    order_number: 1,
                },
                {
                    valid_option: 0,
                    title: "No",
                    order_number: 2,
                },
                {
                    valid_option: 0,
                    title: "Other",
                    order_number: 3,
                },
                {
                    valid_option: 0,
                    title: "All the above",
                    order_number: 4,
                },
            ],
        },
        {
            id: 3,
            title: "Multiple Choices Question Example",
            type: 3,
            options: [
                {
                    valid_option: 0,
                    title: "Yes",
                    order_number: 1,
                },
                {
                    valid_option: 0,
                    title: "No",
                    order_number: 2,
                },
                {
                    valid_option: 1,
                    title: "Other",
                    order_number: 3,
                },
                {
                    valid_option: 0,
                    title: "All the above",
                    order_number: 4,
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
                icon={<PiExamDuotone />}
                title={`"${params.lectureSlug}" exam`}
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
