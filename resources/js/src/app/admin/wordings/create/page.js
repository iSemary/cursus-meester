"use client";
import React, { useState } from "react";
import DashboardTemplate from "../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../layouts/dashboard/DashboardTitle";
import axiosConfig from "../../../components/axiosConfig/axiosConfig";
import toastAlert from "../../../components/utilities/Alert";
import FormEditor from "../components/FormEditor";
export default function createLanguage() {
    const initialLanguage = {
        name: "",
        key: "",
    };

    const [language, setLanguage] = useState(initialLanguage);
    const [formLoading, setFormLoading] = useState(false);

    /** Calls store api with the inserted data */
    const handleSubmitForm = (e) => {
        e.preventDefault();
        setFormLoading(true);
        // Prepare data
        const formData = new FormData();
        for (const [key, value] of Object.entries(language)) {
            formData.append(key, value);
        }

        axiosConfig
            .post("languages", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                setFormLoading(false);
                toastAlert(response.data.message, "success");
                setLanguage(initialLanguage);
            })
            .catch(({ response }) => {
                setFormLoading(false);
                toastAlert(response.data.message, "error");
            });
    };

    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Create a new language"
                path={[
                    { label: "Languages", url: "/admin/languages" },
                    { label: "Create", url: "/admin/languages/create" },
                ]}
            />
            <FormEditor
                language={language}
                setLanguage={setLanguage}
                handleSubmitForm={handleSubmitForm}
                formLoading={formLoading}
                btnLabel="Save"
            />
        </DashboardTemplate>
    );
}
