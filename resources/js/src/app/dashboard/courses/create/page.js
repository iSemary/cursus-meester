"use client";
import React, { useState } from "react";
import DashboardTemplate from "../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../layouts/dashboard/DashboardTitle";
import axiosConfig from "../../../components/axiosConfig/axiosConfig";
import toastAlert from "../../../components/utilities/Alert";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";

export default function createCourse() {
    const router = useRouter();
    const initialCourse = {
        title: "",
        slug: "",
        description: "",
        content: "",
        thumbnail: "",
        skill_level: "",
        category_id: "",
        organization_id: false,
        language_id: "",
        price: 0,
        offer_price: 0,
        offer_percentage: 0,
        offer_expired_at: new Date(),
        has_certificate: 0,
        published_at: new Date(),
    };

    const [course, setCourse] = useState(initialCourse);
    const [thumbnailImage, setThumbnailImage] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    /** Calls store api with the inserted data */
    const handleSubmitCourse = (e) => {
        e.preventDefault();
        setFormLoading(true);
        // Prepare data
        const formData = new FormData();
        for (const [key, value] of Object.entries(course)) {
            const formattedValue =
                value instanceof Date
                    ? value.toLocaleDateString("en-CA", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                      })
                    : value;
            formData.append(key, formattedValue);
        }

        axiosConfig
            .post("courses", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                setFormLoading(false);
                toastAlert(response.data.message, "success");
                setCourse(initialCourse);
                // Navigate to create lectures page with the course slug
                router.push(
                    `/dashboard/courses/${response.data.data.slug}/lectures/create`
                );
            })
            .catch((error) => {
                setFormLoading(false);
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.message
                ) {
                    // Handle specific error message from the server
                    toastAlert(error.response.data.message, "error");
                } else {
                    // Handle other errors (network error, unexpected error)
                    toastAlert(
                        "An error occurred while creating the course",
                        "error"
                    );
                    console.error("Error creating course:", error);
                }
            });
    };

    const FormEditor = dynamic(() => import("../components/FormEditor"), {
        ssr: false,
    });

    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Create a new course"
                path={[
                    { label: "Courses", url: "/dashboard/courses" },
                    { label: "Create", url: "/dashboard/courses/create" },
                ]}
            />
            <div>
                <FormEditor
                    course={course}
                    setCourse={setCourse}
                    setThumbnailImage={setThumbnailImage}
                    handleSubmitCourse={handleSubmitCourse}
                    formLoading={formLoading}
                    setFormLoading={setFormLoading}
                    btnLabel="Save and Create lectures"
                />
                <hr />
                <div className="col-md-3">
                    <h5>Course Thumbnail Image</h5>
                    <Image
                        src={
                            thumbnailImage
                                ? thumbnailImage
                                : "https://placehold.co/600x400/EEE/31343C"
                        }
                        width={600}
                        height={400}
                        className="thumbnail-image course"
                        alt="thumbnail"
                    />
                </div>
            </div>
        </DashboardTemplate>
    );
}
