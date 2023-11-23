"use client";
import React, { useEffect, useState } from "react";
import DashboardTemplate from "../../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../../layouts/dashboard/DashboardTitle";
import axiosConfig from "../../../../components/axiosConfig/axiosConfig";
import toastAlert from "../../../../components/utilities/Alert";
import FormEditor from "../../components/FormEditor";
export default function editIndustry({ params }) {
    const id = params.id;

    const [industry, setIndustry] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        axiosConfig
            .get(process.env.NEXT_PUBLIC_API_URL + "/industries/" + id)
            .then((response) => {
                setIndustry(response.data.data.industry);
            });
    }, []);
    /** Calls store api with the inserted data */
    const handleSubmitForm = (e) => {
        e.preventDefault();
        setFormLoading(true);
        // Prepare data
        const formData = new FormData();
        for (const [key, value] of Object.entries(industry)) {
            formData.append(key, value);
        }
        formData.append("_method", "PUT");
        axiosConfig
            .post("industries/" + id, formData, {
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
                title="Edit industry"
                path={[
                    { label: "Categories", url: "/admin/categories" },
                    { label: "Edit", url: "" },
                    { label: industry?.title, url: "" },
                ]}
            />
            {industry && (
                <FormEditor
                    industry={industry}
                    setIndustry={setIndustry}
                    handleSubmitForm={handleSubmitForm}
                    formLoading={formLoading}
                    btnLabel="Update"
                />
            )}
        </DashboardTemplate>
    );
}
