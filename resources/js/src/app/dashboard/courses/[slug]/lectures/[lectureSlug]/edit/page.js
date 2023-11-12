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
                if (response.data.data.lecture.media_file) {
                    preparingLectureVideo(
                        response.data.data.lecture.media_file
                    );
                }
                if (response.data.data.lecture.additional_files) {
                    response.data.data.lecture.additional_files.map(
                        (file, i) => {
                            console.log(i);
                            preparingLectureFiles(file);
                        }
                    );
                }
            })
            .catch(({ response }) => {
                toastAlert(response.data.message, "error");
            });
    }, [params.slug]);

    const preparingLectureVideo = (videoObject) => {
        if (videoObject.hash_name) {
            setLectureVideo({
                name: videoObject.original_name,
                type: videoObject.mime_type,
                valid: true,
                id: videoObject.hash_name,
                size: videoObject.size,
            });
        }
    };

    const preparingLectureFiles = (videoObject) => {
        setLectureFiles((lectureFiles) => {
            // Check if the new videoObject id is not already in the array
            if (
                !lectureFiles.some((file) => file.id === videoObject.hash_name)
            ) {
                // If not, add the new file to lectureFiles
                return [
                    ...lectureFiles,
                    {
                        name: videoObject.original_name,
                        type: videoObject.mime_type,
                        valid: true,
                        id: videoObject.hash_name,
                        size: videoObject.size,
                    },
                ];
            }
            return lectureFiles;
        });
    };

    const handleSubmitLecture = (e) => {
        e.preventDefault();
        setFormLoading(true);
        axiosConfig
            .post(
                `lectures/${params.lectureSlug}`,
                {
                    _method: "PUT",
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
                    {
                        label: "Lectures",
                        url: "/dashboard/courses/" + params.slug + "/lectures",
                    },
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
