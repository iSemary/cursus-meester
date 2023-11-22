"use client";
import React from "react";
import DashboardTemplate from "../../Templates/DashboardTemplate";
import DashboardTitle from "../../layouts/dashboard/DashboardTitle";
import { Grid } from "gridjs-react";
import { _ } from "gridjs-react";
import Swal from "sweetalert2";
import axiosConfig from "../../components/axiosConfig/axiosConfig";
import { Token } from "../../components/utilities/Authentication/Token";
import Link from "next/link";
import { SplitButton } from "primereact/splitbutton";
import toastAlert from "../../components/utilities/Alert";
import { Button } from "primereact/button";

export default function Categories() {
    const dropDownItems = (id) => [
        {
            label: "Delete",
            icon: "pi pi-trash",
            command: () => {
                handleDeleteCategory(id);
            },
        },
    ];

    /** Delete course by slug */
    const handleDeleteCategory = (slug) => {
        Swal.fire({
            title: "Are you sure you want to delete this category?",
            showCancelButton: true,
            confirmButtonText: "Delete",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return axiosConfig
                    .delete("/categories/" + slug)
                    .then((response) => {
                        return true;
                    })
                    .catch((error) => {
                        Swal.showValidationMessage(`Something went wrong`);
                    });
            },
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                toastAlert("Category deleted successfully", "success");
            }
        });
    };
    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Categories"
                path={[{ label: "Categories", url: "/admin/categories" }]}
                buttons={[
                    <Link href="/admin/categories/create">
                        <Button label="Create" size="small" />
                    </Link>,
                ]}
            ></DashboardTitle>
            <Grid
                server={{
                    url: `${process.env.NEXT_PUBLIC_API_URL}/categories`,
                    headers: {
                        Authorization: "Bearer " + Token.get(),
                    },
                    then: (data) =>
                        data.data.categories.data.map((category) => [
                            category.title,
                            category.slug,
                            category.id,
                        ]),
                    total: (data) => data.data.categories.total,
                }}
                pagination={{
                    limit: 5,
                    server: {
                        url: (prev, page, limit) => `${prev}?page=${page}`,
                    },
                }}
                columns={[
                    "Name",
                    "Slug",
                    {
                        name: "Actions",
                        formatter: (cell, row) => {
                            return _(
                                <SplitButton
                                    label={
                                        <Link
                                            href={
                                                "/admin/categories/edit/" +
                                                row.cells[2].data 
                                            }
                                            className="text-white no-link"
                                        >
                                            Edit
                                        </Link>
                                    }
                                    raised
                                    rounded
                                    model={dropDownItems(row.cells[2].data)}
                                />
                            );
                        },
                    },
                ]}
            />
        </DashboardTemplate>
    );
}
