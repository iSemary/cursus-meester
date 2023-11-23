"use client";
import React, { useEffect, useState } from "react";
import DashboardTemplate from "../../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../../layouts/dashboard/DashboardTitle";
import axiosConfig from "../../../../components/axiosConfig/axiosConfig";
import toastAlert from "../../../../components/utilities/Alert";
import FormEditor from "../../components/FormEditor";
export default function editLanguage({ params }) {
    const id = params.id;

    const [language, setLanguage] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        axiosConfig
            .get(process.env.NEXT_PUBLIC_API_URL + "/languages/" + id)
            .then((response) => {
                setLanguage(response.data.data.language);
            });
    }, []);
    /** Calls store api with the inserted data */
    const handleSubmitForm = (e) => {
        e.preventDefault();
        setFormLoading(true);
        // Prepare data
        const formData = new FormData();
        for (const [key, value] of Object.entries(language)) {
            formData.append(key, value);
        }
        formData.append("_method", "PUT");
        axiosConfig
            .post("languages/" + id, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
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
                title="Edit language"
                path={[
                    { label: "Languages", url: "/admin/languages" },
                    { label: "Edit", url: "" },
                    { label: language?.title, url: "" },
                ]}
            />
            {language && (
                <FormEditor
                    language={language}
                    setLanguage={setLanguage}
                    handleSubmitForm={handleSubmitForm}
                    formLoading={formLoading}
                    btnLabel="Update"
                />
            )}
        </DashboardTemplate>
    );
}
