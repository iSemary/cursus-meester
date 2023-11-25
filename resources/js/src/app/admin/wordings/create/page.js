"use client";
import React, { useState } from "react";
import DashboardTemplate from "../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../layouts/dashboard/DashboardTitle";
import axiosConfig from "../../../components/axiosConfig/axiosConfig";
import toastAlert from "../../../components/utilities/Alert";
import FormEditor from "../components/FormEditor";
export default function createWording() {
    const initialWording = {
        wording_key: "",
        wording_value: "",
    };

    const [wording, setWording] = useState(initialWording);
    const [formLoading, setFormLoading] = useState(false);

    /** Calls store api with the inserted data */
    const handleSubmitForm = (e) => {
        e.preventDefault();
        setFormLoading(true);
        // Prepare data
        const formData = new FormData();
        for (const [key, value] of Object.entries(wording)) {
            formData.append(key, value);
        }

        axiosConfig
            .post("wordings", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                setFormLoading(false);
                toastAlert(response.data.message, "success");
                setWording(initialWording);
            })
            .catch(({ response }) => {
                setFormLoading(false);
                toastAlert(response.data.message, "error");
            });
    };

    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Create a new wording"
                path={[
                    { label: "Wordings", url: "/admin/wordings" },
                    { label: "Create", url: "/admin/wordings/create" },
                ]}
            />
            <FormEditor
                wording={wording}
                setWording={setWording}
                handleSubmitForm={handleSubmitForm}
                formLoading={formLoading}
                btnLabel="Save"
            />
        </DashboardTemplate>
    );
}
