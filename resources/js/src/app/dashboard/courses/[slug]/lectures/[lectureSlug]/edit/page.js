"use client";
import React, { useEffect, useState } from "react";
import DashboardTemplate from "../../../../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../../../../layouts/dashboard/DashboardTitle";
import FormEditor from "../../components/FormEditor";
import axiosConfig from "../../../../../../components/axiosConfig/axiosConfig";
import toastAlert from "../../../../../../components/utilities/Alert";
export default function createLecture({ params }) {
    const [lecture, setLecture] = useState({});

    const [lectureVideo, setLectureVideo] = useState(null);
    const [lectureFiles, setLectureFiles] = useState([]);

    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        // Get Lecture Details
        axiosConfig
            .get(`courses/${params.slug}/lectures/${params.lectureSlug}`)
            .then((response) => {
                setLecture(response.data.data.lecture);
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
                `lectures/${params.lectureSlug}`,
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
                title={`Edit "${params.lectureSlug}" lecture`}
                path={[
                    { label: "Courses", url: "/dashboard/courses" },
                    { label: params.slug },
                    { label: "Lectures" },
                    { label: params.lectureSlug },
                    { label: "Edit" },
                ]}
            />
            <FormEditor
                lecture={lecture}
                lectureVideo={lectureVideo}
                setLectureVideo={setLectureVideo}
                lectureFiles={lectureFiles}
                setLectureFiles={setLectureFiles}
                setLecture={setLecture}
                formLoading={formLoading}
                setFormLoading={setFormLoading}
                handleSubmitLecture={handleSubmitLecture}
                btnLabel="Update"
            />
        </DashboardTemplate>
    );
}
