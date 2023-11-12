"use client";
import React, { useEffect, useState } from "react";
import DashboardTemplate from "../../../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../../../layouts/dashboard/DashboardTitle";
import FormEditor from "../components/FormEditor";
import axiosConfig from "../../../../../components/axiosConfig/axiosConfig";
import toastAlert from "../../../../../components/utilities/Alert";
export default function createLecture({ params }) {
    const initialLecture = {
        course_id: "",
        title: "Lecture 1",
        slug: "lecture-1",
        description: "lecture descr",
        order_number: "",
    };

    const [course, setCourse] = useState({});
    const [lecture, setLecture] = useState(initialLecture);

    const [lectureVideo, setLectureVideo] = useState(null);
    const [lectureFiles, setLectureFiles] = useState([]);

    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        // Get Course Details
        axiosConfig
            .get(`courses/${params.slug}`)
            .then((response) => {
                setLecture({
                    ...lecture,
                    course_id: response.data.data.course.id,
                    order_number: response.data.data.course.total_lectures + 1,
                });
                setCourse(response.data.data.course);
            })
            .catch(({ response }) => {
                toastAlert(response.data.message, "error");
            });
    }, [params.slug]);

    const handleSubmitLecture = (e) => {
        e.preventDefault();
        setFormLoading(true);
        axiosConfig
            .post(
                `lectures`,
                {
                    ...lecture,
                    media_file: lectureVideo,
                    files: lectureFiles,
                },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then((response) => {
                setFormLoading(false);
                toastAlert(response.data.message, "success");
            })
            .catch(({ response }) => {
                setFormLoading(false);
                toastAlert(response.data.message, "error");
            });
    };

    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Create a new lecture"
                path={[
                    { label: "Courses", url: "/dashboard/courses" },
                    { label: params.slug },
                    { label: "Lectures" },
                    { label: "Create" },
                ]}
            />
            <FormEditor
                course={course}
                lecture={lecture}
                lectureVideo={lectureVideo}
                setLectureVideo={setLectureVideo}
                lectureFiles={lectureFiles}
                setLectureFiles={setLectureFiles}
                setLecture={setLecture}
                formLoading={formLoading}
                setFormLoading={setFormLoading}
                handleSubmitLecture={handleSubmitLecture}
                btnLabel="Create"
            />
        </DashboardTemplate>
    );
}
