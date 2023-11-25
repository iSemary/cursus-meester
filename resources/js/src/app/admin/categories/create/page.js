"use client";
import React, { useEffect, useState } from "react";
import DashboardTemplate from "../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../layouts/dashboard/DashboardTitle";
import axiosConfig from "../../../components/axiosConfig/axiosConfig";
import toastAlert from "../../../components/utilities/Alert";
import FormEditor from "../components/FormEditor";
export default function createCategory() {
    const initialCategory = {
        title: "",
        slug: "",
        parent_id: 0,
        icon: null,
        order_number: 0,
        status: 1,
    };

    const [category, setCategory] = useState(initialCategory);
    const [parentCategories, setParentCategories] = useState([]);
    const [formLoading, setFormLoading] = useState(false);
    useEffect(() => {
        axiosConfig
            .get(process.env.NEXT_PUBLIC_API_URL + "/categories?all=true")
            .then((response) => {
                setParentCategories(response.data.data.categories);
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

        axiosConfig
            .post("categories", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                setFormLoading(false);
                toastAlert(response.data.message, "success");
                setCategory(initialCategory);
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
                    { label: "Create", url: "/admin/categories/create" },
                ]}
            />
            <FormEditor
                category={category}
                setCategory={setCategory}
                parentCategories={parentCategories}
                setParentCategories={setParentCategories}
                handleSubmitForm={handleSubmitForm}
                formLoading={formLoading}
                btnLabel="Save"
            />
        </DashboardTemplate>
    );
}
