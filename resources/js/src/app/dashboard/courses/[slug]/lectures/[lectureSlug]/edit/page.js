"use client";
import React, { useState } from "react";
import DashboardTemplate from "../../../../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../../../../layouts/dashboard/DashboardTitle";
import FormEditor from "../../components/FormEditor";
export default function createLecture({ params }) {
    const initialLecture = {};

    const [Course, setCourse] = useState({});
    const [Lecture, setLecture] = useState(initialLecture);

    return (
        <DashboardTemplate>
            <DashboardTitle
                title={`Edit "${params.lectureSlug}" lecture`}
                path={[
                    { label: "Courses", url: "/dashboard/courses" },
                    { label: params.slug },
                    { label: "Lectures" },
                    { label: params.lectureSlug },
                    { label: "Edit" },
                ]}
            />

            <FormEditor />
        </DashboardTemplate>
    );
}
