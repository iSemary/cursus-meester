"use client";
import React, { useEffect, useState } from "react";
import DashboardTemplate from "../../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../../layouts/dashboard/DashboardTitle";
import axiosConfig from "../../../../components/axiosConfig/axiosConfig";
import toastAlert from "../../../../components/utilities/Alert";
import FormEditor from "../../components/FormEditor";
export default function editCategory({ params }) {
    const id = params.id;

    const [category, setCategory] = useState({});
    const [formLoading, setFormLoading] = useState(false);
    const [parentCategories, setParentCategories] = useState([]);

    useEffect(() => {
        axiosConfig
            .get(process.env.NEXT_PUBLIC_API_URL + "/categories?all=true")
            .then((response) => {
                setParentCategories(response.data.data.categories);
            });

        axiosConfig
            .get(process.env.NEXT_PUBLIC_API_URL + "/categories/" + id)
            .then((response) => {
                setCategory(response.data.data.category);
            });
    }, []);
    /** Calls store api with the inserted data */
    const handleSubmitForm = (e) => {
        e.preventDefault();
        setFormLoading(true);
        // Prepare data
        const formData = new FormData();
        for (const [key, value] of Object.entries(category)) {
            formData.append(key, value);
        }
        formData.append("_method", "PUT");
        axiosConfig
            .post("categories/" + id, formData, {
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
                title="Create a new category"
                path={[
                    { label: "Categories", url: "/admin/categories" },
                    { label: "Edit", url: "" },
                ]}
            />
            <FormEditor
                category={category}
                setCategory={setCategory}
                parentCategories={parentCategories}
                setParentCategories={setParentCategories}
                handleSubmitForm={handleSubmitForm}
                formLoading={formLoading}
                btnLabel="Update"
            />
        </DashboardTemplate>
    );
}
