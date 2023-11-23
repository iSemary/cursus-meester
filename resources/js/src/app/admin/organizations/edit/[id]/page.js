"use client";
import React, { useEffect, useState } from "react";
import DashboardTemplate from "../../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../../layouts/dashboard/DashboardTitle";
import axiosConfig from "../../../../components/axiosConfig/axiosConfig";
import toastAlert from "../../../../components/utilities/Alert";
import FormEditor from "../../components/FormEditor";
export default function editOrganization({ params }) {
    const id = params.id;

    const [organization, setOrganization] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        axiosConfig
            .get(process.env.NEXT_PUBLIC_API_URL + "/organizations/" + id)
            .then((response) => {
                setOrganization(response.data.data.organization);
            });
    }, []);
    /** Calls store api with the inserted data */
    const handleSubmitForm = (e) => {
        e.preventDefault();
        setFormLoading(true);
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        // Prepare data
        const formData = new FormData();
        for (const [key, value] of Object.entries(organization)) {
            if (key === "icon" && urlRegex.test(value)) {
                continue;
            } else {
                formData.append(key, value);
            }
        }
        formData.append("_method", "PUT");
        axiosConfig
            .post("organizations/" + id, formData, {
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
                title="Edit organization"
                path={[
                    { label: "Organizations", url: "/admin/organizations" },
                    { label: "Edit", url: "" },
                    { label: organization?.name, url: "" },
                ]}
            />
            {organization && (
                <FormEditor
                    organization={organization}
                    setOrganization={setOrganization}
                    handleSubmitForm={handleSubmitForm}
                    formLoading={formLoading}
                    btnLabel="Update"
                />
            )}
        </DashboardTemplate>
    );
}
