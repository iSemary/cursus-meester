"use client";
import React, { useEffect, useState } from "react";
import DashboardTemplate from "../../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../../layouts/dashboard/DashboardTitle";
import axiosConfig from "../../../../components/axiosConfig/axiosConfig";
import toastAlert from "../../../../components/utilities/Alert";
import FormEditor from "../../components/FormEditor";
export default function editWording({ params }) {
    const id = params.id;

    const [wording, setWording] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        axiosConfig
            .get(process.env.NEXT_PUBLIC_API_URL + "/wordings/" + id)
            .then((response) => {
                setWording(response.data.data.wording);
            });
    }, []);
    /** Calls store api with the inserted data */
    const handleSubmitForm = (e) => {
        e.preventDefault();
        setFormLoading(true);
        // Prepare data
        const formData = new FormData();
        for (const [key, value] of Object.entries(wording)) {
            formData.append(key, value);
        }
        formData.append("_method", "PUT");
        axiosConfig
            .post("wordings/" + id, formData, {
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
                title="Edit wording"
                path={[
                    { label: "Wordings", url: "/admin/wordings" },
                    { label: "Edit", url: "" },
                    { label: wording?.wording_key, url: "" },
                ]}
            />
            {wording && (
                <FormEditor
                    wording={wording}
                    setWording={setWording}
                    handleSubmitForm={handleSubmitForm}
                    formLoading={formLoading}
                    btnLabel="Update"
                />
            )}
        </DashboardTemplate>
    );
}
