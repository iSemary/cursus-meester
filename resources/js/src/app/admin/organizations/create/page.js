"use client";
import React, { useEffect, useState } from "react";
import DashboardTemplate from "../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../layouts/dashboard/DashboardTitle";
import axiosConfig from "../../../components/axiosConfig/axiosConfig";
import toastAlert from "../../../components/utilities/Alert";
import FormEditor from "../components/FormEditor";
export default function createOrganization() {
    const initialOrganization = {
        name: "",
        slug: "",
        description: "",
        industry_id: 0,
        logo: null,
        status: 1,
    };

    const [organization, setOrganization] = useState(initialOrganization);
    const [formLoading, setFormLoading] = useState(false);

    /** Calls store api with the inserted data */
    const handleSubmitForm = (e) => {
        e.preventDefault();
        setFormLoading(true);
        // Prepare data
        const formData = new FormData();
        for (const [key, value] of Object.entries(organization)) {
            formData.append(key, value);
        }

        axiosConfig
            .post("organizations", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                setFormLoading(false);
                toastAlert(response.data.message, "success");
                setOrganization(initialOrganization);
            })
            .catch(({ response }) => {
                setFormLoading(false);
                toastAlert(response.data.message, "error");
            });
    };

    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Create a new organization"
                path={[
                    { label: "Organizations", url: "/admin/organizations" },
                    { label: "Create", url: "/admin/organizations/create" },
                ]}
            />
            <FormEditor
                organization={organization}
                setOrganization={setOrganization}
                handleSubmitForm={handleSubmitForm}
                formLoading={formLoading}
                btnLabel="Save"
            />
        </DashboardTemplate>
    );
}
