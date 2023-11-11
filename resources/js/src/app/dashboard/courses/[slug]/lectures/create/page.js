"use client";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState } from "react";
import DashboardTemplate from "../../../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../../../layouts/dashboard/DashboardTitle";
export default function createLecture() {
    const initialLecture = {};

    const [Course, setCourse] = useState({});
    const [Lecture, setLecture] = useState(initialLecture);

    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Create a new lecture"
                path={[
                    { label: "Courses", url: "/dashboard/courses" },
                    {
                        label: "Lectures",
                        url: "/dashboard/courses/slug/lectures",
                    },
                    {
                        label: "Create",
                        url: "/dashboard/courses/slug/lectures/create",
                    },
                ]}
            />
        </DashboardTemplate>
    );
}
