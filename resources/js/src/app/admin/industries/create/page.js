"use client";
import React, { useState } from "react";
import DashboardTemplate from "../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../layouts/dashboard/DashboardTitle";
import axiosConfig from "../../../components/axiosConfig/axiosConfig";
import toastAlert from "../../../components/utilities/Alert";
import FormEditor from "../components/FormEditor";
export default function createIndustry() {
    const initialIndustry = {
        title: "",
        slug: "",
        description: "",
    };

    const [industry, setIndustry] = useState(initialIndustry);
    const [formLoading, setFormLoading] = useState(false);

    /** Calls store api with the inserted data */
    const handleSubmitForm = (e) => {
        e.preventDefault();
        setFormLoading(true);
        // Prepare data
        const formData = new FormData();
        for (const [key, value] of Object.entries(industry)) {
            formData.append(key, value);
        }

        axiosConfig
            .post("industries", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                setFormLoading(false);
                toastAlert(response.data.message, "success");
                setIndustry(initialIndustry);
            })
            .catch(({ response }) => {
                setFormLoading(false);
                toastAlert(response.data.message, "error");
            });
    };

    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Create a new industry"
                path={[
                    { label: "Industries", url: "/admin/industries" },
                    { label: "Create", url: "/admin/industries/create" },
                ]}
            />
            <FormEditor
                industry={industry}
                setIndustry={setIndustry}
                handleSubmitForm={handleSubmitForm}
                formLoading={formLoading}
                btnLabel="Save"
            />
        </DashboardTemplate>
    );
}
