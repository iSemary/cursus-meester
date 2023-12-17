"use client";
import React, { useEffect, useState } from "react";
import DashboardTemplate from "../../../../../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../../../../../layouts/dashboard/DashboardTitle";
import ExamEditor from "../components/ExamEditor";
import { PiExamDuotone } from "react-icons/pi";
import axiosConfig from "../../../../../../../components/axiosConfig/axiosConfig";
import toastAlert from "../../../../../../../components/utilities/Alert";

export default function examEditor({ params }) {
    const initialExam = {
        title: "Exam Title",
        description: "Exam Description",
        status: true,
    };
    const [exam, setExam] = useState({});
    const initialQuestion = [
        {
            id: -1,
            title: "Open Question Example",
            type: 1,
        },
        {
            id: -2,
            title: "Single Choice Question Example",
            type: 2,
            options: [
                {
                    valid_answer: 1,
                    title: "Yes",
                    order_number: 1,
                },
                {
                    valid_answer: 0,
                    title: "No",
                    order_number: 2,
                },
                {
                    valid_answer: 0,
                    title: "Other",
                    order_number: 3,
                },
                {
                    valid_answer: 0,
                    title: "All the above",
                    order_number: 4,
                },
            ],
        },
        {
            id: -3,
            title: "Multiple Choices Question Example",
            type: 3,
            options: [
                {
                    valid_answer: 0,
                    title: "Yes",
                    order_number: 1,
                },
                {
                    valid_answer: 0,
                    title: "No",
                    order_number: 2,
                },
                {
                    valid_answer: 1,
                    title: "Other",
                    order_number: 3,
                },
                {
                    valid_answer: 0,
                    title: "All the above",
                    order_number: 4,
                },
            ],
        },
    ];
    const [examQuestions, setExamQuestions] = useState([]);
    const [formLoading, setFormLoading] = useState(false);

    const handleSubmitForm = (e) => {
        e.preventDefault();
        setFormLoading(true);

        axiosConfig
            .post(`/exams/${params.lectureSlug}`, {
                ...exam,
                questions: examQuestions,
            })
            .then((response) => {
                if (
                    response.data.data.exam &&
                    typeof response.data.data.exam == "object" &&
                    response.data.data.questions &&
                    typeof response.data.data.questions == "object"
                ) {
                    setExam(response.data.data.exam);
                    setExamQuestions(response.data.data.questions);
                    toastAlert(response.data.message, "success");
                    setFormLoading(false);
                }
            })
            .catch(({ response }) => {
                setFormLoading(false);
                toastAlert(response.data.message, "error");
            });
    };

    useEffect(() => {
        // Get exam by selected lecture if exists
        axiosConfig
            .get(`/exams/${params.lectureSlug}`)
            .then((response) => {
                if (
                    response.data.data.exam &&
                    typeof response.data.data.exam == "object"
                ) {
                    setExam(response.data.data.exam);
                    if (
                        response.data.data.questions &&
                        typeof response.data.data.questions == "object"
                    ) {
                        setExamQuestions(response.data.data.questions);
                    }
                } else {
                    setExam(initialExam);
                    setExamQuestions(initialQuestion);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

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
